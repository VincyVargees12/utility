import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { UUID_GENERATOR_RESOURCE_CONTENT } from './uuid-generator.resource-content';

type UUIDVersion = 'v1' | 'v4';
type UUIDCase = 'lowercase' | 'uppercase';

@Component({
  selector: 'app-uuid-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './uuid-generator.component.html',
  styleUrl: './uuid-generator.component.scss'
})
export class UuidGeneratorComponent implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = UUID_GENERATOR_RESOURCE_CONTENT;

  generatedUuids = signal<string[]>([]);
  uuidVersion = signal<UUIDVersion>('v4');
  uuidCase = signal<UUIDCase>('lowercase');
  quantity = signal<number>(1);
  withHyphens = signal<boolean>(true);
  withBraces = signal<boolean>(false);
  copied = signal<boolean>(false);
  copiedIndex = signal<number>(-1);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'UUID/GUID Generator - Version 1, 4 | DataUtil',
      description: 'Generate UUID/GUID instantly. Supports version 1 (timestamp-based) and version 4 (random). Bulk generation, uppercase/lowercase options.',
      keywords: 'uuid generator, guid generator, uuid v4, uuid v1, generate uuid, random uuid, bulk uuid generator',
      ogTitle: 'UUID/GUID Generator - Generate Unique Identifiers',
      ogDescription: 'Generate version 1, 4 UUIDs instantly with bulk generation support.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/uuid'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'UUID/GUID Generator',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Generate version 1 and version 4 UUIDs (GUIDs) with customizable formatting options.',
      'url': 'https://www.data-util.com/categories/developer/uuid',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  // ── UUID Generation ──────────────────────────────────────────────

  generateUuids(): void {
    const count = Math.min(Math.max(1, this.quantity()), 1000); // Limit to 1-1000
    const uuids: string[] = [];

    for (let i = 0; i < count; i++) {
      let uuid = this.uuidVersion() === 'v1' ? this.generateV1() : this.generateV4();
      uuid = this.formatUuid(uuid);
      uuids.push(uuid);
    }

    this.generatedUuids.set(uuids);
  }

  private generateV4(): string {
    // UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // y is one of 8, 9, A, or B
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateV1(): string {
    // UUID v1: time-based UUID
    // Format: xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx
    const now = Date.now();
    const timeHigh = ((now / 0x100000000) * 10000) & 0xfffffff;
    const timeLow = (now * 10000) & 0xffffffff;
    const timeHex = timeLow.toString(16).padStart(8, '0') + 
                    (timeHigh & 0xffff).toString(16).padStart(4, '0');
    
    const clockSeq = (Math.random() * 0x3fff) | 0x8000;
    const node = Array.from({length: 6}, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');

    return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${timeHex.slice(13, 16)}-${clockSeq.toString(16).padStart(4, '0')}-${node}`;
  }

  private formatUuid(uuid: string): string {
    // Remove hyphens if needed
    if (!this.withHyphens()) {
      uuid = uuid.replace(/-/g, '');
    }

    // Apply case
    uuid = this.uuidCase() === 'uppercase' ? uuid.toUpperCase() : uuid.toLowerCase();

    // Add braces if needed
    if (this.withBraces()) {
      uuid = `{${uuid}}`;
    }

    return uuid;
  }

  // ── Actions ──────────────────────────────────────────────

  clear(): void {
    this.generatedUuids.set([]);
    this.copied.set(false);
    this.copiedIndex.set(-1);
  }

  copyAll(): void {
    const content = this.generatedUuids().join('\n');
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  copyOne(uuid: string, index: number): void {
    navigator.clipboard.writeText(uuid).then(() => {
      this.copiedIndex.set(index);
      setTimeout(() => this.copiedIndex.set(-1), 1500);
    });
  }

  downloadUuids(): void {
    if (this.generatedUuids().length === 0) return;

    const content = this.generatedUuids().join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'uuids.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  regenerate(): void {
    if (this.generatedUuids().length > 0) {
      this.generateUuids();
    }
  }
}
