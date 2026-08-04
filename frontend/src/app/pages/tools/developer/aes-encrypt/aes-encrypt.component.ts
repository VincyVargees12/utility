import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { AES_ENCRYPT_RESOURCE_CONTENT } from './aes-encrypt.resource-content';

type AesKeySize = 128 | 192 | 256;

interface EncryptedPayload {
  v: 1;
  alg: 'AES-GCM';
  ks: AesKeySize;
  it: number;
  salt: string;
  iv: string;
  ct: string;
}

@Component({
  selector: 'app-aes-encrypt',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './aes-encrypt.component.html',
  styleUrl: './aes-encrypt.component.scss'
})
export class AesEncryptComponent implements OnInit {
  private seoService = inject(SeoService);

  inputText = signal<string>('');
  outputText = signal<string>('');
  passphrase = signal<string>('');
  keySize = signal<AesKeySize>(256);
  iterations = signal<number>(100000);
  mode = signal<'encrypt' | 'decrypt'>('encrypt');
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);
  inputLength = signal<number>(0);
  outputLength = signal<number>(0);
  isWorking = signal<boolean>(false);

  resourceContent = AES_ENCRYPT_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'AES Encrypt/Decrypt - Free Online Tool | DataUtil',
      description: 'Encrypt and decrypt text securely using AES-GCM with PBKDF2 key derivation. Everything runs locally in your browser.',
      keywords: 'aes encrypt, aes decrypt, aes gcm, pbkdf2, text encryption, browser encryption',
      ogTitle: 'AES Encrypt/Decrypt - Free Online Tool',
      ogDescription: 'Encrypt and decrypt text securely using AES-GCM. No data leaves your browser.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/aes-encrypt'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'AES Encrypt/Decrypt',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Encrypt and decrypt text with AES-GCM and PBKDF2 key derivation directly in the browser.',
      'url': 'https://www.data-util.com/categories/developer/aes-encrypt',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  async encrypt(): Promise<void> {
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

    if (!this.isCryptoSupported()) {
      this.errorMessage.set('Web Crypto API is not available in this browser context.');
      return;
    }

    this.isWorking.set(true);

    try {
      const encoder = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const key = await this.deriveKey(this.passphrase(), salt, this.iterations(), this.keySize());
      const plainBytes = encoder.encode(input);
      const cipherBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: this.toArrayBuffer(iv) },
        key,
        plainBytes
      );
      const cipherBytes = new Uint8Array(cipherBuffer);

      const payload: EncryptedPayload = {
        v: 1,
        alg: 'AES-GCM',
        ks: this.keySize(),
        it: this.iterations(),
        salt: this.bytesToBase64(salt),
        iv: this.bytesToBase64(iv),
        ct: this.bytesToBase64(cipherBytes)
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

  async decrypt(): Promise<void> {
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

    if (!this.isCryptoSupported()) {
      this.errorMessage.set('Web Crypto API is not available in this browser context.');
      return;
    }

    this.isWorking.set(true);

    try {
      const payload = this.parsePayload(input);
      const salt = this.base64ToBytes(payload.salt);
      const iv = this.base64ToBytes(payload.iv);
      const cipherBytes = this.base64ToBytes(payload.ct);

      const key = await this.deriveKey(this.passphrase(), salt, payload.it, payload.ks);
      const plainBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: this.toArrayBuffer(iv) },
        key,
        this.toArrayBuffer(cipherBytes)
      );
      const decoder = new TextDecoder();
      const plainText = decoder.decode(plainBuffer);

      this.outputText.set(plainText);
      this.outputLength.set(plainText.length);
      this.errorMessage.set('');
      this.mode.set('decrypt');
    } catch (error) {
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
    anchor.download = this.mode() === 'encrypt' ? 'aes-encrypted.json' : 'aes-decrypted.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  async loadSampleEncrypt(): Promise<void> {
    const sample = `Confidential message for AES encryption.\nTimestamp: 2026-07-21\nEnvironment: browser-only crypto`;
    this.inputText.set(sample);
    this.passphrase.set('DataUtil-StrongPass#2026');
    this.keySize.set(256);
    this.iterations.set(100000);
    this.updateInputLength();
    await this.encrypt();
  }

  async loadSampleDecrypt(): Promise<void> {
    const sampleText = 'This sample was encrypted with AES-GCM in your browser.';
    this.passphrase.set('DataUtil-StrongPass#2026');

    const payload = await this.createPayloadFromText(sampleText, this.passphrase(), this.keySize(), this.iterations());
    this.inputText.set(payload);
    this.updateInputLength();
    await this.decrypt();
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

  private isCryptoSupported(): boolean {
    return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
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

  private async deriveKey(
    passphrase: string,
    salt: Uint8Array,
    iterations: number,
    keySize: AesKeySize
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passphraseBytes = encoder.encode(passphrase);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passphraseBytes,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.toArrayBuffer(salt),
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: keySize
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private parsePayload(input: string): EncryptedPayload {
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
      !('ks' in parsed) ||
      !('it' in parsed) ||
      !('salt' in parsed) ||
      !('iv' in parsed) ||
      !('ct' in parsed)
    ) {
      throw new Error('Invalid payload schema.');
    }

    const payload = parsed as EncryptedPayload;

    if (payload.v !== 1 || payload.alg !== 'AES-GCM') {
      throw new Error('Unsupported payload version or algorithm.');
    }

    if (![128, 192, 256].includes(payload.ks) || typeof payload.it !== 'number') {
      throw new Error('Invalid key settings in payload.');
    }

    return payload;
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  private base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  private toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  }

  private async createPayloadFromText(
    text: string,
    passphrase: string,
    keySize: AesKeySize,
    iterations: number
  ): Promise<string> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(passphrase, salt, iterations, keySize);

    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: this.toArrayBuffer(iv) },
      key,
      encoder.encode(text)
    );

    const payload: EncryptedPayload = {
      v: 1,
      alg: 'AES-GCM',
      ks: keySize,
      it: iterations,
      salt: this.bytesToBase64(salt),
      iv: this.bytesToBase64(iv),
      ct: this.bytesToBase64(new Uint8Array(cipherBuffer))
    };

    return JSON.stringify(payload);
  }
}
