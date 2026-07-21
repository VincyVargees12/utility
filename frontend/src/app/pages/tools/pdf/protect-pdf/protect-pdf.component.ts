import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';
import { environment } from '../../../../../environments/environment';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

@Component({
  selector: 'app-protect-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './protect-pdf.component.html',
  styleUrl: './protect-pdf.component.scss'
})
export class ProtectPdfComponent implements OnInit {
  private seoService = inject(SeoService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  state = signal<AppState>('upload');
  
  pdfFile = signal<File | null>(null);
  pdfFileName = signal<string>('');
  pdfFileSize = signal<string>('');
  
  password = signal<string>('');
  repeatPassword = signal<string>('');
  
  passwordError = signal<string>('');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

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

  onFileSelected(files: FileList): void {
    if (files && files[0]) {
      this.loadPdfFile(files[0]);
    }
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
    
    // Validate PDF is not already locked
    this.validatePdfNotLocked(file)
      .then((isLocked) => {
        if (isLocked) {
          this.errorMessage.set('This PDF file is already password-protected. Please upload an unencrypted PDF to protect it with a new password.');
          return;
        }
        
        this.pdfFile.set(file);
        this.pdfFileName.set(file.name);
        this.pdfFileSize.set(this.formatBytes(file.size));
        this.errorMessage.set('');
        this.state.set('configure');
      })
      .catch((error) => {
        console.warn('PDF validation skipped:', error);
        // Fallback: if validation fails for technical reasons (e.g., worker loading),
        // still allow the file to proceed. Backend will catch locked PDFs.
        this.pdfFile.set(file);
        this.pdfFileName.set(file.name);
        this.pdfFileSize.set(this.formatBytes(file.size));
        this.errorMessage.set('');
        this.state.set('configure');
      });
  }

  async validatePdfNotLocked(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await import('pdfjs-dist');
      
      // Try to set worker source with fallback paths for production
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      } catch (e) {
        // Fallback for production builds where import.meta.url might not resolve correctly
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const loadingTask = pdfjs.getDocument({ 
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true
      });
      
      try {
        const pdf = await loadingTask.promise;
        // If we reach here, PDF loaded successfully, so it's not locked
        return false;
      } catch (error: any) {
        // Check if error is due to password protection
        if (error.name === 'PasswordException' || 
            error.message?.includes('password') || 
            error.message?.includes('encrypted')) {
          return true;
        }
        // Re-throw other errors
        throw error;
      }
    } catch (error) {
      // If it's a locked PDF error, return true
      const errorStr = String(error);
      if (errorStr.includes('password') || errorStr.includes('encrypted')) {
        return true;
      }
      throw error;
    }
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
      this.isProcessing.set(true);
      const formData = new FormData();
      formData.append('file', this.pdfFile()!);
      formData.append('password', this.password());

      // Use configurable API endpoint from environment
      this.http.post(`${this.apiUrl}/api/pdf/protect`, formData, { 
        responseType: 'blob',
        reportProgress: true
      }).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = this.pdfFileName().replace(/\.pdf$/i, '_protected.pdf');
          document.body.appendChild(a);
          a.click();
          
          setTimeout(() => { 
            document.body.removeChild(a); 
            window.URL.revokeObjectURL(url); 
          }, 100);

          this.isProcessing.set(false);
          this.state.set('complete');
        },
        error: (error) => {
          this.isProcessing.set(false);
          console.error('Protection error:', error);
          this.errorMessage.set('Failed to protect the PDF file. Processing error via backend.');
          this.state.set('configure');
        }
      });
    } catch (error: any) {
      this.isProcessing.set(false);
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
