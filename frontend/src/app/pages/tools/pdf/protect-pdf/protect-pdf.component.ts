import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

@Component({
  selector: 'app-protect-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './protect-pdf.component.html',
  styleUrl: './protect-pdf.component.scss'
})
export class ProtectPdfComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  
  pdfFile = signal<File | null>(null);
  pdfFileName = signal<string>('');
  pdfFileSize = signal<string>('');
  
  password = signal<string>('');
  repeatPassword = signal<string>('');
  
  passwordError = signal<string>('');
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Protect PDF - Encrypt PDF with Password | DataUtil',
      description: 'Secure your PDF documents with a password. Protect sensitive information by encrypting your PDF files online.',
      keywords: 'protect pdf, encrypt pdf, add password to pdf, secure pdf',
      ogTitle: 'Protect PDF - Encrypt PDF with Password',
      ogDescription: 'Secure your PDF documents by encrypting them with a password easily and safely.',
      canonicalUrl: 'https://datautility.com/categories/pdf/protect-pdf'
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

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  loadPdfFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Please upload a valid PDF file.');
      return;
    }
    
    this.pdfFile.set(file);
    this.pdfFileName.set(file.name);
    this.pdfFileSize.set(this.formatBytes(file.size));
    this.errorMessage.set('');
    
    this.state.set('configure');
  }

  async processProtection(): Promise<void> {
    if (!this.password()) {
      this.passwordError.set('Please enter a password.');
      return;
    }
    
    if (this.password() !== this.repeatPassword()) {
      this.passwordError.set('Passwords do not match.');
      return;
    }

    if (this.password().length < 4) {
      this.passwordError.set('Password must be at least 4 characters long.');
      return;
    }

    this.passwordError.set('');
    this.state.set('processing');
    this.errorMessage.set('');

    try {
      const formData = new FormData();
      formData.append('file', this.pdfFile()!);
      formData.append('password', this.password());

      // Assumes your backend runs on https://localhost:7219
      const response = await fetch('https://localhost:7219/api/pdf/protect', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      // Get filename from response header if available, otherwise fallback
      const contentDoc = response.headers.get('Content-Disposition');
      let outName = this.pdfFileName().replace(/\.pdf$/i, '_protected.pdf');
      if (contentDoc && contentDoc.includes('filename=')) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDoc);
        if (matches != null && matches[1]) {
          outName = matches[1].replace(/['"]/g, '');
        }
      }
      
      a.download = outName;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => { 
        document.body.removeChild(a); 
        window.URL.revokeObjectURL(url); 
      }, 100);

      this.state.set('complete');
    } catch (error: any) {
      console.error('Protection error:', error);
      this.errorMessage.set('Failed to protect the PDF file. Processing error via backend.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processProtection();
  }

  reset(): void {
    this.pdfFile.set(null);
    this.pdfFileName.set('');
    this.pdfFileSize.set('');
    this.password.set('');
    this.repeatPassword.set('');
    this.passwordError.set('');
    this.errorMessage.set('');
    this.state.set('upload');
  }
}
