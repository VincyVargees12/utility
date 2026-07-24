import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

interface TextStats {
  words: number;
  sentences: number;
  paragraphs: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  readingTime: string;
}

@Component({
  selector: 'app-character-counter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent],
  templateUrl: './character-counter.component.html',
  styleUrl: './character-counter.component.scss'
})
export class CharacterCounterComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  stats = signal<TextStats>({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    charactersWithSpaces: 0,
    charactersWithoutSpaces: 0,
    readingTime: '0 m 0 s'
  });

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Character Counter - Free Text Character Counter | DataUtil',
      description: 'Count characters, words, sentences, paragraphs instantly. Upload text files or paste content. Completely free and private.',
      keywords: 'character counter, character count, text analyzer, word counter, sentence counter',
      ogTitle: 'Character Counter - Free Text Character Counter',
      ogDescription: 'Instantly count characters, words, sentences, paragraphs, and calculate reading time.',
      canonicalUrl: 'https://datautility.com/categories/text/character-counter'
    });
  }

  onTextChange(): void {
    this.updateStats();
  }

  private updateStats(): void {
    const content = this.text();

    // Count words
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;

    // Count sentences (. ! ?)
    const sentences = content
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0).length;

    // Count paragraphs (separated by line breaks)
    const paragraphs = content
      .split(/\n\n+/)
      .filter(paragraph => paragraph.trim().length > 0).length;

    // Count characters
    const charactersWithSpaces = content.length;
    const charactersWithoutSpaces = content.replace(/\s/g, '').length;

    // Calculate reading time (average 200 words per minute)
    const totalSeconds = Math.ceil((words * 60) / 200);
    const readingTime = this.formatReadingTime(totalSeconds);

    this.stats.set({
      words,
      sentences,
      paragraphs,
      charactersWithSpaces,
      charactersWithoutSpaces,
      readingTime
    });
  }

  private formatReadingTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} m ${seconds} s`;
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
    this.onTextChange();
  }

  copyStats(): void {
    const statsText = `Character Counter Stats:
- Characters (with spaces): ${this.stats().charactersWithSpaces}
- Characters (without spaces): ${this.stats().charactersWithoutSpaces}
- Words: ${this.stats().words}
- Sentences: ${this.stats().sentences}
- Paragraphs: ${this.stats().paragraphs}
- Reading Time: ${this.stats().readingTime}`;

    navigator.clipboard.writeText(statsText).then(() => {
      alert('Stats copied to clipboard!');
    });
  }

  downloadStats(): void {
    const statsText = `Character Counter Report
Generated on: ${new Date().toLocaleString()}

STATISTICS:
- Characters (with spaces): ${this.stats().charactersWithSpaces}
- Characters (without spaces): ${this.stats().charactersWithoutSpaces}
- Words: ${this.stats().words}
- Sentences: ${this.stats().sentences}
- Paragraphs: ${this.stats().paragraphs}
- Reading Time: ${this.stats().readingTime}

TEXT CONTENT:
${this.text()}`;

    const blob = new Blob([statsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `character-counter-report-${new Date().getTime()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
