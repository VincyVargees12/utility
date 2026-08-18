import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { REMOVE_BLANK_PAGES_RESOURCE_CONTENT } from './remove-blank-pages.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

interface PageItem {
  pageNumber: number;
  thumbnail: string | null;
  /** Fraction (0-1) of sampled pixels that are not near-white. Null until scanned. */
  nonWhiteRatio: number | null;
  /** True once the user has manually toggled "keep" for this page, so sensitivity changes stop overriding it. */
  touched: boolean;
  keep: boolean;
}

@Component({
  selector: 'app-remove-blank-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './remove-blank-pages.component.html',
  styleUrl: './remove-blank-pages.component.scss'
})
export class RemoveBlankPagesComponent implements OnInit {
  private seoService = inject(SeoService);
  private pdfLib?: any;

  resourceContent = REMOVE_BLANK_PAGES_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isScanning = signal<boolean>(false);

  pdfFile = signal<File | null>(null);
  pages = signal<PageItem[]>([]);
  resultBlob = signal<Blob | null>(null);

  /** Pages with less than this percentage of non-white content are flagged as blank. */
  sensitivityPct = signal<number>(0.5);

  blankCount = computed(() => this.pages().filter(p => this.isBlank(p)).length);
  keepCount = computed(() => this.pages().filter(p => p.keep).length);
  removeCount = computed(() => this.pages().length - this.keepCount());

  get canProcess(): boolean {
    return this.keepCount() > 0 && this.state() !== 'processing';
  }

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'PDF Blank Page Remover - Delete Empty Pages Online | DataUtil',
      description: 'Automatically detect and remove blank pages from a PDF. Review the results, adjust sensitivity, and download a cleaned-up document — all in your browser.',
      keywords: 'remove blank pages pdf, delete empty pages pdf, blank page remover, clean up scanned pdf',
      ogTitle: 'PDF Blank Page Remover',
      ogDescription: 'Automatically detect and remove blank pages from a PDF, free and private.',
      canonicalUrl: 'https://www.data-util.com/categories/pdf/remove-blank-pages'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'PDF Blank Page Remover',
      'applicationCategory': 'UtilitiesApplication',
      'description': 'Automatically detect and remove blank or empty pages from a PDF document.',
      'url': 'https://www.data-util.com/categories/pdf/remove-blank-pages',
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

  isBlank(page: PageItem): boolean {
    if (page.nonWhiteRatio === null) return false;
    return page.nonWhiteRatio * 100 < this.sensitivityPct();
  }

  onSensitivityChange(value: number): void {
    this.sensitivityPct.set(value);
    // Re-derive "keep" from the new threshold for every page the user hasn't manually toggled.
    this.pages.update(pages =>
      pages.map(p => p.touched ? p : { ...p, keep: !this.isBlank(p) })
    );
  }

  togglePage(pageNumber: number): void {
    this.pages.update(pages =>
      pages.map(p => p.pageNumber === pageNumber ? { ...p, keep: !p.keep, touched: true } : p)
    );
  }

  onFileSelected(files: FileList): void {
    if (files && files[0]) {
      this.loadPdfFile(files[0]);
    }
  }

  async loadPdfFile(file: File): Promise<void> {
    try {
      this.errorMessage.set('');
      const arrayBuffer = await file.arrayBuffer();
      const { PDFDocument } = await this.loadPdfLib();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      if (pdfDoc.isEncrypted) {
        this.errorMessage.set(`"${file.name}" is password protected. Unlock it first, then upload it here.`);
        return;
      }

      const pageCount = pdfDoc.getPageCount();
      this.pdfFile.set(file);

      const pages: PageItem[] = [];
      for (let i = 1; i <= pageCount; i++) {
        pages.push({ pageNumber: i, thumbnail: null, nonWhiteRatio: null, touched: false, keep: true });
      }
      this.pages.set(pages);
      this.state.set('configure');

      this.scanPages(arrayBuffer);
    } catch (error) {
      console.error('Error reading PDF:', error);
      this.errorMessage.set(`"${file.name}" could not be read. It may be corrupted or password protected.`);
    }
  }

  private async scanPages(arrayBuffer: ArrayBuffer): Promise<void> {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      this.isScanning.set(true);

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.3 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
        if (!context) continue;

        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const nonWhiteRatio = this.computeNonWhiteRatio(context, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.75);

        this.pages.update(pages =>
          pages.map(p => {
            if (p.pageNumber !== pageNumber) return p;
            const updated = { ...p, thumbnail, nonWhiteRatio };
            return p.touched ? updated : { ...updated, keep: !this.isBlank(updated) };
          })
        );
      }

      loadingTask.destroy();
    } catch (error) {
      console.error('Error scanning pages:', error);
    } finally {
      this.isScanning.set(false);
    }
  }

  /** Fraction (0-1) of sampled pixels that are not near-white — a proxy for how much visible content a page has. */
  private computeNonWhiteRatio(context: CanvasRenderingContext2D, width: number, height: number): number {
    const { data } = context.getImageData(0, 0, width, height);
    let nonWhite = 0;
    let sampled = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 245 || g < 245 || b < 245) {
        nonWhite++;
      }
      sampled++;
    }

    return sampled > 0 ? nonWhite / sampled : 0;
  }

  async processRemoval(): Promise<void> {
    if (!this.canProcess) return;
    const file = this.pdfFile();
    if (!file) return;

    try {
      this.state.set('processing');
      this.errorMessage.set('');

      const { PDFDocument } = await this.loadPdfLib();
      const arrayBuffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      const keepIndices = this.pages().filter(p => p.keep).map(p => p.pageNumber - 1);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(sourceDoc, keepIndices);
      copiedPages.forEach((page: any) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      this.resultBlob.set(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
      this.state.set('complete');
    } catch (error) {
      console.error('Error removing blank pages:', error);
      this.errorMessage.set('Failed to remove blank pages. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    const blob = this.resultBlob();
    const file = this.pdfFile();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? file.name.replace(/\.pdf$/i, '') + '-no-blanks.pdf' : 'no-blank-pages.pdf';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  reset(): void {
    this.state.set('upload');
    this.pdfFile.set(null);
    this.pages.set([]);
    this.resultBlob.set(null);
    this.errorMessage.set('');
    this.sensitivityPct.set(0.5);
  }
}
