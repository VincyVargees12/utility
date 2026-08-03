import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { COMPRESS_PDF_RESOURCE_CONTENT } from './compress-pdf.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type CompressionLevel = 'extreme' | 'recommended' | 'less';

interface PdfFileItem {
  file: File;
  name: string;
  originalSize: number;
  pageCount: number;
  thumbnail?: string;
}

@Component({
  selector: 'app-compress-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './compress-pdf.component.html',
  styleUrl: './compress-pdf.component.scss'
})
export class CompressPdfComponent implements OnInit {
  private seoService = inject(SeoService);
  private PDFDocument?: any;

  resourceContent = COMPRESS_PDF_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');

  pdfFile = signal<PdfFileItem | null>(null);
  compressionLevel = signal<CompressionLevel>('recommended');

  resultBlob = signal<Blob | null>(null);
  savedBytes = signal<number>(0);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Compress PDF - Reduce PDF File Size Online Free | DataUtil',
      description: 'Reduce the file size of your PDF while optimizing for maximal PDF quality. Compress PDF files online for free.',
      keywords: 'compress pdf, reduce pdf size, shrink pdf, pdf compressor',
      ogTitle: 'Compress PDF - Reduce PDF File Size Online Free',
      ogDescription: 'Reduce PDF file size while keeping quality. 100% free and secure.',
      canonicalUrl: 'https://datautility.com/categories/pdf/compress-pdf'
    });
  }

  private async loadPdfLib(): Promise<any> {
    if (this.PDFDocument) {
      return this.PDFDocument;
    }
    const module = await import('pdf-lib');
    this.PDFDocument = module.PDFDocument;
    return this.PDFDocument;
  }

  private async loadPdfjs(): Promise<any> {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
    return pdfjs;
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  get canCompress(): boolean {
    return !!this.pdfFile() && this.state() !== 'processing';
  }

  onFileSelected(fileList: FileList): void {
    if (fileList && fileList.length > 0) {
      this.loadFile(fileList[0]);
    }
  }

  private async loadFile(file: File): Promise<void> {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.errorMessage.set('Please upload a valid PDF file.');
      return;
    }

    this.errorMessage.set('');

    const item: PdfFileItem = {
      file,
      name: file.name,
      originalSize: file.size,
      pageCount: 0
    };
    this.pdfFile.set(item);
    this.state.set('configure');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const PDFDocClass = await this.loadPdfLib();
      const pdfDoc = await PDFDocClass.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      this.pdfFile.update(f => f ? { ...f, pageCount } : f);
      this.generateThumbnail(file);
    } catch (error) {
      console.error(`Error reading PDF "${file.name}":`, error);
      this.errorMessage.set(`"${file.name}" could not be read. It may be corrupted or password protected.`);
      this.pdfFile.set(null);
      this.state.set('upload');
    }
  }

  private async generateThumbnail(file: File): Promise<void> {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await this.loadPdfjs();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.6 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });

      if (!context) {
        loadingTask.destroy();
        return;
      }

      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const thumbnail = canvas.toDataURL('image/jpeg', 0.82);
      this.pdfFile.update(f => f ? { ...f, thumbnail } : f);

      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  private settingsForLevel(level: CompressionLevel): { scale: number; quality: number } {
    switch (level) {
      case 'extreme':
        return { scale: 1.0, quality: 0.35 };
      case 'less':
        return { scale: 2.0, quality: 0.85 };
      default:
        return { scale: 1.5, quality: 0.6 };
    }
  }

  private renderPageToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Failed to encode page image')),
        'image/jpeg',
        quality
      );
    });
  }

  async compressPdf(): Promise<void> {
    const item = this.pdfFile();
    if (!item || !this.canCompress) return;

    try {
      this.state.set('processing');
      this.errorMessage.set('');

      if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('Browser only');
      }

      const { scale, quality } = this.settingsForLevel(this.compressionLevel());
      const arrayBuffer = await item.file.arrayBuffer();

      const pdfjs = await this.loadPdfjs();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const sourcePdf = await loadingTask.promise;

      const PDFDocClass = await this.loadPdfLib();
      const outputDoc = await PDFDocClass.create();

      for (let pageNum = 1; pageNum <= sourcePdf.numPages; pageNum++) {
        const page = await sourcePdf.getPage(pageNum);
        const baseViewport = page.getViewport({ scale: 1 });
        const renderViewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(renderViewport.width));
        canvas.height = Math.max(1, Math.floor(renderViewport.height));
        const context = canvas.getContext('2d', { alpha: false });

        if (!context) {
          throw new Error('Canvas context not available');
        }

        await page.render({ canvasContext: context, viewport: renderViewport, canvas }).promise;

        const jpegBlob = await this.renderPageToJpeg(canvas, quality);
        const jpegBytes = await jpegBlob.arrayBuffer();
        const jpegImage = await outputDoc.embedJpg(jpegBytes);

        const pdfPage = outputDoc.addPage([baseViewport.width, baseViewport.height]);
        pdfPage.drawImage(jpegImage, {
          x: 0,
          y: 0,
          width: baseViewport.width,
          height: baseViewport.height
        });
      }

      loadingTask.destroy();

      const pdfBytes = await outputDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

      this.savedBytes.set(Math.max(0, item.originalSize - blob.size));
      this.resultBlob.set(blob);
      this.state.set('complete');
    } catch (error) {
      console.error('Error compressing PDF:', error);
      this.errorMessage.set('Failed to compress PDF file. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    const blob = this.resultBlob();
    const item = this.pdfFile();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item ? item.name.replace(/\.pdf$/i, '') + '-compressed.pdf' : 'compressed.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  reset(): void {
    this.state.set('upload');
    this.pdfFile.set(null);
    this.resultBlob.set(null);
    this.savedBytes.set(0);
    this.errorMessage.set('');
  }
}
