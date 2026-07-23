import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type CompressionLevel = 'low' | 'medium' | 'high';

@Component({
  selector: 'app-compress-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './compress-pdf.component.html',
  styleUrl: './compress-pdf.component.scss'
})
export class CompressPdfComponent implements OnInit {
  private seoService = inject(SeoService);
  private PDFDocument?: any;

  state = signal<AppState>('upload');
  compressionLevel = signal<CompressionLevel>('medium');

  pdfFile = signal<File | null>(null);
  originalSize = signal<number>(0);
  compressedSize = signal<number>(0);
  resultBlob = signal<Blob | null>(null);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Compress PDF - Free Online PDF Compressor | DataUtil',
      description: 'Compress PDF files to reduce file size while maintaining quality. 100% free and secure.',
      keywords: 'compress pdf, pdf compressor, reduce pdf size, optimize pdf',
      ogTitle: 'Compress PDF - Free Online PDF Compressor',
      ogDescription: 'Compress PDF files to reduce file size. 100% free and secure.',
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

  onFileSelected(files: FileList): void {
    if (files && files[0]) {
      this.loadPdfFile(files[0]);
    }
  }

  async loadPdfFile(file: File): Promise<void> {
    try {
      this.pdfFile.set(file);
      this.originalSize.set(file.size);
      this.errorMessage.set('');

      // Validate PDF
      const arrayBuffer = await file.arrayBuffer();
      const PDFDocClass = await this.loadPdfLib();
      await PDFDocClass.load(arrayBuffer);

      this.state.set('configure');
    } catch (error: any) {
      this.errorMessage.set('Failed to load PDF file. Please try again.');
      console.error('Error loading PDF:', error);
    }
  }

  async compressPdf(): Promise<void> {
    if (!this.pdfFile()) return;

    try {
      this.state.set('processing');
      this.errorMessage.set('');

      const file = this.pdfFile()!;
      const arrayBuffer = await file.arrayBuffer();
      const level = this.compressionLevel();
      const PDFDocClass = await this.loadPdfLib();

      // Configure pdf.js for rendering
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const newPdfDoc = await PDFDocClass.create();

      // Compression settings based on level
      let scale = 1.0;
      let quality = 0.8;

      if (level === 'high') {
        scale = 0.80; 
        quality = 0.75;
      } else if (level === 'medium') {
        scale = 0.95;
        quality = 0.90;
      } else {
        scale = 1.0;
        quality = 0.97;
      }

      // Rasterize each page and compress as JPEG
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Fill white background (since empty canvas is transparent and JPEG needs background)
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: context, viewport, canvas: canvas } as any).promise;

        const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
        const jpgImage = await newPdfDoc.embedJpg(imgDataUrl);
        
        // Add page matching original dimensions (divide by scale)
        const pdfPage = newPdfDoc.addPage([viewport.width / scale, viewport.height / scale]);

        pdfPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: viewport.width / scale,
          height: viewport.height / scale,
        });
      }

      newPdfDoc.setTitle('');
      newPdfDoc.setAuthor('');
      newPdfDoc.setSubject('');
      newPdfDoc.setProducer('');
      newPdfDoc.setCreator('');

      const pdfBytes = await newPdfDoc.save({ 
        useObjectStreams: true
      });
      
      let blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

      // Fallback: If rasterized is somehow larger (e.g. text-only PDF), do a simple re-save
      if (blob.size >= file.size) {
        // Read the file again since the previous arrayBuffer may have been transferred/detached by pdf.js worker
        const freshArrayBuffer = await file.arrayBuffer();
        const fallbackDoc = await PDFDocClass.load(freshArrayBuffer);
        fallbackDoc.setTitle('');
        fallbackDoc.setAuthor('');
        fallbackDoc.setCreator('');
        fallbackDoc.setProducer('');
        
        // Remove objects/unused properties manually to squeeze some bytes
        const fallbackBytes = await fallbackDoc.save({ useObjectStreams: true });
        blob = new Blob([fallbackBytes as BlobPart], { type: 'application/pdf' });
      }

      this.compressedSize.set(blob.size);
      this.resultBlob.set(blob);
      this.state.set('complete');
    } catch (error: any) {
      this.errorMessage.set('Failed to compress PDF. Please try again.');
      this.state.set('configure');
      console.error('Error compressing PDF:', error);
    }
  }

  downloadPdf(): void {
    const blob = this.resultBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.pdfFile()?.name?.replace('.pdf', '') + '-compressed.pdf' || 'compressed.pdf';
    link.click();
    URL.revokeObjectURL(url);
  }

  resetUpload(): void {
    this.state.set('upload');
    this.pdfFile.set(null);
    this.originalSize.set(0);
    this.compressedSize.set(0);
    this.resultBlob.set(null);
    this.errorMessage.set('');
  }

  getCompressionPercentage(): number {
    if (this.originalSize() === 0) return 0;
    return Math.round((1 - this.compressedSize() / this.originalSize()) * 100);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
