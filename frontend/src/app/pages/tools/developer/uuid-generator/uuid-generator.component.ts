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
type ActiveTab = 'generate' | 'analyze';

interface UuidFields {
  timeLow: string;
  timeMid: string;
  timeHiAndVersion: string;
  clockSeqHiAndReserved: string;
  clockSeqLow: string;
  node: string;
}

interface UuidAnalysis {
  normalized: string;
  isNil: boolean;
  isMax: boolean;
  version: number | null;
  versionLabel: string;
  variant: string;
  variantDescription: string;
  fields: UuidFields;
  timestamp: Date | null;
  clockSequence: number | null;
  nodeId: string | null;
  isRandomNode: boolean | null;
  hashAlgorithm: string | null;
}

const VERSION_LABELS: Record<number, string> = {
  1: 'Version 1 — Time-based (MAC/timestamp)',
  2: 'Version 2 — DCE Security (rarely used)',
  3: 'Version 3 — Name-based (MD5 hash)',
  4: 'Version 4 — Random',
  5: 'Version 5 — Name-based (SHA-1 hash)'
};

// 100-ns intervals between the UUID epoch (1582-10-15) and the Unix epoch (1970-01-01).
const GREGORIAN_TO_UNIX_100NS_OFFSET = 122192928000000000n;

