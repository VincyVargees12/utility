import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

interface SortResults {
  asc: string;
  desc: string;
  caseInsensitive: string;
  numeric: string;
  length: string;
}

interface SortStats {
  originalLines: number;
  sortedLines: number;
  emptyLinesRemoved: number;
  totalCharacters: number;
}

@Component({
  selector: 'app-sort-lines',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './sort-lines.component.html',
  styleUrl: './sort-lines.component.scss'
})
export class SortLinesComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  results = signal<SortResults>({
    asc: '',
    desc: '',
    caseInsensitive: '',
    numeric: '',
    length: ''
  });
  stats = signal<SortStats>({
    originalLines: 0,
    sortedLines: 0,
    emptyLinesRemoved: 0,
    totalCharacters: 0
  });
  copiedMode = signal<string | null>(null);
  removeEmpty = signal<boolean>(true);
  previewOpen = signal<boolean>(false);
  previewMode = signal<string | null>(null);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Sort Lines - Free Text Sorting Tool | DataUtil',
      description: 'Sort text lines alphabetically, numerically, by length, or in reverse order. Remove duplicates and empty lines instantly.',
      keywords: 'sort lines, sort text, alphabetical sort, reverse sort, numeric sort, sort by length',
      ogTitle: 'Sort Lines - Free Text Sorting Tool',
      ogDescription: 'Sort your text lines alphabetically, numerically, by length, or in reverse. Fast and easy text sorting online.',
      canonicalUrl: 'https://datautility.com/categories/text/sort-lines'
    });
  }

  onTextChange(): void {
    this.updateSortedText();
  }

  private updateSortedText(): void {
    const original = this.text();
    let lines = original.split('\n');
    const originalLines = lines.length;

    // Filter empty lines if option is enabled
    let emptyLinesRemoved = 0;
    if (this.removeEmpty()) {
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);
      emptyLinesRemoved = lines.length - nonEmptyLines.length;
      lines = nonEmptyLines;
    }

    const sortedLines = lines.length;
    const totalCharacters = original.length;

    this.stats.set({
      originalLines,
      sortedLines,
      emptyLinesRemoved,
      totalCharacters
    });

    // Generate all sort results
    this.results.set({
      asc: this.sortLines([...lines], 'asc').join('\n'),
      desc: this.sortLines([...lines], 'desc').join('\n'),
      caseInsensitive: this.sortLines([...lines], 'case-insensitive').join('\n'),
      numeric: this.sortLines([...lines], 'numeric').join('\n'),
      length: this.sortLines([...lines], 'length').join('\n')
    });
  }

  private sortLines(lines: string[], mode: string): string[] {
    switch (mode) {
      case 'asc':
        return lines.sort((a, b) => a.localeCompare(b));
      case 'desc':
        return lines.sort((a, b) => b.localeCompare(a));
      case 'case-insensitive':
        return lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      case 'numeric':
        return lines.sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return a.localeCompare(b);
        });
      case 'length':
        return lines.sort((a, b) => a.length - b.length);
      default:
        return lines;
    }
  }

  toggleRemoveEmpty(): void {
    this.removeEmpty.set(!this.removeEmpty());
    this.updateSortedText();
  }

  copyToClipboard(mode: string): void {
    let text = '';
    if (mode === 'asc') text = this.results().asc;
    else if (mode === 'desc') text = this.results().desc;
    else if (mode === 'case-insensitive') text = this.results().caseInsensitive;
    else if (mode === 'numeric') text = this.results().numeric;
    else if (mode === 'length') text = this.results().length;

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
        this.updateSortedText();
      };
      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.text.set('');
    this.results.set({
      asc: '',
      desc: '',
      caseInsensitive: '',
      numeric: '',
      length: ''
    });
    this.stats.set({
      originalLines: 0,
      sortedLines: 0,
      emptyLinesRemoved: 0,
      totalCharacters: 0
    });
  }

  downloadSorted(mode: string): void {
    let text = '';
    if (mode === 'asc') text = this.results().asc;
    else if (mode === 'desc') text = this.results().desc;
    else if (mode === 'case-insensitive') text = this.results().caseInsensitive;
    else if (mode === 'numeric') text = this.results().numeric;
    else if (mode === 'length') text = this.results().length;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `sorted-lines-${mode}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    if (mode === 'asc') return this.results().asc;
    else if (mode === 'desc') return this.results().desc;
    else if (mode === 'case-insensitive') return this.results().caseInsensitive;
    else if (mode === 'numeric') return this.results().numeric;
    else if (mode === 'length') return this.results().length;
    return '';
  }

  getPreviewTitle(): string {
    const mode = this.previewMode();
    if (mode === 'asc') return 'A → Z (Ascending)';
    else if (mode === 'desc') return 'Z → A (Descending)';
    else if (mode === 'case-insensitive') return 'Case Insensitive';
    else if (mode === 'numeric') return 'Numeric Sort';
    else if (mode === 'length') return 'By Length (Shortest to Longest)';
    return '';
  }
}


