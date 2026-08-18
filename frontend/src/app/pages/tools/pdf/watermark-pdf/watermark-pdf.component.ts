import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { WATERMARK_PDF_RESOURCE_CONTENT } from './watermark-pdf.resource-content';

type AppState = 'upload' | 'configure';
type WatermarkType = 'text' | 'image';
type FontFamily = 'Helvetica' | 'TimesRoman' | 'Courier';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  thumbnail: string | null;
  pageCount: number;
}

const POSITIONS: Position[] = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

@Component({
  selector: 'app-watermark-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './watermark-pdf.component.html',
  styleUrl: './watermark-pdf.component.scss'
})
export class WatermarkPdfComponent implements OnInit {
  private seoService = inject(SeoService);
  private pdfLib?: any;

  resourceContent = WATERMARK_PDF_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  files = signal<PdfFileItem[]>([]);
  activeFileId = signal<string | null>(null);

  watermarkType = signal<WatermarkType>('text');
  positions = POSITIONS;

  // Text watermark settings
  text = signal<string>('CONFIDENTIAL');
  textColor = signal<string>('#ff0000');
  fontFamily = signal<FontFamily>('Helvetica');
  bold = signal<boolean>(true);
  /** Font size as a percentage of the page width, so it scales consistently across page sizes. */
  fontSizePct = signal<number>(8);

  // Image watermark settings
  watermarkImageFile = signal<File | null>(null);
  watermarkImagePreview = signal<string>('');
  /** Watermark image width as a percentage of the page width. */
  imageScalePct = signal<number>(25);

  // Shared settings
  opacity = signal<number>(40);
  rotation = signal<number>(-45);
  position = signal<Position>('middle-center');
  /** Distance from the nearest edge(s), as a percentage of the shorter page dimension. */
  marginPct = signal<number>(4);
  applyToAllPages = signal<boolean>(true);

  activeFile = computed<PdfFileItem | undefined>(() => {
    const id = this.activeFileId();
    return this.files().find(f => f.id === id) ?? this.files()[0];
  });

  /**
   * Rendered pixel width of the preview thumbnail <img>. The live overlay and the real
   * pdf-lib export both size the watermark as a percentage of page width, so measuring
   * this directly (rather than via a CSS container query, which can't size to
   * shrink-to-fit content) keeps the preview visually representative of the export.
   */
  previewImgWidth = signal<number>(0);

