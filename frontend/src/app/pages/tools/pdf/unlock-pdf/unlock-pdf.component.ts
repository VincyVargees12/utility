import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'password' | 'processing' | 'complete';

@Component({
  selector: 'app-unlock-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent],
  templateUrl: './unlock-pdf.component.html',
  styleUrl: './unlock-pdf.component.scss'
})
export class UnlockPdfComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  
  pdfFile = signal<File | null>(null);
  pdfFileName = signal<string>('');
  pdfFileSize = signal<string>('');
  
  password = signal<string>('');
  passwordError = signal<string>('');
  errorMessage = signal<string>('');
  
  private rawPdfBuffer: ArrayBuffer | null = null;
  private passwordUpdateCallback: ((pwd: string) => void) | null = null;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Unlock PDF - Remove PDF Password Online | DataUtil',
      description: 'Remove PDF password security, granting you the freedom to use your PDFs as you want. Unlock PDF online for free.',
      keywords: 'unlock pdf, remove pdf password, pdf password remover, unprotect pdf',
      ogTitle: 'Unlock PDF - Remove PDF Passwords Online',
      ogDescription: 'Remove PDF password security quickly and safely.',
      canonicalUrl: 'https://datautility.com/categories/pdf/unlock-pdf'
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

  async loadPdfFile(file: File): Promise<void> {
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Please upload a valid PDF file.');
      return;
    }
    
    this.pdfFile.set(file);
    this.pdfFileName.set(file.name);
    this.pdfFileSize.set(this.formatBytes(file.size));
    this.errorMessage.set('');
    
    try {
      this.rawPdfBuffer = await file.arrayBuffer();
      await this.checkPdfEncryption();
    } catch (e: any) {
      console.error('Failed to load PDF', e);
      this.errorMessage.set('Could not read the PDF file. It might be corrupted.');
    }
  }

  async checkPdfEncryption() {
    if (!this.rawPdfBuffer || typeof window === 'undefined') return;
    
    try {
      const { PDFDocument } = await import('pdf-lib');
      // Attempt to load the PDF. If it's encrypted, it will throw an EncryptedPDFError.
      // Or if we bypass it, we can check .isEncrypted.
      const doc = await PDFDocument.load(this.rawPdfBuffer, { ignoreEncryption: true });
      
      if (doc.isEncrypted) {
        this.state.set('password');
      } else {
        this.errorMessage.set('This PDF is not password protected. No need to unlock.');
        this.state.set('upload');
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('encrypted')) {
        this.state.set('password');
      } else {
        // Fallback: If it's severely encrypted and pdf-lib completely fails to parse, 
        // assume it needs a password to unlock.
        this.state.set('password');
      }
    }
  }

  submitPassword() {
    if (!this.password()) {
      this.passwordError.set('Please enter a password.');
      return;
    }
    this.passwordError.set('');
    
    // Process password directly through the backend
    this.unlockAndSave(this.password());
  }

  async verifyAndProcessPassword(pwd: string) {
    // Deprecated for direct API connection
  }

  async unlockAndSave(validPassword: string) {
    this.state.set('processing');
    this.passwordError.set('');

    try {
      const formData = new FormData();
      formData.append('file', this.pdfFile()!);
      formData.append('password', validPassword);

      // Assumes your backend runs on https://localhost:7219
      const response = await fetch('https://localhost:7219/api/pdf/unlock', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 400 && errText.toLowerCase().includes('password')) {
          this.passwordError.set('Incorrect password. Please try again.');
          this.state.set('password');
          return;
        }
        throw new Error(errText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = this.pdfFileName().replace(/\.pdf$/i, '_unlocked.pdf');
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => { 
        document.body.removeChild(a); 
        window.URL.revokeObjectURL(url); 
      }, 100);

      this.state.set('complete');
    } catch (error) {
      console.error(error);
      this.passwordError.set('Failed to unlock the PDF. Processing error via backend.');
      this.state.set('password');
    }
  }

  downloadResult(): void {
    if (this.password()) {
      this.unlockAndSave(this.password());
    }
  }

  reset(): void {
    this.pdfFile.set(null);
    this.pdfFileName.set('');
    this.pdfFileSize.set('');
    this.password.set('');
    this.passwordError.set('');
    this.errorMessage.set('');
    this.rawPdfBuffer = null;
    this.passwordUpdateCallback = null;
    this.state.set('upload');
  }
}