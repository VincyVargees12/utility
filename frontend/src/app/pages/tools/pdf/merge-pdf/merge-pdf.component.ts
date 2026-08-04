import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { MERGE_PDF_RESOURCE_CONTENT } from './merge-pdf.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  pageCount: number;
  thumbnail?: string;
}

@Component({
  selector: 'app-merge-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './merge-pdf.component.html',
  styleUrl: './merge-pdf.component.scss'
})
export class MergePdfComponent implements OnInit {
  private seoService = inject(SeoService);
  private PDFDocument?: any;

  resourceContent = MERGE_PDF_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  files = signal<PdfFileItem[]>([]);
  resultBlob = signal<Blob | null>(null);
  errorMessage = signal<string>('');

  private draggedIndex: number | null = null;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Merge PDF - Combine PDF Files Online Free | DataUtil',
      description: 'Combine PDFs in the order you want with the easiest PDF merger available. Merge multiple PDF files into one document for free.',
      keywords: 'merge pdf, combine pdf, join pdf files, pdf merger',
      ogTitle: 'Merge PDF - Combine PDF Files Online Free',
      ogDescription: 'Combine PDFs in the order you want. 100% free and secure.',
      canonicalUrl: 'https://www.data-util.com/categories/pdf/merge-pdf'
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

  get totalPages(): number {
    return this.files().reduce((sum, f) => sum + (f.pageCount || 0), 0);
  }

  get canMerge(): boolean {
    return this.files().length >= 2 && this.state() !== 'processing';
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
    const pdfFiles = newFiles.filter(f =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      this.errorMessage.set('Please upload valid PDF files.');
      return;
    }

    this.errorMessage.set('');

    const items: PdfFileItem[] = pdfFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      pageCount: 0
    }));

    this.files.update(files => [...files, ...items]);

    if (this.state() === 'upload') {
      this.state.set('configure');
    }

    for (const item of items) {
      this.loadFileMeta(item.id, item.file);
    }
  }

  private async loadFileMeta(id: string, file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const PDFDocClass = await this.loadPdfLib();
      const pdfDoc = await PDFDocClass.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      this.files.update(files =>
        files.map(f => f.id === id ? { ...f, pageCount } : f)
      );

      this.generateThumbnail(id, file);
    } catch (error) {
      console.error(`Error reading PDF "${file.name}":`, error);
      this.errorMessage.set(`"${file.name}" could not be read and was removed. It may be corrupted or password protected.`);
      this.files.update(files => files.filter(f => f.id !== id));
      if (this.files().length === 0) {
        this.state.set('upload');
      }
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
      const viewport = page.getViewport({ scale: 0.4 });

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
      this.files.update(files =>
        files.map(f => f.id === id ? { ...f, thumbnail } : f)
      );

      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  removeFile(id: string, event?: Event): void {
    event?.stopPropagation();
    this.files.update(files => files.filter(f => f.id !== id));
    if (this.files().length === 0) {
      this.state.set('upload');
    }
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    const files = [...this.files()];
    [files[index - 1], files[index]] = [files[index], files[index - 1]];
    this.files.set(files);
  }

  moveDown(index: number): void {
    const files = [...this.files()];
    if (index >= files.length - 1) return;
    [files[index + 1], files[index]] = [files[index], files[index + 1]];
    this.files.set(files);
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

    const files = [...this.files()];
    const [moved] = files.splice(from, 1);
    files.splice(index, 0, moved);
    this.files.set(files);
  }

  async mergePdfs(): Promise<void> {
    if (!this.canMerge) return;

    try {
      this.state.set('processing');
      this.errorMessage.set('');

      const PDFDocClass = await this.loadPdfLib();
      const mergedDoc = await PDFDocClass.create();

      for (const item of this.files()) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocClass.load(arrayBuffer, { ignoreEncryption: true });
        const pageIndices = pdfDoc.getPageIndices();
        const copiedPages = await mergedDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page: any) => mergedDoc.addPage(page));
      }

      const pdfBytes = await mergedDoc.save();
      this.resultBlob.set(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
      this.state.set('complete');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      this.errorMessage.set('Failed to merge PDF files. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    const blob = this.resultBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  reset(): void {
    this.state.set('upload');
    this.files.set([]);
    this.resultBlob.set(null);
    this.errorMessage.set('');
  }
}