  onPreviewImgLoad(event: Event): void {
    this.updatePreviewImgWidth(event.target as HTMLImageElement);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.previewImgEl) {
      this.updatePreviewImgWidth(this.previewImgEl);
    }
  }

  private previewImgEl: HTMLImageElement | null = null;

  private updatePreviewImgWidth(img: HTMLImageElement): void {
    this.previewImgEl = img;
    this.previewImgWidth.set(img.clientWidth);
  }

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Watermark PDF - Add Text or Image Watermark Online | DataUtil',
      description: 'Stamp a text or image watermark onto your PDF pages. Customize position, opacity, rotation, color, and size — processed entirely in your browser.',
      keywords: 'watermark pdf, add watermark to pdf, stamp pdf, pdf watermark tool, confidential stamp',
      ogTitle: 'Watermark PDF Online',
      ogDescription: 'Add a custom text or logo watermark to your PDF, free and private.',
      canonicalUrl: 'https://www.data-util.com/categories/pdf/watermark-pdf'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Watermark PDF',
      'applicationCategory': 'UtilitiesApplication',
      'description': 'Add a text or image watermark to PDF pages, with control over position, opacity, rotation, and size.',
      'url': 'https://www.data-util.com/categories/pdf/watermark-pdf',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  private async loadPdfLib(): Promise<any> {
    if (this.pdfLib) {
      return this.pdfLib;
    }
    this.pdfLib = await import('pdf-lib');
    return this.pdfLib;
  }

  onFileSelected(fileList: FileList): void {
    if (fileList && fileList.length > 0) {
      this.addFiles(Array.from(fileList));
    }
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async addFiles(newFiles: File[]): Promise<void> {
    const pdfFiles = newFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      this.errorMessage.set('Please upload valid PDF files.');
      return;
    }

    this.errorMessage.set('');

    if (this.state() === 'upload') {
      this.state.set('configure');
    }

    for (const file of pdfFiles) {
      await this.loadPdfFile(file);
    }
  }

  private async loadPdfFile(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { PDFDocument } = await this.loadPdfLib();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      if (pdfDoc.isEncrypted) {
        this.errorMessage.set(`"${file.name}" is password protected and was skipped. Unlock it first, then upload it here.`);
        return;
      }

      const id = crypto.randomUUID();
      const item: PdfFileItem = { id, file, name: file.name, thumbnail: null, pageCount: pdfDoc.getPageCount() };
      this.files.update(files => [...files, item]);

      if (!this.activeFileId()) {
        this.activeFileId.set(id);
      }

      this.generateThumbnail(id, file);
    } catch (error) {
      console.error(`Error reading PDF "${file.name}":`, error);
      this.errorMessage.set(`"${file.name}" could not be read and was skipped. It may be corrupted.`);
    }
  }

  private async generateThumbnail(id: string, file: File): Promise<void> {
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
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });

      if (!context) {
        loadingTask.destroy();
        return;
      }

      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const thumbnail = canvas.toDataURL('image/jpeg', 0.85);
      this.files.update(files => files.map(f => f.id === id ? { ...f, thumbnail } : f));

      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  setActiveFile(id: string): void {
    this.activeFileId.set(id);
  }

  removeFile(id: string, event?: Event): void {
    event?.stopPropagation();
    const remaining = this.files().filter(f => f.id !== id);
    this.files.set(remaining);

    if (this.activeFileId() === id) {
      this.activeFileId.set(remaining[0]?.id ?? null);
    }

    if (remaining.length === 0) {
      this.state.set('upload');
    }
  }

  onWatermarkImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (this.watermarkImagePreview()) {
        URL.revokeObjectURL(this.watermarkImagePreview());
      }
      this.watermarkImageFile.set(file);
      this.watermarkImagePreview.set(URL.createObjectURL(file));
    }
  }

  removeWatermarkImage(): void {
    if (this.watermarkImagePreview()) {
      URL.revokeObjectURL(this.watermarkImagePreview());
    }
    this.watermarkImageFile.set(null);
    this.watermarkImagePreview.set('');
  }

  /** justify-content / align-items for the live CSS preview overlay, derived from the 3x3 position grid. */
  previewAlignment(): { justifyContent: string; alignItems: string } {
    const [row, col] = this.position().split('-') as [string, string];
    const justifyContent = col === 'left' ? 'flex-start' : col === 'right' ? 'flex-end' : 'center';
    const alignItems = row === 'top' ? 'flex-start' : row === 'bottom' ? 'flex-end' : 'center';
    return { justifyContent, alignItems };
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace('#', '');
    const value = parseInt(clean, 16);
    return { r: ((value >> 16) & 255) / 255, g: ((value >> 8) & 255) / 255, b: (value & 255) / 255 };
  }

  private resolveFont(StandardFonts: any): any {
    const bold = this.bold();
    switch (this.fontFamily()) {
      case 'TimesRoman': return bold ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman;
      case 'Courier': return bold ? StandardFonts.CourierBold : StandardFonts.Courier;
      default: return bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica;
    }
  }

  /**
   * Anchor point for drawText/drawImage, based on the 3x3 position grid and margin.
   * pdf-lib's coordinate origin is bottom-left (unlike canvas/CSS, which are top-left),
   * and its `rotate` option pivots around this (x, y) anchor rather than the shape's
   * center — so at non-zero rotation the exported watermark's pivot won't exactly match
   * the CSS preview's center-pivot rotation. Close enough for typical corner/diagonal use.
   */
  private getAnchor(pageW: number, pageH: number, marginPx: number, boxW: number, boxH: number): { x: number; y: number } {
    const [row, col] = this.position().split('-') as [string, string];
    const x = col === 'left' ? marginPx : col === 'right' ? pageW - marginPx - boxW : (pageW - boxW) / 2;
    const y = row === 'top' ? pageH - marginPx - boxH : row === 'bottom' ? marginPx : (pageH - boxH) / 2;
    return { x, y };
  }

  async processWatermark(): Promise<void> {
    if (this.files().length === 0) return;

    if (this.watermarkType() === 'text' && !this.text().trim()) {
      this.errorMessage.set('Please enter watermark text.');
      return;
    }
    if (this.watermarkType() === 'image' && !this.watermarkImageFile()) {
      this.errorMessage.set('Please upload a watermark image.');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      if (typeof window === 'undefined') throw new Error('Browser only');

      const { PDFDocument, StandardFonts, rgb, degrees } = await this.loadPdfLib();

      let watermarkImageBytes: ArrayBuffer | null = null;
      let watermarkImageIsPng = false;
      if (this.watermarkType() === 'image') {
        const wf = this.watermarkImageFile()!;
        watermarkImageBytes = await wf.arrayBuffer();
        watermarkImageIsPng = wf.type === 'image/png';
      }

      const multiple = this.files().length > 1;
      let zip: any;
      if (multiple) {
        const JSZip = (await import('jszip')).default;
        zip = new JSZip();
      }

      const color = this.hexToRgb(this.textColor());
      const opacity = this.opacity() / 100;
      const rotate = degrees(this.rotation());

      let singleBlobUrl: string | null = null;
      let singleFileName: string | null = null;
      let outputCount = 0;
      const skipped: string[] = [];

      for (const item of this.files()) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

        if (pdfDoc.isEncrypted) {
          skipped.push(item.name);
          continue;
        }

        const font = await pdfDoc.embedFont(this.resolveFont(StandardFonts));
        const embeddedImage = watermarkImageBytes
          ? await (watermarkImageIsPng ? pdfDoc.embedPng(watermarkImageBytes) : pdfDoc.embedJpg(watermarkImageBytes))
          : null;

        const allPages = pdfDoc.getPages();
        const pages = this.applyToAllPages() ? allPages : allPages.slice(0, 1);

        for (const page of pages) {
          const { width, height } = page.getSize();
          const marginPx = (this.marginPct() / 100) * Math.min(width, height);

          if (this.watermarkType() === 'text') {
            const text = this.text();
            const fontSize = Math.max(4, (this.fontSizePct() / 100) * width);
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            const { x, y } = this.getAnchor(width, height, marginPx, textWidth, fontSize);

            page.drawText(text, { x, y, size: fontSize, font, color: rgb(color.r, color.g, color.b), opacity, rotate });
          } else if (embeddedImage) {
            const wmWidth = width * (this.imageScalePct() / 100);
            const wmHeight = wmWidth * (embeddedImage.height / embeddedImage.width);
            const { x, y } = this.getAnchor(width, height, marginPx, wmWidth, wmHeight);

            page.drawImage(embeddedImage, { x, y, width: wmWidth, height: wmHeight, opacity, rotate });
          }
        }

        const pdfBytes = await pdfDoc.save();
        outputCount++;

        if (multiple) {
          zip.file(item.name.replace(/\.pdf$/i, '') + '-watermarked.pdf', pdfBytes);
        } else {
          singleBlobUrl = URL.createObjectURL(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
          singleFileName = item.name.replace(/\.pdf$/i, '') + '-watermarked.pdf';
        }
      }

      if (outputCount === 0) {
        this.errorMessage.set('No files could be watermarked — they may be password protected.');
        return;
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = URL.createObjectURL(content);
        dlName = 'watermarked_pdfs.zip';
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
        URL.revokeObjectURL(dlUrl);
      }, 100);

      if (skipped.length > 0) {
        this.errorMessage.set(`Skipped password-protected file${skipped.length > 1 ? 's' : ''}: ${skipped.join(', ')}`);
      }
    } catch (error) {
      console.error('Watermark error:', error);
      this.errorMessage.set('Failed to apply watermark. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.files.set([]);
    this.activeFileId.set(null);
    if (this.watermarkImagePreview()) {
      URL.revokeObjectURL(this.watermarkImagePreview());
    }
    this.watermarkImageFile.set(null);
    this.watermarkImagePreview.set('');
    this.errorMessage.set('');
    this.watermarkType.set('text');
    this.text.set('CONFIDENTIAL');
    this.opacity.set(40);
    this.rotation.set(-45);
    this.position.set('middle-center');
    this.marginPct.set(4);
    this.applyToAllPages.set(true);
    this.state.set('upload');
  }
}
