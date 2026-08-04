import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { HASH_GENERATOR_RESOURCE_CONTENT } from './hash-generator.resource-content';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

@Component({
  selector: 'app-hash-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './hash-generator.component.html',
  styleUrl: './hash-generator.component.scss'
})
export class HashGeneratorComponent implements OnInit {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  inputText = signal<string>('');
  selectedAlgorithm = signal<HashAlgorithm>('SHA-256');
  hashResults = signal<HashResult[]>([]);
  isGenerating = signal<boolean>(false);
  errorMessage = signal<string>('');
  copied = signal<string>(''); // stores which hash was copied
  inputLength = signal<number>(0);
  outputFormat = signal<'hex' | 'base64'>('hex');

  readonly algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  resourceContent = HASH_GENERATOR_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Hash Generator - MD5, SHA-1, SHA-256, SHA-512 | DataUtil',
      description: 'Generate cryptographic hashes instantly. Supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms. Free online hash generator.',
      keywords: 'hash generator, md5 hash, sha256, sha1, sha512, cryptographic hash, checksum generator, hash calculator',
      ogTitle: 'Hash Generator - MD5, SHA-1, SHA-256, SHA-512',
      ogDescription: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes instantly.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/hash'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Hash Generator',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes.',
      'url': 'https://www.data-util.com/categories/developer/hash',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  // ── Hash Generation ──────────────────────────────────────────────

  async generateSingleHash(): Promise<void> {
    const input = this.inputText();
    if (!input) {
      this.hashResults.set([]);
      this.errorMessage.set('');
      return;
    }

    this.isGenerating.set(true);
    this.errorMessage.set('');

    try {
      const algorithm = this.selectedAlgorithm();
      const hash = await this.computeHash(input, algorithm);
      
      this.hashResults.set([{
        algorithm,
        hash,
        length: hash.length
      }]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error generating hash';
      this.errorMessage.set(errorMsg);
      this.hashResults.set([]);
    } finally {
      this.isGenerating.set(false);
    }
  }

  async generateAllHashes(): Promise<void> {
    const input = this.inputText();
    if (!input) {
      this.hashResults.set([]);
      this.errorMessage.set('');
      return;
    }

    this.isGenerating.set(true);
    this.errorMessage.set('');

    try {
      const results: HashResult[] = [];
      
      for (const algorithm of this.algorithms) {
        const hash = await this.computeHash(input, algorithm);
        results.push({
          algorithm,
          hash,
          length: hash.length
        });
      }
      
      this.hashResults.set(results);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error generating hashes';
      this.errorMessage.set(errorMsg);
      this.hashResults.set([]);
    } finally {
      this.isGenerating.set(false);
    }
  }

  private async computeHash(input: string, algorithm: HashAlgorithm): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    if (algorithm === 'MD5') {
      return this.md5(input);
    }

    // Use Web Crypto API for SHA algorithms
    // Web Crypto API expects algorithm names with dashes: 'SHA-1', 'SHA-256', etc.
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    
    if (this.outputFormat() === 'base64') {
      return this.bufferToBase64(hashBuffer);
    }
    
    return this.bufferToHex(hashBuffer);
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private bufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const binary = String.fromCharCode(...byteArray);
    return btoa(binary);
  }

