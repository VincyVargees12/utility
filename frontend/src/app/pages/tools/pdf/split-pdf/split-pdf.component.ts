import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PDFDocument } from 'pdf-lib';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { SeoService } from '../../../../services/seo.service';

type SplitMode = 'range' | 'fixed' | 'pages';
type ExtractMode = 'all' | 'select';
type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type RangeMode = 'custom' | 'fixed';

interface PageInfo {
  pageNumber: number;
  selected: boolean;
  thumbnail?: string;
}

interface PageRange {
  id: string;
  fromPage: number;
  toPage: number;
}

@Component({
  selector: 'app-split-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './split-pdf.component.html',
  styleUrl: './split-pdf.component.scss'
})
export class SplitPdfComponent implements OnInit {
  private seoService = inject(SeoService);

  // Expose utilities for template
  readonly Array = Array;
  readonly Math = Math;

  state = signal<AppState>('upload');
  splitMode = signal<SplitMode>('range');
  extractMode = signal<ExtractMode>('all');
  rangeMode = signal<RangeMode>('custom');
  
  pdfFile = signal<File | null>(null);
  pages = signal<PageInfo[]>([]);
  ranges = signal<PageRange[]>([{ id: crypto.randomUUID(), fromPage: 1, toPage: 1 }]);
  fixedPageCount = signal<number>(1);
  pagesInput = signal<string>('');
  mergeRanges = signal<boolean>(false);
  
