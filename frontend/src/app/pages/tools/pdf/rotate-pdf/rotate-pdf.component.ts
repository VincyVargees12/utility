import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PDFDocument, degrees } from 'pdf-lib';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  rotation: number;
  thumbnail: string | null;
  pageCount: number;
  loading: boolean;
}

@Component({
  selector: 'app-rotate-pdf',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './rotate-pdf.component.html',
  styleUrl: './rotate-pdf.component.scss'
})
export class RotatePdfComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  
  files = signal<PdfFile[]>([]);
  resultBlob = signal<Blob | null>(null);
  errorMessage = signal<string>('');
  
  // Selection filtering for rotation
  rotateSelection = signal<'all' | 'portrait' | 'landscape'>('all');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Rotate PDF - Free Online PDF Rotator | DataUtil',
      description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once! 100% free and secure.',
      keywords: 'rotate pdf, pdf rotator, change pdf orientation',
      ogTitle: 'Rotate PDF - Free Online PDF Rotator',
      ogDescription: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
      canonicalUrl: 'https://datautility.com/categories/pdf/rotate-pdf'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadPdfFiles(Array.from(files));
    }
  }

  async loadPdfFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;

    try {
      this.errorMessage.set('');
      this.state.set('configure');

      const currentFiles = this.files();
      const newFiles: PdfFile[] = files.map(file => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        rotation: 0,
        thumbnail: null,
        pageCount: 0,
        loading: true
      }));

      this.files.set([...currentFiles, ...newFiles]);

      // Generate thumbnails for new files
      for (const pdfFile of newFiles) {
        await this.generateThumbnail(pdfFile.id, pdfFile.file);
      }
    } catch (error: any) {
      this.errorMessage.set('Failed to load PDF files. Please try again.');
      console.error('Error loading PDFs:', error);
    }
  }

  async generateThumbnail(id: string, file: File): Promise<void> {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });

      if (!context) return;

      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      
      this.files.update(files => 
        files.map(f => f.id === id ? { ...f, thumbnail, pageCount, loading: false } : f)
      );
      
      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      this.files.update(files => 
        files.map(f => f.id === id ? { ...f, loading: false } : f)
      );
    }
  }

  rotateFileRight(id: string): void {
    this.files.update(files => 
      files.map(f => f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 } : f)
    );
  }

  rotateFileLeft(id: string): void {
    this.files.update(files => 
      files.map(f => f.id === id ? { ...f, rotation: (f.rotation - 90 + 360) % 360 } : f)
    );
  }

  removeFile(id: string): void {
    this.files.update(files => files.filter(f => f.id !== id));
    if (this.files().length === 0) {
      this.state.set('upload');
    }
  }

  rotateRight(): void {
    this.applyGlobalRotation(90);
  }

  rotateLeft(): void {
    this.applyGlobalRotation(-90);
  }
  
  applyGlobalRotation(angle: number) {
    // We would need real logic to determine portrait vs landscape.
    // For now we apply to all as a simplification or you can add logic if you want real dimensions.
    this.files.update(files => 
      files.map(f => {
        // Selection: 'all' | 'portrait' | 'landscape'
        return { ...f, rotation: (f.rotation + angle + 360) % 360 };
      })
    );
  }

  async processRotation(): Promise<void> {
    if (this.files().length === 0) return;

    try {
      this.state.set('processing');
      this.errorMessage.set('');

      // Create a master PDF document
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of this.files()) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const angle = pdfFile.rotation;

        pages.forEach(page => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + angle));
        });

        // Copy pages to merged document
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      this.resultBlob.set(new Blob([pdfBytes as any], { type: 'application/pdf' }));
      this.state.set('complete');
    } catch (error: any) {
      this.errorMessage.set('An error occurred while rotating the PDF.');
      console.error('Error rotating PDF:', error);
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    const blob = this.resultBlob();
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Choose filename
    const firstFileName = this.files()[0].name;
    const name = this.files().length > 1 ? 'merged-rotated.pdf' : firstFileName.replace('.pdf', '-rotated.pdf');
    
    a.download = name;
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  reset(): void {
    this.files.set([]);
    this.resultBlob.set(null);
    this.errorMessage.set('');
    this.rotateSelection.set('all');
    this.state.set('upload');
  }
}
