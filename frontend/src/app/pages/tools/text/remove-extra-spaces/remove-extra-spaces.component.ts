import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

interface SpaceStats {
  originalLength: number;
  cleanedLength: number;
  spacesRemoved: number;
  blankLinesRemoved: number;
  originalLines: number;
  cleanedLines: number;
}

@Component({
  selector: 'app-remove-extra-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent],
  templateUrl: './remove-extra-spaces.component.html',
  styleUrl: './remove-extra-spaces.component.scss'
})
export class RemoveExtraSpacesComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  cleanedText = signal<string>('');
  stats = signal<SpaceStats>({
    originalLength: 0,
    cleanedLength: 0,
    spacesRemoved: 0,
    blankLinesRemoved: 0,
    originalLines: 0,
    cleanedLines: 0
  });
  copiedResult = signal<boolean>(false);
  removalMode = signal<'all' | 'single' | 'lines'>('all');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Remove Extra Spaces - Free Text Cleaner | DataUtil',
      description: 'Remove extra spaces, trailing whitespace, and blank lines from your text instantly. Clean and trim your text with multiple removal modes.',
      keywords: 'remove spaces, remove whitespace, text cleaner, trim text, remove blank lines',
      ogTitle: 'Remove Extra Spaces - Free Text Cleaner',
      ogDescription: 'Remove extra spaces and whitespace from your text instantly. Supports multiple cleaning modes.',
      canonicalUrl: 'https://datautility.com/categories/text/remove-extra-spaces'
    });
  }

  onTextChange(): void {
    this.updateCleanedText();
  }

  private updateCleanedText(): void {
    const original = this.text();
    const originalLines = original.split('\n').length;
    
    let cleaned = '';
    
    if (this.removalMode() === 'all') {
      // Remove all extra spaces: leading/trailing per line, multiple spaces to single
      cleaned = original
        .split('\n')
        .map(line => line.trim().replace(/\s+/g, ' '))
        .filter(line => line.length > 0)
        .join('\n');
    } else if (this.removalMode() === 'single') {
      // Replace multiple spaces with single space, keep lines
      cleaned = original
        .split('\n')
        .map(line => line.trim().replace(/\s+/g, ' '))
        .join('\n');
    } else {
      // Remove blank lines only
      cleaned = original
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n');
    }

    const cleanedLines = cleaned.split('\n').length;
    const spacesRemoved = original.length - cleaned.length;
    const blankLinesRemoved = originalLines - cleanedLines;

    this.cleanedText.set(cleaned);
    this.stats.set({
      originalLength: original.length,
      cleanedLength: cleaned.length,
      spacesRemoved: Math.max(0, spacesRemoved),
      blankLinesRemoved: Math.max(0, blankLinesRemoved),
      originalLines,
      cleanedLines
    });
  }

  setRemovalMode(mode: 'all' | 'single' | 'lines'): void {
    this.removalMode.set(mode);
    this.updateCleanedText();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.text.set(content);
        this.onTextChange();
      };

      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.text.set('');
    this.cleanedText.set('');
    this.copiedResult.set(false);
    this.onTextChange();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.cleanedText()).then(() => {
      this.copiedResult.set(true);
      setTimeout(() => this.copiedResult.set(false), 2000);
    });
  }

  downloadCleaned(): void {
    const element = document.createElement('a');
    const file = new Blob([this.cleanedText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cleaned-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  }
}
