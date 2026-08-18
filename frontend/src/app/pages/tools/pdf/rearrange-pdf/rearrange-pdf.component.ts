import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { REARRANGE_PDF_RESOURCE_CONTENT } from './rearrange-pdf.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

interface PageItem {
  id: string;
  /** 0-based index of this page in the originally uploaded PDF. */
  originalIndex: number;
  pageNumber: number;
  thumbnail: string | null;
  /** Additional rotation applied on top of the page's existing rotation, in 90° steps. */
  rotation: number;
}

@Component({
  selector: 'app-rearrange-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './rearrange-pdf.component.html',
  styleUrl: './rearrange-pdf.component.scss'
})
export class RearrangePdfComponent implements OnInit {
  private seoService = inject(SeoService);
  private pdfLib?: any;

  resourceContent = REARRANGE_PDF_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');

  pdfFile = signal<File | null>(null);
  pages = signal<PageItem[]>([]);
  resultBlob = signal<Blob | null>(null);

  private draggedIndex: number | null = null;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Rearrange PDF Pages - Reorder & Delete Pages Online | DataUtil',
      description: 'Drag and drop to reorder PDF pages, rotate individual pages, or delete the ones you don\'t need. Free, fast, and processed entirely in your browser.',
      keywords: 'rearrange pdf pages, reorder pdf pages, organize pdf, delete pdf pages, sort pdf pages',
      ogTitle: 'Rearrange PDF Pages Online',
      ogDescription: 'Reorder, rotate, or delete PDF pages with a simple drag-and-drop grid.',
      canonicalUrl: 'https://www.data-util.com/categories/pdf/rearrange-pdf'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Rearrange PDF Pages',
      'applicationCategory': 'UtilitiesApplication',
      'description': 'Reorder, rotate, or delete pages in a PDF using a drag-and-drop page grid.',
      'url': 'https://www.data-util.com/categories/pdf/rearrange-pdf',
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

  get canProcess(): boolean {
    return this.pages().length > 0 && this.state() !== 'processing';
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
        this.errorMessage.set('This PDF only has one page — there\'s nothing to rearrange.');
        return;
      }

      this.pdfFile.set(file);

      const pages: PageItem[] = [];
      for (let i = 0; i < pageCount; i++) {
        pages.push({ id: crypto.randomUUID(), originalIndex: i, pageNumber: i + 1, thumbnail: null, rotation: 0 });
      }
      this.pages.set(pages);
      this.state.set('configure');

      this.generateThumbnails(arrayBuffer);
    } catch (error) {
      console.error('Error reading PDF:', error);
      this.errorMessage.set(`"${file.name}" could not be read. It may be corrupted or password protected.`);
    }
  }

  private async generateThumbnails(arrayBuffer: ArrayBuffer): Promise<void> {
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

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.3 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) continue;

        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        const originalIndex = pageNumber - 1;
        this.pages.update(pages => pages.map(p => p.originalIndex === originalIndex ? { ...p, thumbnail } : p));
      }

      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
  }

  removePage(id: string, event?: Event): void {
    event?.stopPropagation();
    this.pages.update(pages => pages.filter(p => p.id !== id));
  }

  rotatePage(id: string, event?: Event): void {
    event?.stopPropagation();
    this.pages.update(pages =>
      pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p)
    );
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    const pages = [...this.pages()];
    [pages[index - 1], pages[index]] = [pages[index], pages[index - 1]];
    this.pages.set(pages);
  }

  moveDown(index: number): void {
    const pages = [...this.pages()];
    if (index >= pages.length - 1) return;
    [pages[index + 1], pages[index]] = [pages[index], pages[index + 1]];
    this.pages.set(pages);
  }

  reverseOrder(): void {
    this.pages.update(pages => [...pages].reverse());
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOverCard(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDropCard(event: DragEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();

    const from = this.draggedIndex;
    this.draggedIndex = null;
    if (from === null || from === index) return;

    const pages = [...this.pages()];
    const [moved] = pages.splice(from, 1);
    pages.splice(index, 0, moved);
    this.pages.set(pages);
  }

  async processRearrange(): Promise<void> {
    if (!this.canProcess) return;
    const file = this.pdfFile();
    if (!file) return;

    try {
      this.state.set('processing');
      this.errorMessage.set('');

      const { PDFDocument, degrees } = await this.loadPdfLib();
      const arrayBuffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      const pageIndices = this.pages().map(p => p.originalIndex);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);

      copiedPages.forEach((page: any, i: number) => {
        const rotationDelta = this.pages()[i].rotation;
        if (rotationDelta !== 0) {
          page.setRotation(degrees(page.getRotation().angle + rotationDelta));
        }
        newDoc.addPage(page);
      });

      const pdfBytes = await newDoc.save();
      this.resultBlob.set(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
      this.state.set('complete');
    } catch (error) {
      console.error('Error rearranging PDF:', error);
      this.errorMessage.set('Failed to rearrange PDF pages. Please try again.');
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
    a.download = file ? file.name.replace(/\.pdf$/i, '') + '-rearranged.pdf' : 'rearranged.pdf';
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
  }
}
