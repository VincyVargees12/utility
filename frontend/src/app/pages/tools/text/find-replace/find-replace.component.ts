import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

interface ReplaceStats {
  matchesFound: number;
  replacementsMade: number;
  originalLength: number;
  newLength: number;
}

@Component({
  selector: 'app-find-replace',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './find-replace.component.html',
  styleUrl: './find-replace.component.scss'
})
export class FindReplaceComponent implements OnInit {
  private seoService = inject(SeoService);

  originalText = signal<string>('');
  text = signal<string>('');
  findText = signal<string>('');
  replaceText = signal<string>('');
  isReplaced = signal<boolean>(false);
  stats = signal<ReplaceStats>({
    matchesFound: 0,
    replacementsMade: 0,
    originalLength: 0,
    newLength: 0
  });
  caseSensitive = signal<boolean>(false);
  useRegex = signal<boolean>(false);
  removeEmpty = signal<boolean>(false);
  copiedToClipboard = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Find and Replace - Free Text Search & Replace Tool | DataUtil',
      description: 'Find and replace text with advanced options. Support for case-sensitive search and bulk text replacement.',
      keywords: 'find and replace, search and replace, text replacement, bulk replace, find text',
      ogTitle: 'Find and Replace - Free Text Search & Replace Tool',
      ogDescription: 'Find and replace text patterns throughout your content instantly.',
      canonicalUrl: 'https://datautility.com/categories/text/find-replace'
    });
  }

  onTextChange(): void {
    if (!this.isReplaced()) {
      this.originalText.set(this.text());
    }
  }

  onFindChange(): void {
    this.text.set(this.originalText());
    this.updateResults();
  }

  onReplaceChange(): void {
    this.text.set(this.originalText());
    this.updateResults();
  }

  private updateResults(): void {
    const original = this.originalText();
    const find = this.findText();
    const replace = this.replaceText();

    if (!original) {
      this.stats.set({
        matchesFound: 0,
        replacementsMade: 0,
        originalLength: 0,
        newLength: 0
      });
      return;
    }

    let processedText = original;
    const originalLength = original.length;

    // Remove empty lines if needed
    if (this.removeEmpty()) {
      processedText = processedText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n');
    }

    // Perform find and replace
    let resultText = processedText;
    let matchesFound = 0;

    if (find) {
      try {
        if (this.useRegex()) {
          // Use regex pattern directly
          const flags = this.caseSensitive() ? 'g' : 'gi';
          const regex = new RegExp(find, flags);
          const matches = processedText.match(regex);
          matchesFound = matches ? matches.length : 0;
          
          // Replace using regex
          resultText = processedText.replace(regex, replace);
        } else {
          // Plain text find and replace
          if (this.caseSensitive()) {
            // Case-sensitive: count occurrences
            const regex = new RegExp(this.escapeRegex(find), 'g');
            const matches = processedText.match(regex);
            matchesFound = matches ? matches.length : 0;
            
            // Replace all occurrences
            resultText = processedText.split(find).join(replace);
          } else {
            // Case-insensitive: use regex
            const regex = new RegExp(this.escapeRegex(find), 'gi');
            const matches = processedText.match(regex);
            matchesFound = matches ? matches.length : 0;
            
            // Replace all occurrences
            resultText = processedText.replace(regex, replace);
          }
        }
      } catch (error) {
        // Invalid regex pattern, show original text
        resultText = processedText;
        matchesFound = 0;
      }
    }

    const newLength = resultText.length;

    // Update textarea with replaced text if matches found
    if (matchesFound > 0) {
      this.text.set(resultText);
      this.isReplaced.set(true);
    }

    this.stats.set({
      matchesFound,
      replacementsMade: matchesFound,
      originalLength,
      newLength
    });
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  performReplace(): void {
    this.updateResults();
  }

  toggleCaseSensitive(): void {
    this.caseSensitive.set(!this.caseSensitive());
    this.updateResults();
  }

  toggleUseRegex(): void {
    this.useRegex.set(!this.useRegex());
    this.updateResults();
  }

  toggleRemoveEmpty(): void {
    this.removeEmpty.set(!this.removeEmpty());
    this.updateResults();
  }

  copyToClipboard(): void {
    const text = this.text();
    navigator.clipboard.writeText(text).then(() => {
      this.copiedToClipboard.set(true);
      setTimeout(() => this.copiedToClipboard.set(false), 2000);
    });
  }

  downloadText(): void {
    const text = this.text();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'find-replace-result.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  restoreOriginal(): void {
    this.text.set(this.originalText());
    this.isReplaced.set(false);
    this.findText.set('');
    this.replaceText.set('');
    this.stats.set({
      matchesFound: 0,
      replacementsMade: 0,
      originalLength: 0,
      newLength: 0
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
        this.originalText.set(content);
        this.text.set(content);
        this.isReplaced.set(false);
        this.findText.set('');
        this.replaceText.set('');
      };
      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.originalText.set('');
    this.text.set('');
    this.isReplaced.set(false);
    this.findText.set('');
    this.replaceText.set('');
    this.stats.set({
      matchesFound: 0,
      replacementsMade: 0,
      originalLength: 0,
      newLength: 0
    });
  }
}