  // Simple MD5 implementation
  private md5(input: string): string {
    // MD5 implementation
    const rotateLeft = (value: number, shift: number): number => {
      return (value << shift) | (value >>> (32 - shift));
    };

    const addUnsigned = (x: number, y: number): number => {
      const x8 = (x & 0x80000000);
      const y8 = (y & 0x80000000);
      const x4 = (x & 0x40000000);
      const y4 = (y & 0x40000000);
      const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
      
      if (x4 & y4) return (result ^ 0x80000000 ^ x8 ^ y8);
      if (x4 | y4) {
        if (result & 0x40000000) return (result ^ 0xC0000000 ^ x8 ^ y8);
        else return (result ^ 0x40000000 ^ x8 ^ y8);
      } else {
        return (result ^ x8 ^ y8);
      }
    };

    const F = (x: number, y: number, z: number): number => (x & y) | ((~x) & z);
    const G = (x: number, y: number, z: number): number => (x & z) | (y & (~z));
    const H = (x: number, y: number, z: number): number => x ^ y ^ z;
    const I = (x: number, y: number, z: number): number => y ^ (x | (~z));

    const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (str: string): number[] => {
      const wordArray: number[] = [];
      for (let i = 0; i < str.length * 8; i += 8) {
        wordArray[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32);
      }
      return wordArray;
    };

    const utf8Encode = (str: string): string => {
      return unescape(encodeURIComponent(str));
    };

    const x = convertToWordArray(utf8Encode(input));
    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;

    const len = input.length;
    x[len >> 2] |= 0x80 << ((len % 4) * 8);
    x[(((len + 8) >> 6) * 16) + 14] = len * 8;

    for (let i = 0; i < x.length; i += 16) {
      const aa = a, bb = b, cc = c, dd = d;

      a = FF(a, b, c, d, x[i + 0], 7, 0xD76AA478);
      d = FF(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
      c = FF(c, d, a, b, x[i + 2], 17, 0x242070DB);
      b = FF(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
      d = FF(d, a, b, c, x[i + 5], 12, 0x4787C62A);
      c = FF(c, d, a, b, x[i + 6], 17, 0xA8304613);
      b = FF(b, c, d, a, x[i + 7], 22, 0xFD469501);
      a = FF(a, b, c, d, x[i + 8], 7, 0x698098D8);
      d = FF(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
      a = FF(a, b, c, d, x[i + 12], 7, 0x6B901122);
      d = FF(d, a, b, c, x[i + 13], 12, 0xFD987193);
      c = FF(c, d, a, b, x[i + 14], 17, 0xA679438E);
      b = FF(b, c, d, a, x[i + 15], 22, 0x49B40821);

      a = GG(a, b, c, d, x[i + 1], 5, 0xF61E2562);
      d = GG(d, a, b, c, x[i + 6], 9, 0xC040B340);
      c = GG(c, d, a, b, x[i + 11], 14, 0x265E5A51);
      b = GG(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[i + 5], 5, 0xD62F105D);
      d = GG(d, a, b, c, x[i + 10], 9, 0x02441453);
      c = GG(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
      b = GG(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
      d = GG(d, a, b, c, x[i + 14], 9, 0xC33707D6);
      c = GG(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
      b = GG(b, c, d, a, x[i + 8], 20, 0x455A14ED);
      a = GG(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
      d = GG(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[i + 7], 14, 0x676F02D9);
      b = GG(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);

      a = HH(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
      d = HH(d, a, b, c, x[i + 8], 11, 0x8771F681);
      c = HH(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
      b = HH(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
      a = HH(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
      d = HH(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
      c = HH(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
      b = HH(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
      a = HH(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
      d = HH(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
      c = HH(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
      b = HH(b, c, d, a, x[i + 6], 23, 0x04881D05);
      a = HH(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
      d = HH(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
      c = HH(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
      b = HH(b, c, d, a, x[i + 2], 23, 0xC4AC5665);

      a = II(a, b, c, d, x[i + 0], 6, 0xF4292244);
      d = II(d, a, b, c, x[i + 7], 10, 0x432AFF97);
      c = II(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
      b = II(b, c, d, a, x[i + 5], 21, 0xFC93A039);
      a = II(a, b, c, d, x[i + 12], 6, 0x655B59C3);
      d = II(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
      c = II(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
      b = II(b, c, d, a, x[i + 1], 21, 0x85845DD1);
      a = II(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
      d = II(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
      c = II(c, d, a, b, x[i + 6], 15, 0xA3014314);
      b = II(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
      a = II(a, b, c, d, x[i + 4], 6, 0xF7537E82);
      d = II(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
      c = II(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
      b = II(b, c, d, a, x[i + 9], 21, 0xEB86D391);

      a = addUnsigned(a, aa);
      b = addUnsigned(b, bb);
      c = addUnsigned(c, cc);
      d = addUnsigned(d, dd);
    }

    const toHex = (n: number): string => {
      let result = '';
      for (let j = 0; j <= 3; j++) {
        result += ((n >> (j * 8)) & 0xFF).toString(16).padStart(2, '0');
      }
      return result;
    };

    if (this.outputFormat() === 'base64') {
      const hex = toHex(a) + toHex(b) + toHex(c) + toHex(d);
      const bytes = new Uint8Array(hex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      return btoa(String.fromCharCode(...bytes));
    }

    return toHex(a) + toHex(b) + toHex(c) + toHex(d);
  }

  // ── Actions ──────────────────────────────────────────────

  updateInputLength(): void {
    this.inputLength.set(this.inputText().length);
  }

  clear(): void {
    this.inputText.set('');
    this.hashResults.set([]);
    this.errorMessage.set('');
    this.inputLength.set(0);
  }

  copyHash(hash: string, algorithm: string): void {
    navigator.clipboard.writeText(hash).then(() => {
      this.copied.set(algorithm);
      setTimeout(() => this.copied.set(''), 1500);
    });
  }

  downloadHashes(): void {
    if (this.hashResults().length === 0) return;

    const content = this.hashResults()
      .map(result => `${result.algorithm}: ${result.hash}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hashes.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  loadSample(): void {
    const sample = `Hello, DataUtil!
This is a sample text for hash generation.
Try different algorithms to see the results.`;

    this.inputText.set(sample);
    this.updateInputLength();
    this.generateAllHashes();
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
}
