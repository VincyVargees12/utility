import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

interface DuplicateStats {
  originalLines: number;
  uniqueLines: number;
  duplicatesRemoved: number;
  totalCharacters: number;
}

interface RemovalResults {
  caseSensitive: string;
  caseInsensitive: string;
}

@Component({
  selector: 'app-duplicate-remover',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './duplicate-remover.component.html',
  styleUrl: './duplicate-remover.component.scss'
})
export class DuplicateRemoverComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  results = signal<RemovalResults>({
    caseSensitive: '',
    caseInsensitive: ''
  });
  stats = signal<DuplicateStats>({
    originalLines: 0,
    uniqueLines: 0,
    duplicatesRemoved: 0,
    totalCharacters: 0
  });
  copiedMode = signal<string | null>(null);
  previewOpen = signal<boolean>(false);
  previewMode = signal<string | null>(null);
  removeEmpty = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Remove Duplicates - Free Duplicate Line Remover | DataUtil',
      description: 'Remove duplicate lines from your text instantly. Support for case-sensitive and case-insensitive duplicate detection.',
      keywords: 'remove duplicates, duplicate remover, remove duplicate lines, deduplicate text',
      ogTitle: 'Remove Duplicates - Free Duplicate Line Remover',
      ogDescription: 'Remove duplicate lines from your text. Works with case-sensitive and case-insensitive options.',
      canonicalUrl: 'https://datautility.com/categories/text/duplicate-remover'
    });
  }

  onTextChange(): void {
    this.updateResults();
  }

  private updateResults(): void {
    const original = this.text();
    let lines = original.split('\n');
    const originalLines = lines.length;

    // Filter empty lines if needed
    if (this.removeEmpty()) {
      lines = lines.filter(line => line.trim().length > 0);
    }

    // Case sensitive duplicates removal
    const caseSensitiveUnique = this.removeDuplicates(lines, true);
    const caseSensitiveDuplicates = lines.length - caseSensitiveUnique.length;

    // Case insensitive duplicates removal
    const caseInsensitiveUnique = this.removeDuplicates(lines, false);

    const uniqueLines = caseInsensitiveUnique.length;
    const duplicatesRemoved = lines.length - uniqueLines;
    const totalCharacters = original.length;

    this.stats.set({
      originalLines,
      uniqueLines,
      duplicatesRemoved,
      totalCharacters
    });

    this.results.set({
      caseSensitive: caseSensitiveUnique.join('\n'),
      caseInsensitive: caseInsensitiveUnique.join('\n')
    });
  }

  private removeDuplicates(lines: string[], caseSensitive: boolean): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }

    return result;
  }

  toggleRemoveEmpty(): void {
    this.removeEmpty.set(!this.removeEmpty());
    this.updateResults();
  }

  copyToClipboard(mode: string): void {
    let text = '';
    if (mode === 'case-sensitive') text = this.results().caseSensitive;
    else if (mode === 'case-insensitive') text = this.results().caseInsensitive;

    navigator.clipboard.writeText(text).then(() => {
      this.copiedMode.set(mode);
      setTimeout(() => this.copiedMode.set(null), 2000);
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.text.set(content);
        this.updateResults();
      };
      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.text.set('');
    this.results.set({
      caseSensitive: '',
      caseInsensitive: ''
    });
    this.stats.set({
      originalLines: 0,
      uniqueLines: 0,
      duplicatesRemoved: 0,
      totalCharacters: 0
    });
  }

  openPreview(mode: string): void {
    this.previewMode.set(mode);
    this.previewOpen.set(true);
  }

  closePreview(): void {
    this.previewOpen.set(false);
    setTimeout(() => this.previewMode.set(null), 300);
  }

  getPreviewText(): string {
    const mode = this.previewMode();
    if (!mode) return '';
    if (mode === 'case-sensitive') return this.results().caseSensitive;
    else if (mode === 'case-insensitive') return this.results().caseInsensitive;
    return '';
  }

  getPreviewTitle(): string {
    const mode = this.previewMode();
    if (mode === 'case-sensitive') return 'Remove Duplicates (Case-Sensitive)';
    else if (mode === 'case-insensitive') return 'Remove Duplicates (Case-Insensitive)';
    return '';
  }
}
