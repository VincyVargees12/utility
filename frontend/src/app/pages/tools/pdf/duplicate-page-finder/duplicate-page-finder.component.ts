import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { DUPLICATE_PAGE_FINDER_RESOURCE_CONTENT } from './duplicate-page-finder.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

/** Side length of the tiny grid each page is reduced to for comparison (a 12x12 average hash). */
const HASH_SIZE = 12;

interface PageItem {
  pageNumber: number;
  thumbnail: string | null;
  hash: number[] | null;
  /** Duplicate group id shared by pages that match each other; null if this page is unique. */
  groupId: number | null;
  /** True for the first page encountered in its group — the one kept by default. */
  isFirstInGroup: boolean;
  touched: boolean;
  keep: boolean;
}

@Component({
  selector: 'app-duplicate-page-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './duplicate-page-finder.component.html',
  styleUrl: './duplicate-page-finder.component.scss'
})
export class DuplicatePageFinderComponent implements OnInit {
  private seoService = inject(SeoService);
  private pdfLib?: any;

  resourceContent = DUPLICATE_PAGE_FINDER_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isScanning = signal<boolean>(false);

  pdfFile = signal<File | null>(null);
  pages = signal<PageItem[]>([]);
  resultBlob = signal<Blob | null>(null);

  /** Two pages count as duplicates when their hashes match at least this percentage of the time. */
  matchThresholdPct = signal<number>(98);

  duplicateGroupCount = computed(() => {
    const ids = new Set(this.pages().map(p => p.groupId).filter((id): id is number => id !== null));
    return ids.size;
  });
  keepCount = computed(() => this.pages().filter(p => p.keep).length);
  removeCount = computed(() => this.pages().length - this.keepCount());

  get canProcess(): boolean {
    return this.keepCount() > 0 && this.state() !== 'processing';
  }

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'PDF Duplicate Page Finder - Detect & Remove Repeated Pages | DataUtil',
      description: 'Automatically find pages that repeat within a PDF and remove the extra copies. Review matches, adjust sensitivity, and download a cleaned-up document, all in your browser.',
      keywords: 'duplicate page finder pdf, remove duplicate pages pdf, find repeated pages pdf, pdf deduplication',
      ogTitle: 'PDF Duplicate Page Finder',
      ogDescription: 'Automatically find and remove duplicate pages in a PDF, free and private.',
      canonicalUrl: 'https://www.data-util.com/categories/pdf/duplicate-page-finder'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'PDF Duplicate Page Finder',
      'applicationCategory': 'UtilitiesApplication',
      'description': 'Automatically detect and remove pages that repeat within a PDF document.',
      'url': 'https://www.data-util.com/categories/pdf/duplicate-page-finder',
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

  onSensitivityChange(value: number): void {
    this.matchThresholdPct.set(value);
    this.regroupDuplicates();
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
      if (pageCount < 2) {
        this.errorMessage.set('This PDF only has one page — there is nothing to compare.');
        return;
      }

      this.pdfFile.set(file);

      const pages: PageItem[] = [];
      for (let i = 1; i <= pageCount; i++) {
        pages.push({ pageNumber: i, thumbnail: null, hash: null, groupId: null, isFirstInGroup: true, touched: false, keep: true });
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
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) continue;

        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const hash = this.computeHash(canvas);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.75);

        this.pages.update(pages =>
          pages.map(p => p.pageNumber === pageNumber ? { ...p, thumbnail, hash } : p)
        );
      }

      loadingTask.destroy();
      this.regroupDuplicates();
    } catch (error) {
      console.error('Error scanning pages:', error);
    } finally {
      this.isScanning.set(false);
    }
  }

  /**
   * Reduces a rendered page canvas to a 12x12 grid per color channel and thresholds each cell
   * against its channel's average — a standard "average hash" (aHash), applied per-channel so
   * color is preserved. Stretching to a fixed small square (ignoring aspect ratio) is the normal
   * aHash approach; it is robust to the minor scale/compression differences between two renders
   * of what is otherwise the same page.
   */
  private computeHash(sourceCanvas: HTMLCanvasElement): number[] {
    const small = document.createElement('canvas');
    small.width = HASH_SIZE;
    small.height = HASH_SIZE;
    const ctx = small.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    ctx.drawImage(sourceCanvas, 0, 0, HASH_SIZE, HASH_SIZE);
    const { data } = ctx.getImageData(0, 0, HASH_SIZE, HASH_SIZE);

    // Threshold each color channel against its own average separately (rather than collapsing
    // to grayscale luminance first), so two pages with the same layout but different colors —
    // e.g. a red vs. a blue stamp in the same spot — don't hash as identical.
    const channels: number[][] = [[], [], []];
    for (let i = 0; i < data.length; i += 4) {
      channels[0].push(data[i]);
      channels[1].push(data[i + 1]);
      channels[2].push(data[i + 2]);
    }

    const bits: number[] = [];
    for (const channel of channels) {
      const avg = channel.reduce((a, b) => a + b, 0) / channel.length;
      for (const v of channel) bits.push(v >= avg ? 1 : 0);
    }
    return bits;
  }

  private similarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
    let same = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) same++;
    }
    return same / a.length;
  }

  /** Groups pages whose hashes match within the current threshold, then defaults to keeping only the first page in each group. */
  private regroupDuplicates(): void {
    const pages = this.pages();
    const threshold = this.matchThresholdPct() / 100;
    const groupIds: (number | null)[] = new Array(pages.length).fill(null);
    let nextGroupId = 0;

    for (let i = 0; i < pages.length; i++) {
      if (groupIds[i] !== null || !pages[i].hash) continue;
      for (let j = i + 1; j < pages.length; j++) {
        if (!pages[j].hash) continue;
        if (this.similarity(pages[i].hash!, pages[j].hash!) >= threshold) {
          if (groupIds[i] === null) groupIds[i] = nextGroupId++;
          groupIds[j] = groupIds[i];
        }
      }
    }

    const firstIndexOfGroup = new Map<number, number>();
    groupIds.forEach((id, idx) => {
      if (id !== null && !firstIndexOfGroup.has(id)) firstIndexOfGroup.set(id, idx);
    });

    this.pages.update(current =>
      current.map((p, idx) => {
        const groupId = groupIds[idx];
        const isFirstInGroup = groupId === null || firstIndexOfGroup.get(groupId) === idx;
        return p.touched ? { ...p, groupId, isFirstInGroup } : { ...p, groupId, isFirstInGroup, keep: isFirstInGroup };
      })
    );
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
      console.error('Error removing duplicate pages:', error);
      this.errorMessage.set('Failed to remove duplicate pages. Please try again.');
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
    a.download = file ? file.name.replace(/\.pdf$/i, '') + '-no-duplicates.pdf' : 'no-duplicate-pages.pdf';
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
    this.matchThresholdPct.set(98);
  }
}