const SAMPLE_UUIDS: Record<string, string> = {
  v1: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  v3: '6fa459ea-ee8a-3ca4-894e-db77e160355e',
  v4: '3f2a9c1e-7b4d-4a6f-9c2e-1d8f5b3a7e6c',
  v5: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
  nil: '00000000-0000-0000-0000-000000000000'
};

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

  activeTab = signal<ActiveTab>('generate');

  // ── Generate state ──────────────────────────────────────────────
  generatedUuids = signal<string[]>([]);
  uuidVersion = signal<UUIDVersion>('v4');
  uuidCase = signal<UUIDCase>('lowercase');
  quantity = signal<number>(1);
  withHyphens = signal<boolean>(true);
  withBraces = signal<boolean>(false);
  copied = signal<boolean>(false);
  copiedIndex = signal<number>(-1);

  // ── Analyze/Decode state ────────────────────────────────────────
  uuidToAnalyze = signal<string>('');
  analysis = signal<UuidAnalysis | null>(null);
  analyzeError = signal<string | null>(null);
  copiedNormalized = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'UUID/GUID Generator & Decoder - Version 1, 4 | DataUtil',
      description: 'Generate UUID/GUID instantly, or decode any UUID to inspect its version, variant, timestamp, and field structure. Supports v1 and v4.',
      keywords: 'uuid generator, guid generator, uuid decoder, uuid analyzer, uuid v4, uuid v1, generate uuid, decode uuid, parse uuid',
      ogTitle: 'UUID/GUID Generator & Decoder',
      ogDescription: 'Generate version 1 and 4 UUIDs, or decode and analyze any UUID/GUID to inspect its structure.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/uuid'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'UUID/GUID Generator & Decoder',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Generate version 1 and version 4 UUIDs (GUIDs), or decode and analyze any UUID to inspect its version, variant, timestamp, and structure.',
      'url': 'https://www.data-util.com/categories/developer/uuid',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
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

  // ── Generate Actions ──────────────────────────────────────────────

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

  // ── Analyze / Decode ──────────────────────────────────────────────

  setUuidToAnalyze(value: string): void {
    this.uuidToAnalyze.set(value);
    this.analysis.set(null);
    this.analyzeError.set(null);
  }

  loadAnalyzeSample(kind: keyof typeof SAMPLE_UUIDS): void {
    this.uuidToAnalyze.set(SAMPLE_UUIDS[kind]);
    this.analyzeUuid();
  }

  analyzeUuid(): void {
    const raw = this.uuidToAnalyze().trim();

    // Strip an optional urn:uuid: prefix and surrounding braces, then require exactly 32 hex digits.
    const cleaned = raw.replace(/^urn:uuid:/i, '').replace(/^\{|\}$/g, '');
    const hex = cleaned.replace(/-/g, '').toLowerCase();

    if (!/^[0-9a-f]{32}$/.test(hex)) {
      this.analysis.set(null);
      this.analyzeError.set('Not a valid UUID — expected 32 hex characters, with or without hyphens/braces (e.g. 550e8400-e29b-41d4-a716-446655440000).');
      return;
    }

    this.analyzeError.set(null);

    const fields: UuidFields = {
      timeLow: hex.slice(0, 8),
      timeMid: hex.slice(8, 12),
      timeHiAndVersion: hex.slice(12, 16),
      clockSeqHiAndReserved: hex.slice(16, 18),
      clockSeqLow: hex.slice(18, 20),
      node: hex.slice(20, 32)
    };

    const normalized = `${fields.timeLow}-${fields.timeMid}-${fields.timeHiAndVersion}-${fields.clockSeqHiAndReserved}${fields.clockSeqLow}-${fields.node}`;

    const isNil = hex === '0'.repeat(32);
    const isMax = hex === 'f'.repeat(32);

    const version = parseInt(fields.timeHiAndVersion[0], 16);
    const clockSeqHiByte = parseInt(fields.clockSeqHiAndReserved, 16);

    let variant: string;
    let variantDescription: string;
    if ((clockSeqHiByte & 0x80) === 0x00) {
      variant = 'NCS';
      variantDescription = 'Reserved for NCS backward compatibility';
    } else if ((clockSeqHiByte & 0xc0) === 0x80) {
      variant = 'RFC 4122';
      variantDescription = 'Standard variant defined by RFC 4122 / RFC 9562';
    } else if ((clockSeqHiByte & 0xe0) === 0xc0) {
      variant = 'Microsoft';
      variantDescription = 'Reserved for Microsoft backward compatibility (legacy COM/OLE GUIDs)';
    } else {
      variant = 'Future';
      variantDescription = 'Reserved for future definition';
    }

    let timestamp: Date | null = null;
    let clockSequence: number | null = null;
    let nodeId: string | null = null;
    let isRandomNode: boolean | null = null;
    let hashAlgorithm: string | null = null;

    if (version === 1) {
      const timeHiBits = fields.timeHiAndVersion.slice(1); // drop the version nibble — 12 bits remain
      const intervalsHex = timeHiBits + fields.timeMid + fields.timeLow; // 60-bit count of 100ns intervals
      const intervals = BigInt('0x' + intervalsHex);
      const unixMs = Number((intervals - GREGORIAN_TO_UNIX_100NS_OFFSET) / 10000n);
      timestamp = new Date(unixMs);

      clockSequence = ((clockSeqHiByte & 0x3f) << 8) | parseInt(fields.clockSeqLow, 16);

      const nodeFirstByte = parseInt(fields.node.slice(0, 2), 16);
      isRandomNode = (nodeFirstByte & 0x01) === 1;
      nodeId = fields.node.match(/.{2}/g)!.join(':');
    } else if (version === 3) {
      hashAlgorithm = 'MD5';
    } else if (version === 5) {
      hashAlgorithm = 'SHA-1';
    }

    this.analysis.set({
      normalized,
      isNil,
      isMax,
      version: isNil || isMax ? null : version,
      versionLabel: isNil ? 'Nil UUID' : isMax ? 'Max UUID' : (VERSION_LABELS[version] ?? `Unrecognized version nibble (${version})`),
      variant,
      variantDescription,
      fields,
      timestamp,
      clockSequence,
      nodeId,
      isRandomNode,
      hashAlgorithm
    });
  }

  clearAnalysis(): void {
    this.uuidToAnalyze.set('');
    this.analysis.set(null);
    this.analyzeError.set(null);
  }

  copyNormalized(): void {
    const value = this.analysis()?.normalized;
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      this.copiedNormalized.set(true);
      setTimeout(() => this.copiedNormalized.set(false), 1500);
    });
  }
}
