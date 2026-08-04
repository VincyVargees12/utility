import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { ASCII_CONVERTER_RESOURCE_CONTENT } from './ascii-converter.resource-content';

type FieldKey = 'text' | 'binary' | 'hex' | 'base64' | 'decimal' | 'rot13' | 'urlEncoded' | 'htmlEntities';

interface FieldConfig {
  key: FieldKey;
  label: string;
  placeholder: string;
  encode: (text: string) => string;
  decode: (value: string) => string;
}

function rot13(input: string): string {
  return input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function toBinary(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function fromBinary(value: string): string {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  return tokens.map(t => {
    const code = parseInt(t, 2);
    if (isNaN(code)) throw new Error('Invalid binary sequence');
    return String.fromCharCode(code);
  }).join('');
}

function toHex(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function fromHex(value: string): string {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  return tokens.map(t => {
    const code = parseInt(t, 16);
    if (isNaN(code)) throw new Error('Invalid hexadecimal sequence');
    return String.fromCharCode(code);
  }).join('');
}

function toDecimal(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(10)).join(' ');
}

function fromDecimal(value: string): string {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  return tokens.map(t => {
    const code = parseInt(t, 10);
    if (isNaN(code)) throw new Error('Invalid decimal sequence');
    return String.fromCharCode(code);
  }).join('');
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function fromBase64(value: string): string {
  const binary = atob(value.replace(/\s+/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function toUrlEncoded(text: string): string {
  return encodeURIComponent(text).replace(/%20/g, '+');
}

function fromUrlEncoded(value: string): string {
  return decodeURIComponent(value.replace(/\+/g, '%20'));
}

const HTML_NAMED_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function toHtmlEntities(text: string): string {
  return Array.from(text)
    .map(c => HTML_NAMED_ENTITIES[c] ?? (c.charCodeAt(0) > 127 ? `&#${c.codePointAt(0)};` : c))
    .join('');
}

function fromHtmlEntities(value: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = value;
  return el.value;
}

const FIELDS: FieldConfig[] = [
  { key: 'text', label: 'Text (ASCII / ANSI)', placeholder: 'Type or paste text here...', encode: t => t, decode: v => v },
  { key: 'binary', label: 'Binary', placeholder: '01001000 01101001', encode: toBinary, decode: fromBinary },
  { key: 'hex', label: 'Hexadecimal', placeholder: '48 69', encode: toHex, decode: fromHex },
  { key: 'base64', label: 'BASE64', placeholder: 'SGk=', encode: toBase64, decode: fromBase64 },
  { key: 'decimal', label: 'Decimal', placeholder: '72 105', encode: toDecimal, decode: fromDecimal },
  { key: 'rot13', label: 'ROT13', placeholder: 'Uv', encode: rot13, decode: rot13 },
  { key: 'urlEncoded', label: 'URL Encoded', placeholder: 'Hi', encode: toUrlEncoded, decode: fromUrlEncoded },
  { key: 'htmlEntities', label: 'HTML Entities', placeholder: 'Hi', encode: toHtmlEntities, decode: fromHtmlEntities }
];

const EMPTY_VALUES: Record<FieldKey, string> = {
  text: '', binary: '', hex: '', base64: '', decimal: '', rot13: '', urlEncoded: '', htmlEntities: ''
};

const SAMPLE_TEXT = 'Hello, DataUtil! 123';

@Component({
  selector: 'app-ascii-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './ascii-converter.component.html',
  styleUrl: './ascii-converter.component.scss'
})
export class AsciiConverterComponent implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = ASCII_CONVERTER_RESOURCE_CONTENT;
  fields = FIELDS;

  values = signal<Record<FieldKey, string>>({ ...EMPTY_VALUES });
  errorKey = signal<FieldKey | null>(null);
  copiedKey = signal<FieldKey | null>(null);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'ASCII Converter - Text to Binary, Hex & Base64 | DataUtil',
      description: 'Convert text to binary, hexadecimal, Base64, decimal, ROT13, URL encoding, and HTML entities all at once. Edit any format and convert it back to sync the rest.',
      keywords: 'ascii to hex, ascii to binary, text to binary, text to decimal, rot13, ascii converter, base64 encode, url encode, html entities',
      ogTitle: 'ASCII Converter - Text to Binary, Hex & Base64',
      ogDescription: 'Convert text to binary, hexadecimal, Base64, decimal, ROT13, URL encoding, and HTML entities instantly.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/ascii-converter'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'ASCII Converter',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Convert text to binary, hexadecimal, Base64, decimal, ROT13, URL encoding, and HTML entities.',
      'url': 'https://www.data-util.com/categories/developer/ascii-converter',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  updateValue(key: FieldKey, value: string): void {
    this.values.update(v => ({ ...v, [key]: value }));
    if (this.errorKey() === key) this.errorKey.set(null);
  }

  /** Treats the given field as the source of truth: decodes it back to plain text, then re-encodes every field from that. */
  convert(sourceKey: FieldKey): void {
    const sourceField = this.fields.find(f => f.key === sourceKey)!;
    const raw = this.values()[sourceKey];

    let canonicalText: string;
    try {
      canonicalText = sourceField.decode(raw);
    } catch {
      this.errorKey.set(sourceKey);
      return;
    }

    this.errorKey.set(null);
    const next = { ...EMPTY_VALUES };
    for (const field of this.fields) {
      next[field.key] = field.encode(canonicalText);
    }
    this.values.set(next);
  }

  highlight(el: HTMLTextAreaElement): void {
    el.focus();
    el.select();
  }

  copyField(key: FieldKey): void {
    const content = this.values()[key];
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.copiedKey.set(key);
      setTimeout(() => this.copiedKey.set(null), 1500);
    });
  }

  loadSample(): void {
    this.values.set({ ...EMPTY_VALUES, text: SAMPLE_TEXT });
    this.convert('text');
  }

  clearAll(): void {
    this.values.set({ ...EMPTY_VALUES });
    this.errorKey.set(null);
  }
}
