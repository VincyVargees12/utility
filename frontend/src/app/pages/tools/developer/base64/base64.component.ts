import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { BASE64_RESOURCE_CONTENT } from './base64.resource-content';

type EncodingType = 'utf-8' | 'ascii' | 'latin1';
type OutputFormat = 'standard' | 'url-safe' | 'mime';

@Component({
  selector: 'app-base64',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './base64.component.html',
  styleUrl: './base64.component.scss'
})
export class Base64Component implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = BASE64_RESOURCE_CONTENT;

  inputText = signal<string>('');
  outputText = signal<string>('');
  encodingType = signal<EncodingType>('utf-8');
  outputFormat = signal<OutputFormat>('standard');
  mode = signal<'encode' | 'decode'>('encode');
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);
  inputLength = signal<number>(0);
  outputLength = signal<number>(0);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Base64 Encode/Decode - Free Online Tool | DataUtil',
      description: 'Encode text to Base64 or decode Base64 to text instantly. Supports UTF-8, ASCII, standard and URL-safe Base64 formats. Free online Base64 converter.',
      keywords: 'base64 encode, base64 decode, base64 converter, encode to base64, decode base64, base64 tool, url-safe base64',
      ogTitle: 'Base64 Encode/Decode - Free Online Tool',
      ogDescription: 'Encode text to Base64 or decode Base64 to text instantly with support for multiple formats.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/base64'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Base64 Encoder/Decoder',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Encode text to Base64 or decode Base64 to text with support for multiple character encodings and output formats.',
      'url': 'https://www.data-util.com/categories/developer/base64',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  // ── Actions ──────────────────────────────────────────────

  encode(): void {
    const input = this.inputText();
    if (!input) {
      this.outputText.set('');
      this.errorMessage.set('');
      return;
    }

    try {
      // Encode to Base64
      let base64: string;
      
      if (this.encodingType() === 'utf-8') {
        // UTF-8 encoding (most common)
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        base64 = btoa(String.fromCharCode(...bytes));
      } else {
        // ASCII/Latin1 - direct btoa
        base64 = btoa(input);
      }

      // Apply output format
      if (this.outputFormat() === 'url-safe') {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } else if (this.outputFormat() === 'mime') {
        // MIME format: split into 76-character lines
        base64 = base64.match(/.{1,76}/g)?.join('\n') ?? base64;
      }

      this.outputText.set(base64);
      this.outputLength.set(base64.length);
      this.errorMessage.set('');
      this.mode.set('encode');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error encoding to Base64';
      this.errorMessage.set(errorMsg);
      this.outputText.set('');
    }
  }

  decode(): void {
    const input = this.inputText();
    if (!input) {
      this.outputText.set('');
      this.errorMessage.set('');
      return;
    }

    try {
      // Normalize input: remove whitespace and newlines
      let base64 = input.replace(/\s/g, '');

      // Convert URL-safe Base64 to standard Base64
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }

      // Decode from Base64
      const decoded = atob(base64);

      // Convert to proper text based on encoding type
      let text: string;
      if (this.encodingType() === 'utf-8') {
        // UTF-8 decoding
        const bytes = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)));
        const decoder = new TextDecoder('utf-8');
        text = decoder.decode(bytes);
      } else {
        // ASCII/Latin1 - direct use
        text = decoded;
      }

      this.outputText.set(text);
      this.outputLength.set(text.length);
      this.errorMessage.set('');
      this.mode.set('decode');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid Base64 string';
      this.errorMessage.set(errorMsg);
      this.outputText.set('');
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
    anchor.download = this.mode() === 'encode' ? 'encoded.txt' : 'decoded.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  loadSampleEncode(): void {
    const sample = `Hello, DataUtil! 👋
This is a sample text for Base64 encoding.
Special characters: @#$%^&*()
Numbers: 1234567890
Unicode: 你好世界 🌍`;

    this.inputText.set(sample);
    this.updateInputLength();
    this.encode();
  }

  loadSampleDecode(): void {
    const sample = `SGVsbG8sIERhdGFVdGlsISBbCVRoaXMgaXMgYSBzYW1wbGUgdGV4dCBmb3IgQmFzZTY0IGVuY29kaW5nLgpTcGVjaWFsIGNoYXJhY3RlcnM6IEAjJCVeJiooKQpOdW1iZXJzOiAxMjM0NTY3ODkwClVuaWNvZGU6IOS9oOWlveS4lueVjCDwn4yN`;

    this.inputText.set(sample);
    this.updateInputLength();
    this.decode();
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
}
