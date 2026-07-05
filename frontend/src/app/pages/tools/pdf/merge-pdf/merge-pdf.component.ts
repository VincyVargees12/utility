import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PDFDocument } from 'pdf-lib';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { SeoService } from '../../../../services/seo.service';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  selected: boolean;
  order: number;
  passwordRequired?: boolean;
  passwordError?: boolean;
  showPasswordInput?: boolean;
  password?: string;
  unlocking?: boolean;
}

type ProcessingState = 'idle' | 'processing' | 'complete' | 'error';

@Component({
  selector: 'app-merge-pdf',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    BreadcrumbComponent
  ],
  templateUrl: './merge-pdf.component.html',
  styleUrls: ['./merge-pdf.component.scss']
})
export class MergePdfComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'PDF Tools', route: '/categories/pdf' },
    { label: 'Merge PDF' }
  ];

  files = signal<PdfFile[]>([]);
  state = signal<ProcessingState>('idle');
  progress = signal(0);
  errorMessage = signal('');
  downloadUrl = signal('');
  downloadFileName = signal('');
  downloadFileSize = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Merge PDF - Combine Multiple PDFs Online Free | DataUtil',
      description: 'Merge multiple PDF files into one document online for free. Fast, secure, and easy to use. No registration required.',
      keywords: 'merge pdf, combine pdf, join pdf, pdf merger, online pdf tools',
      ogTitle: 'Merge PDF - Free Online PDF Merger',
      ogDescription: 'Combine multiple PDF files into a single document. 100% free and secure.',
      canonicalUrl: 'https://datautility.com/categories/pdf/merge-pdf'
    });
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files) {
      const pdfFiles = Array.from(event.dataTransfer.files).filter(
        file => file.type === 'application/pdf'
      );
      this.handleFiles(pdfFiles);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async handleFiles(newFiles: File[]): Promise<void> {
    const currentFiles = this.files();
    const nextOrder = currentFiles.length;
    
    const pdfFiles: PdfFile[] = [];
    
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const pdfFile: PdfFile = {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        selected: true,
        order: nextOrder + i,
        passwordRequired: false
      };
      
      // Check if file is password protected
      try {
        const arrayBuffer = await file.arrayBuffer();
        await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
        // File is not encrypted or can be loaded
        pdfFile.passwordRequired = false;
      } catch (error: any) {
        // Check if it's a password-related error
        if (error.message?.includes('encrypted') || 
            error.message?.includes('password') ||
            error.message?.includes('Encrypted')) {
          pdfFile.passwordRequired = true;
        }
      }
      
      pdfFiles.push(pdfFile);
    }
    
    this.files.update(existing => [...existing, ...pdfFiles]);
    this.resetState();
  }

  removeFile(id: string): void {
    this.files.update(files => files.filter(f => f.id !== id));
    this.resetState();
  }

  onDrop(event: CdkDragDrop<PdfFile[]>): void {
    const files = [...this.files()];
    moveItemInArray(files, event.previousIndex, event.currentIndex);
    this.files.set(files);
  }

  toggleSelectAll(): void {
    const allSelected = this.files().every(f => f.selected);
    this.files.update(files => 
      files.map(f => ({ ...f, selected: !allSelected }))
    );
  }

  get selectedCount(): number {
    return this.files().filter(f => f.selected).length;
  }

  get allSelected(): boolean {
    return this.files().length > 0 && this.files().every(f => f.selected);
  }

  toggleSortOrder(): void {
    const current = this.sortOrder();
    this.sortOrder.set(current === 'asc' ? 'desc' : 'asc');
    this.sortFiles();
  }

  sortFiles(): void {
    const files = [...this.files()];
    const order = this.sortOrder();
    
    files.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    });
    
    this.files.set(files);
  }

  get canMerge(): boolean {
    const selectedFiles = this.files().filter(f => f.selected);
    const hasLockedFiles = selectedFiles.some(f => f.passwordRequired);
    return selectedFiles.length >= 2 && this.state() === 'idle' && !hasLockedFiles;
  }

  get hasSelectedLockedFiles(): boolean {
    return this.files().some(f => f.selected && f.passwordRequired);
  }

  async mergePDFs(): Promise<void> {
    if (!this.canMerge) return;

    this.state.set('processing');
    this.progress.set(0);
    this.errorMessage.set('');

    try {
      const mergedPdf = await PDFDocument.create();
      const selectedFiles = this.files().filter(f => f.selected);
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const fileItem = selectedFiles[i];
        this.progress.set(Math.round((i / totalFiles) * 90));

        try {
          const arrayBuffer = await fileItem.file.arrayBuffer();
          
          // Try loading the PDF
          const pdf = await PDFDocument.load(arrayBuffer);
          
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
          });

          // Clear any previous password error
          this.files.update(files => 
            files.map(f => f.id === fileItem.id ? { ...f, passwordError: false, passwordRequired: false } : f)
          );

        } catch (fileError: any) {
          // Check if it's a password-related error
          if (fileError.message?.includes('encrypted') || 
              fileError.message?.includes('password') ||
              fileError.message?.includes('Encrypted')) {
            
            // Mark this file as requiring password
            this.files.update(files => 
              files.map(f => f.id === fileItem.id ? 
                { ...f, passwordRequired: true, passwordError: true } : f
              )
            );

            this.errorMessage.set(
              `"${fileItem.name}" is password-protected. Unfortunately, password-protected PDFs cannot be merged directly. ` +
              `Please remove the password from this file first using our <a href="/categories/pdf/unlock-pdf" class="error-link">Unlock PDF</a> tool, then try merging again.`
            );
            this.state.set('error');
            return;
          }
          
          // Re-throw if it's not a password error
          throw fileError;
        }
      }

      this.progress.set(95);

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      this.downloadUrl.set(url);
      this.downloadFileName.set('merged-document.pdf');
      this.downloadFileSize.set(this.formatFileSize(blob.size));
      this.progress.set(100);
      this.state.set('complete');

    } catch (error: any) {
      console.error('Error merging PDFs:', error);
      this.errorMessage.set('Failed to merge PDFs. Please ensure all files are valid PDF documents.');
      this.state.set('error');
    }
  }

  resetState(): void {
    if (this.state() !== 'idle') {
      this.state.set('idle');
      this.progress.set(0);
      this.errorMessage.set('');
      
      if (this.downloadUrl()) {
        URL.revokeObjectURL(this.downloadUrl());
        this.downloadUrl.set('');
      }
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  startNewMerge(): void {
    this.files.set([]);
    this.resetState();
  }

  togglePasswordInput(fileId: string): void {
    this.files.update(files =>
      files.map(f => f.id === fileId ? { ...f, showPasswordInput: !f.showPasswordInput } : f)
    );
  }

  async unlockFile(fileId: string): Promise<void> {
    const fileItem = this.files().find(f => f.id === fileId);
    if (!fileItem || !fileItem.password) return;

    // Set unlocking state
    this.files.update(files =>
      files.map(f => f.id === fileId ? { ...f, unlocking: true, passwordError: false } : f)
    );

    try {
      const arrayBuffer = await fileItem.file.arrayBuffer();
      
      // Try to load with password
      await PDFDocument.load(arrayBuffer, { 
        ignoreEncryption: false
      });

      // If successful, mark as unlocked
      this.files.update(files =>
        files.map(f => f.id === fileId ? 
          { 
            ...f, 
            passwordRequired: false, 
            passwordError: false, 
            showPasswordInput: false,
            unlocking: false 
          } : f
        )
      );

    } catch (error: any) {
      // If still encrypted or wrong password
      this.files.update(files =>
        files.map(f => f.id === fileId ? 
          { 
            ...f, 
            passwordError: true, 
            unlocking: false 
          } : f
        )
      );
    }
  }
}