  resultFiles = signal<Blob[]>([]);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Split PDF - Free Online PDF Splitter | DataUtil',
      description: 'Split PDF files into multiple documents by page ranges, fixed intervals, or extract specific pages. 100% free and secure.',
      keywords: 'split pdf, pdf splitter, extract pdf pages, divide pdf, separate pdf pages',
      ogTitle: 'Split PDF - Free Online PDF Splitter',
      ogDescription: 'Split PDF files into multiple documents. 100% free and secure.',
      canonicalUrl: 'https://datautility.com/categories/pdf/split-pdf'
    });
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.loadPdfFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.loadPdfFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async loadPdfFile(file: File): Promise<void> {
    try {
      this.pdfFile.set(file);
      this.errorMessage.set('');
      
      // Load PDF to get page count and generate thumbnails
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Initialize pages
      const pages: PageInfo[] = [];
      for (let i = 1; i <= pageCount; i++) {
        pages.push({
          pageNumber: i,
          selected: true
        });
      }
      
      this.pages.set(pages);
      
      // Set initial range
      this.ranges.set([{ id: crypto.randomUUID(), fromPage: 1, toPage: pageCount }]);
      
      this.state.set('configure');
      
      // Generate thumbnails in background
      this.generateThumbnails(arrayBuffer);
      
    } catch (error: any) {
      this.errorMessage.set('Failed to load PDF file. Please try again.');
      console.error('Error loading PDF:', error);
    }
  }

  async generateThumbnails(arrayBuffer: ArrayBuffer): Promise<void> {
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
      const pageCount = pdf.numPages;

      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.25 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false });

        if (!context) {
          continue;
        }

        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const thumbnail = canvas.toDataURL('image/jpeg', 0.82);
        this.pages.update((pages) =>
          pages.map((p) =>
            p.pageNumber === pageNumber
              ? { ...p, thumbnail }
              : p
          )
        );
      }

      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
  }

  setSplitMode(mode: SplitMode): void {
    this.splitMode.set(mode);
    // Reset fixedPageCount to 1 when switching modes
    if (mode === 'fixed') {
      const pageCount = this.pages().length;
      if (this.fixedPageCount() > pageCount) {
        this.fixedPageCount.set(1);
      }
    }
  }

  setRangeMode(mode: RangeMode): void {
    this.rangeMode.set(mode);
    // Validate fixedPageCount when switching to fixed range mode
    const pageCount = this.pages().length;
    if (mode === 'fixed' && this.fixedPageCount() > pageCount) {
      this.fixedPageCount.set(1);
    }
  }

  setExtractMode(mode: ExtractMode): void {
    this.extractMode.set(mode);
    
    if (mode === 'all') {
      // Select all pages
      this.pages.update(pages => 
        pages.map(p => ({ ...p, selected: true }))
      );
    }
  }

  setFixedPageCount(count: number): void {
    const pageCount = this.pages().length;
    const validCount = Math.min(Math.max(1, count), pageCount);
    this.fixedPageCount.set(validCount);
  }

  addRange(): void {
    const currentRanges = this.ranges();
    const pageCount = this.pages().length;
    
    this.ranges.update(ranges => [
      ...ranges,
      { id: crypto.randomUUID(), fromPage: 1, toPage: pageCount }
    ]);
  }

  removeRange(id: string): void {
    this.ranges.update(ranges => ranges.filter(r => r.id !== id));
  }

  updateRange(id: string, field: 'fromPage' | 'toPage', value: number): void {
    const pageCount = this.pages().length;
    if (value < 1 || value > pageCount) {
      // Revert to the old value if the new value is invalid
      const originalValue = this.ranges().find(r => r.id === id)?.[field] ?? 1;
      this.ranges.update(ranges =>
        ranges.map(r => r.id === id ? { ...r, [field]: originalValue } : r)
      );
      // This is a bit of a hack to force the input to update.
      setTimeout(() => {
        this.ranges.update(ranges => [...ranges]);
      });
      return;
    }

    this.ranges.update(ranges =>
      ranges.map(r => {
        if (r.id === id) {
          const newRange = { ...r, [field]: value };
          if (field === 'fromPage' && newRange.fromPage > newRange.toPage) {
            newRange.toPage = newRange.fromPage;
          }
          if (field === 'toPage' && newRange.toPage < newRange.fromPage) {
            newRange.fromPage = newRange.toPage;
          }
          return newRange;
        }
        return r;
      })
    );
  }

  togglePageSelection(pageNumber: number): void {
    this.pages.update(pages =>
      pages.map(p => 
        p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
      )
    );
  }

  parsePageInput(input: string): number[] {
    const pages: number[] = [];
    const parts = input.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num) && !pages.includes(num)) {
          pages.push(num);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  }

  updatePagesFromInput(): void {
    const input = this.pagesInput();
    const maxPage = this.pages().length;
    
    // Validate and sanitize the input string
    const sanitizedParts = input.split(',').map(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        let [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end)) return null;
        
        start = Math.max(1, Math.min(start, maxPage));
        end = Math.max(1, Math.min(end, maxPage));

        if (start > end) {
          [start, end] = [end, start]; // Swap if in wrong order
        }
        return `${start}-${end}`;
      } else {
        const num = parseInt(trimmed);
        if (isNaN(num) || num < 1 || num > maxPage) return null;
        return num.toString();
      }
    }).filter(p => p !== null);

    const sanitizedInput = sanitizedParts.join(', ');
    
    if (this.pagesInput() !== sanitizedInput) {
      this.pagesInput.set(sanitizedInput);
    }

    const selectedPages = this.parsePageInput(sanitizedInput);
    
    this.pages.update(pages =>
      pages.map(p => ({
        ...p,
        selected: selectedPages.includes(p.pageNumber)
      }))
    );
  }

  get outputFileCount(): number {
    const mode = this.splitMode();
    
    if (mode === 'range') {
      if (this.rangeMode() === 'fixed') {
        const pageCount = this.pages().length;
        const pagesPerFile = this.fixedPageCount();
        return Math.ceil(pageCount / pagesPerFile);
      } else {
        return this.ranges().length;
      }
    } else if (mode === 'fixed') {
      const pageCount = this.pages().length;
      const pagesPerFile = this.fixedPageCount();
      return Math.ceil(pageCount / pagesPerFile);
    } else {
      // pages mode
      return this.pages().filter(p => p.selected).length;
    }
  }

  get canSplit(): boolean {
    if (!this.pdfFile()) return false;
    
    const mode = this.splitMode();
    
    if (mode === 'range') {
      if (this.rangeMode() === 'fixed') {
        return this.fixedPageCount() > 0;
      } else {
        const ranges = this.ranges();
        return ranges.length > 0 && ranges.every(r => r.fromPage <= r.toPage);
      }
    } else if (mode === 'fixed') {
      return this.fixedPageCount() > 0;
    } else {
      return this.pages().some(p => p.selected);
    }
  }

  async splitPdf(): Promise<void> {
    if (!this.pdfFile()) return;
    
    try {
      this.state.set('processing');
      this.errorMessage.set('');
      
      const file = this.pdfFile()!;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const mode = this.splitMode();
      const results: Blob[] = [];
      
      if (mode === 'range') {
        if (this.rangeMode() === 'fixed') {
          // Split by fixed page count in range mode
          const pageCount = pdfDoc.getPageCount();
          const pagesPerFile = this.fixedPageCount();
          
          for (let start = 0; start < pageCount; start += pagesPerFile) {
            const end = Math.min(start + pagesPerFile, pageCount);
            const newDoc = await PDFDocument.create();
            const pageIndices = [];
            for (let i = start; i < end; i++) {
              pageIndices.push(i);
            }
            const pages = await newDoc.copyPages(pdfDoc, pageIndices);
            pages.forEach(page => newDoc.addPage(page));
            
            const pdfBytes = await newDoc.save();
            results.push(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
          }
        } else {
          // Split by custom ranges
          if (this.mergeRanges()) {
            // Merge all ranges into a single PDF
            const mergedDoc = await PDFDocument.create();
            const allPageIndices: number[] = [];
            
            for (const range of this.ranges()) {
              for (let i = range.fromPage; i <= range.toPage; i++) {
                allPageIndices.push(i - 1); // Convert to 0-based index
              }
            }
            
            const pages = await mergedDoc.copyPages(pdfDoc, allPageIndices);
            pages.forEach(page => mergedDoc.addPage(page));
            
            const pdfBytes = await mergedDoc.save();
            results.push(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
          } else {
            // Create separate PDFs for each range
            for (const range of this.ranges()) {
              const newDoc = await PDFDocument.create();
              const pageIndices = [];
              for (let i = range.fromPage; i <= range.toPage; i++) {
                pageIndices.push(i - 1); // Convert to 0-based index
              }
              const pages = await newDoc.copyPages(pdfDoc, pageIndices);
              pages.forEach(page => newDoc.addPage(page));
              
              const pdfBytes = await newDoc.save();
              results.push(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
            }
          }
        }
      } else if (mode === 'fixed') {
        // Split by fixed page count
        const pageCount = pdfDoc.getPageCount();
        const pagesPerFile = this.fixedPageCount();
        
        for (let start = 0; start < pageCount; start += pagesPerFile) {
          const end = Math.min(start + pagesPerFile, pageCount);
          const newDoc = await PDFDocument.create();
          const pageIndices = [];
          for (let i = start; i < end; i++) {
            pageIndices.push(i);
          }
          const pages = await newDoc.copyPages(pdfDoc, pageIndices);
          pages.forEach(page => newDoc.addPage(page));
          
          const pdfBytes = await newDoc.save();
          results.push(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
        }
      } else {
        // Extract selected pages
        const selectedPages = this.pages().filter(p => p.selected);
        
        for (const page of selectedPages) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [page.pageNumber - 1]);
          newDoc.addPage(copiedPage);
          
          const pdfBytes = await newDoc.save();
          results.push(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
        }
      }
      
      this.resultFiles.set(results);
      this.state.set('complete');
      
    } catch (error: any) {
      this.errorMessage.set('Failed to split PDF. Please try again.');
      this.state.set('configure');
      console.error('Error splitting PDF:', error);
    }
  }

  downloadAll(): void {
    const files = this.resultFiles();
    const originalName = this.pdfFile()?.name.replace('.pdf', '') || 'document';
    
    files.forEach((blob, index) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalName}_part_${index + 1}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  reset(): void {
    this.state.set('upload');
    this.pdfFile.set(null);
    this.pages.set([]);
    this.ranges.set([{ id: crypto.randomUUID(), fromPage: 1, toPage: 1 }]);
    this.resultFiles.set([]);
    this.errorMessage.set('');
    this.pagesInput.set('');
  }
}
