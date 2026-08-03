import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type ImageQuality = 'normal' | 'high';

@Component({
  selector: 'app-pdf-to-jpg',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent],
  templateUrl: './pdf-to-jpg.component.html',
  styleUrl: './pdf-to-jpg.component.scss'
})
export class PdfToJpgComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  quality = signal<ImageQuality>('normal');
  
  pdfFile = signal<File | null>(null);
  pdfFileName = signal<string>('');
  pdfThumbnail = signal<string | null>(null);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'PDF to JPG Converter - Free Online | DataUtil',
      description: 'Convert every page of a PDF into high-quality JPG images. Extract images from your PDF online for free.',
      keywords: 'pdf to jpg, convert pdf to image, pdf to jpeg free',
      ogTitle: 'PDF to JPG Converter - Free Online',
      ogDescription: 'Convert every page of a PDF into high-quality JPG images instantly.',
      canonicalUrl: 'https://datautility.com/categories/pdf/pdf-to-jpg'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files[0]) {
      this.loadPdfFile(files[0]);
    }
  }

  async loadPdfFile(file: File): Promise<void> {
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Please upload a valid PDF file.');
      return;
    }
    this.pdfFile.set(file);
    this.pdfFileName.set(file.name);
    this.errorMessage.set('');
    this.state.set('configure');

    try {
      const arrayBuffer = await file.arrayBuffer();
      await this.generateThumbnail(arrayBuffer);
    } catch (e) {
      console.error('Failed to generate thumbnail', e);
    }
  }

  async generateThumbnail(arrayBuffer: ArrayBuffer): Promise<void> {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });

      if (!context) return;

      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const thumbnail = canvas.toDataURL('image/jpeg', 0.82);
      this.pdfThumbnail.set(thumbnail);
      
      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  async processConversion(): Promise<void> {
    this.state.set('processing');
    this.errorMessage.set('');

    try {
      const file = this.pdfFile()!;
      const arrayBuffer = await file.arrayBuffer();

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      let JSZip;
      let zip: any;
      if (numPages > 1) {
        JSZip = (await import('jszip')).default;
        zip = new JSZip();
      }

      const scale = this.quality() === 'high' ? 3.0 : 1.5; // High gives better resolution
      const imageQuality = this.quality() === 'high' ? 0.95 : 0.85;

      const baseName = this.pdfFileName().replace(/\.pdf$/i, '');

      let singleBlobUrl: string | null = null;
      let singleFileName: string | null = null;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        
        const ctx = canvas.getContext('2d', { alpha: false })!;
        // Fill white background just in case there's transparency (JPG doesn't support alpha)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', imageQuality);
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        if (numPages > 1) {
          // Zero-pad page numbers (e.g. 01, 02) if <= 99 pages
          const pageStr = numPages > 9 ? pageNum.toString().padStart(numPages.toString().length, '0') : pageNum;
          zip.file(`${baseName}_page_${pageStr}.jpg`, bytes);
        } else {
          // Single page, handle directly
          const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
          singleBlobUrl = window.URL.createObjectURL(blob);
          singleFileName = `${baseName}.jpg`;
        }
      }

      loadingTask.destroy();

      let dlUrl: string;
      let dlName: string;

      if (numPages > 1 && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = `${baseName}_images.zip`;
      } else {
        dlUrl = singleBlobUrl!;
        dlName = singleFileName!;
      }

      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = dlName;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => { 
        document.body.removeChild(a); 
        window.URL.revokeObjectURL(dlUrl); 
      }, 100);

      this.state.set('complete');
    } catch (error: any) {
      console.error('Conversion error:', error);
      this.errorMessage.set('Failed to convert PDF to JPG. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    // If complete and user clicks download again, convert again 
    // Optimization: could store the zip/blob locally, but rerunning is fine and avoids large memory blobs over time 
    this.processConversion();
  }

  reset(): void {
    this.pdfFile.set(null);
    this.pdfFileName.set('');
    this.pdfThumbnail.set(null);
    this.errorMessage.set('');
    this.quality.set('normal');
    this.state.set('upload');
  }
}
