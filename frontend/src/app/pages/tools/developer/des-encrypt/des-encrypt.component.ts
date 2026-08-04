import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import CryptoJS from 'crypto-js';
import { DES_ENCRYPT_RESOURCE_CONTENT } from './des-encrypt.resource-content';

interface DesEncryptedPayload {
  v: 1;
  alg: 'DES-CBC';
  it: number;
  salt: string;
  iv: string;
  ct: string;
}

@Component({
  selector: 'app-des-encrypt',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './des-encrypt.component.html',
  styleUrl: './des-encrypt.component.scss'
})
export class DesEncryptComponent implements OnInit {
  private seoService = inject(SeoService);

  inputText = signal<string>('');
  outputText = signal<string>('');
  passphrase = signal<string>('');
  iterations = signal<number>(100000);
  mode = signal<'encrypt' | 'decrypt'>('encrypt');
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);
  inputLength = signal<number>(0);
  outputLength = signal<number>(0);
  isWorking = signal<boolean>(false);

  resourceContent = DES_ENCRYPT_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'DES Encrypt/Decrypt - Free Online Tool | DataUtil',
      description: 'Encrypt and decrypt text using DES-CBC with PBKDF2 key derivation. Runs entirely in your browser.',
      keywords: 'des encrypt, des decrypt, des cbc, pbkdf2, text encryption, browser encryption',
      ogTitle: 'DES Encrypt/Decrypt - Free Online Tool',
      ogDescription: 'Encrypt and decrypt text with DES-CBC directly in your browser.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/des-encrypt'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'DES Encrypt/Decrypt',
      applicationCategory: 'DeveloperApplication',
      description: 'Encrypt and decrypt text with DES-CBC and PBKDF2 key derivation in the browser.',
      url: 'https://www.data-util.com/categories/developer/des-encrypt',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    });
  }

  encrypt(): void {
    const input = this.inputText();
    if (!input) {
      this.outputText.set('');
      this.errorMessage.set('');
      return;
    }

    const validationError = this.validateInputs();
    if (validationError) {
      this.errorMessage.set(validationError);
      this.outputText.set('');
      return;
    }

    this.isWorking.set(true);

    try {
      const salt = CryptoJS.lib.WordArray.random(16);
      const iv = CryptoJS.lib.WordArray.random(8);
      const key = this.deriveDesKey(this.passphrase(), salt, this.iterations());

      const encrypted = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(input), key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const payload: DesEncryptedPayload = {
        v: 1,
        alg: 'DES-CBC',
        it: this.iterations(),
        salt: CryptoJS.enc.Base64.stringify(salt),
        iv: CryptoJS.enc.Base64.stringify(iv),
        ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      };

      const output = JSON.stringify(payload);
      this.outputText.set(output);
      this.outputLength.set(output.length);
      this.errorMessage.set('');
      this.mode.set('encrypt');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Encryption failed.';
      this.errorMessage.set(errorMsg);
      this.outputText.set('');
    } finally {
      this.isWorking.set(false);
    }
  }

  decrypt(): void {
    const input = this.inputText();
    if (!input) {
      this.outputText.set('');
      this.errorMessage.set('');
      return;
    }

    if (!this.passphrase()) {
      this.errorMessage.set('Passphrase is required for decryption.');
      this.outputText.set('');
      return;
    }

    this.isWorking.set(true);

    try {
      const payload = this.parsePayload(input);
      const salt = CryptoJS.enc.Base64.parse(payload.salt);
      const iv = CryptoJS.enc.Base64.parse(payload.iv);
      const key = this.deriveDesKey(this.passphrase(), salt, payload.it);

      const decrypted = CryptoJS.DES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(payload.ct) } as CryptoJS.lib.CipherParams,
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      if (!plaintext && payload.ct) {
        throw new Error('Decryption produced empty output.');
      }

      this.outputText.set(plaintext);
      this.outputLength.set(plaintext.length);
      this.errorMessage.set('');
      this.mode.set('decrypt');
    } catch {
      this.errorMessage.set('Unable to decrypt. Verify passphrase and encrypted payload format.');
      this.outputText.set('');
    } finally {
      this.isWorking.set(false);
    }
  }

  updateInputLength(): void {
    this.inputLength.set(this.inputText().length);
  }

  clear(): void {
    this.inputText.set('');
    this.outputText.set('');
    this.errorMessage.set('');
    this.inputLength.set(0);
    this.outputLength.set(0);
  }

  copyOutput(): void {
    const content = this.outputText();
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  copyInput(): void {
    const content = this.inputText();
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  downloadOutput(): void {
    const content = this.outputText();
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = this.mode() === 'encrypt' ? 'des-encrypted.json' : 'des-decrypted.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  loadSampleEncrypt(): void {
    const sample = `Confidential message for DES encryption.\nTimestamp: 2026-07-21\nEnvironment: browser-only crypto`;
    this.inputText.set(sample);
    this.passphrase.set('DataUtil-StrongPass#2026');
    this.iterations.set(100000);
    this.updateInputLength();
    this.encrypt();
  }

  loadSampleDecrypt(): void {
    const sampleText = 'This sample was encrypted with DES-CBC in your browser.';
    const samplePassphrase = 'DataUtil-StrongPass#2026';
    const sampleIterations = this.iterations();

    this.passphrase.set(samplePassphrase);

    const payload = this.createPayloadFromText(sampleText, samplePassphrase, sampleIterations);
    this.inputText.set(payload);
    this.updateInputLength();
    this.decrypt();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.inputText.set(content ?? '');
      this.updateInputLength();
      this.errorMessage.set('');
    };
    reader.readAsText(file);
  }

  swap(): void {
    const temp = this.inputText();
    this.inputText.set(this.outputText());
    this.outputText.set(temp);

    const tempLength = this.inputLength();
    this.inputLength.set(this.outputLength());
    this.outputLength.set(tempLength);

    this.errorMessage.set('');
  }

  private validateInputs(): string | null {
    if (!this.passphrase()) {
      return 'Passphrase is required.';
    }

    if (this.passphrase().length < 8) {
      return 'Use at least 8 characters for passphrase.';
    }

    if (this.iterations() < 10000 || this.iterations() > 1000000) {
      return 'PBKDF2 iterations should be between 10,000 and 1,000,000.';
    }

    return null;
  }

  private deriveDesKey(passphrase: string, salt: CryptoJS.lib.WordArray, iterations: number): CryptoJS.lib.WordArray {
    return CryptoJS.PBKDF2(passphrase, salt, {
      keySize: 8 / 4,
      iterations,
      hasher: CryptoJS.algo.SHA256
    });
  }

  private parsePayload(input: string): DesEncryptedPayload {
    let parsed: unknown;

    try {
      parsed = JSON.parse(input);
    } catch {
      throw new Error('Payload must be a JSON string.');
    }

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('v' in parsed) ||
      !('alg' in parsed) ||
      !('it' in parsed) ||
      !('salt' in parsed) ||
      !('iv' in parsed) ||
      !('ct' in parsed)
    ) {
      throw new Error('Invalid payload schema.');
    }

    const payload = parsed as DesEncryptedPayload;

    if (payload.v !== 1 || payload.alg !== 'DES-CBC') {
      throw new Error('Unsupported payload version or algorithm.');
    }

    if (typeof payload.it !== 'number' || payload.it < 10000 || payload.it > 1000000) {
      throw new Error('Invalid iteration count in payload.');
    }

    return payload;
  }

  private createPayloadFromText(text: string, passphrase: string, iterations: number): string {
    const salt = CryptoJS.lib.WordArray.random(16);
    const iv = CryptoJS.lib.WordArray.random(8);
    const key = this.deriveDesKey(passphrase, salt, iterations);

    const encrypted = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const payload: DesEncryptedPayload = {
      v: 1,
      alg: 'DES-CBC',
      it: iterations,
      salt: CryptoJS.enc.Base64.stringify(salt),
      iv: CryptoJS.enc.Base64.stringify(iv),
      ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    };

    return JSON.stringify(payload);
  }
}
