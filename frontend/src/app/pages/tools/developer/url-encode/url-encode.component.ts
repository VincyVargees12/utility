import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type EncodingMode = 'component' | 'uri' | 'form';

@Component({
  selector: 'app-url-encode',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './url-encode.component.html',
  styleUrl: './url-encode.component.scss'
})
export class UrlEncodeComponent implements OnInit {
  private seoService = inject(SeoService);

  inputText = signal<string>('');
  outputText = signal<string>('');
  encodingMode = signal<EncodingMode>('component');
  mode = signal<'encode' | 'decode'>('encode');
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);
  inputLength = signal<number>(0);
  outputLength = signal<number>(0);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'URL Encode/Decode - Free Online Tool | DataUtil',
      description: 'Encode URL parameters or decode URL-encoded strings instantly. Supports URI component, full URI, and form data encoding. Free online URL encoder.',
      keywords: 'url encode, url decode, percent encoding, uri encode, url encoder, decode url, urlencode, urldecode',
      ogTitle: 'URL Encode/Decode - Free Online Tool',
      ogDescription: 'Encode URL parameters or decode URL-encoded strings instantly with multiple encoding modes.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/url-encode'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'URL Encoder/Decoder',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Encode URL parameters or decode URL-encoded strings with support for multiple encoding modes.',
      'url': 'https://www.data-util.com/categories/developer/url-encode',
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
      let encoded: string;

      switch (this.encodingMode()) {
        case 'component':
          // Encode URI component (most common for query parameters)
          encoded = encodeURIComponent(input);
          break;

        case 'uri':
          // Encode full URI (preserves URI structure characters like :/?#[]@)
          encoded = encodeURI(input);
          break;

        case 'form':
          // Form data encoding (application/x-www-form-urlencoded)
          // Spaces become + instead of %20
          encoded = encodeURIComponent(input).replace(/%20/g, '+');
          break;

        default:
          encoded = encodeURIComponent(input);
      }

      this.outputText.set(encoded);
      this.outputLength.set(encoded.length);
      this.errorMessage.set('');
      this.mode.set('encode');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error encoding URL';
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
      let decoded: string;

      // Handle form encoding (+ to space)
      if (this.encodingMode() === 'form' || input.includes('+')) {
        const normalized = input.replace(/\+/g, '%20');
        decoded = decodeURIComponent(normalized);
      } else {
        decoded = decodeURIComponent(input);
      }

      this.outputText.set(decoded);
      this.outputLength.set(decoded.length);
      this.errorMessage.set('');
      this.mode.set('decode');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid URL-encoded string';
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
    anchor.download = this.mode() === 'encode' ? 'encoded-url.txt' : 'decoded-url.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  loadSampleEncode(): void {
    const sample = `https://www.example.com/search?q=data utils&category=tools&filter=free
Special characters: @#$%^&*()
Email: user@example.com
Path: /api/v1/users/123
Unicode: 你好世界 🌍`;

    this.inputText.set(sample);
    this.updateInputLength();
    this.encode();
  }

  loadSampleDecode(): void {
    const sample = `https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Ddata%20utils%26category%3Dtools
user%40example.com
%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%20%F0%9F%8C%8D`;

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
