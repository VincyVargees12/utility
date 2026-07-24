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
  selector: 'app-word-counter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent],
  templateUrl: './word-counter.component.html',
  styleUrl: './word-counter.component.scss'
})
export class WordCounterComponent implements OnInit {
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
      title: 'Word Counter - Free Text & Document Analyzer | DataUtil',
      description: 'Count words, characters, sentences, paragraphs, and reading time instantly. Upload text files or paste content. Completely free and private.',
      keywords: 'word counter, character counter, text analyzer, word count, sentence counter',
      ogTitle: 'Word Counter - Free Text Analyzer',
      ogDescription: 'Instantly count words, characters, sentences, paragraphs, and calculate reading time.',
      canonicalUrl: 'https://datautility.com/categories/text/word-counter'
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

      // Support text files
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          this.text.set(content);
          this.updateStats();
        };
        reader.readAsText(file);
      }
      // Support markdown files
      else if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          this.text.set(content);
          this.updateStats();
        };
        reader.readAsText(file);
      } else {
        alert('Supported file types: .txt, .md');
      }
    }
  }

  clearText(): void {
    this.text.set('');
    this.updateStats();
  }

  copyStats(): void {
    const statsText = `Word Count Statistics:
Words: ${this.stats().words}
Sentences: ${this.stats().sentences}
Paragraphs: ${this.stats().paragraphs}
Reading Time: ${this.stats().readingTime}
Characters (with spaces): ${this.stats().charactersWithSpaces}
Characters (without spaces): ${this.stats().charactersWithoutSpaces}`;

    navigator.clipboard.writeText(statsText).then(() => {
      alert('Statistics copied to clipboard!');
    });
  }

  downloadStats(): void {
    const statsText = `Word Count Statistics
Generated on: ${new Date().toLocaleString()}

${this.stats().words} words
${this.stats().sentences} sentences
${this.stats().paragraphs} paragraphs
${this.stats().readingTime} reading time
${this.stats().charactersWithSpaces} characters (with spaces)
${this.stats().charactersWithoutSpaces} characters (without spaces)

---CONTENT---
${this.text()}`;

    const blob = new Blob([statsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `word-count-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
