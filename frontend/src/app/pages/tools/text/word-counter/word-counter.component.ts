import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { WORD_COUNTER_RESOURCE_CONTENT } from './word-counter.resource-content';

interface TextStats {
  words: number;
  uniqueWords: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
}

interface KeywordCount {
  word: string;
  count: number;
  percent: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'as', 'it', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'his', 'her', 'its', 'our', 'their'
]);

@Component({
  selector: 'app-word-counter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './word-counter.component.html',
  styleUrl: './word-counter.component.scss'
})
export class WordCounterComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  stats = signal<TextStats>({
    words: 0,
    uniqueWords: 0,
    charactersWithSpaces: 0,
    charactersWithoutSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: '0 m 0 s',
    speakingTime: '0 m 0 s'
  });
  keywords = signal<KeywordCount[]>([]);
  excludeStopWords = signal<boolean>(true);

  resourceContent = WORD_COUNTER_RESOURCE_CONTENT;

  private readonly SAMPLE_TEXT = 'Content marketing is the art of communicating with your customers and prospects without selling. Instead of pitching your products or services, you are delivering information that makes your buyer more intelligent. The essence of this content marketing philosophy is the belief that if we, as businesses, deliver consistent, ongoing valuable information to buyers, they ultimately reward us with their business and loyalty.';

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Word Counter - Free Online Word & Character Count Tool | DataUtil',
      description: 'Count words, characters, sentences, and paragraphs instantly. See reading time, speaking time, and keyword density. Upload text files or paste content — free and private.',
      keywords: 'word counter, word count, count words online, character counter, keyword density, reading time calculator',
      ogTitle: 'Word Counter - Free Online Word Count Tool',
      ogDescription: 'Instantly count words, characters, sentences, paragraphs, and see keyword density.',
      canonicalUrl: 'https://www.data-util.com/categories/text/word-counter'
    });
  }

  onTextChange(): void {
    this.updateStats();
  }

  private updateStats(): void {
    const content = this.text();
    const trimmed = content.trim();

    const wordList = trimmed ? trimmed.split(/\s+/) : [];
    const words = wordList.length;

    const normalizedWords = wordList
      .map(w => w.toLowerCase().replace(/[^a-z0-9']/g, ''))
      .filter(w => w.length > 0);
    const uniqueWords = new Set(normalizedWords).size;

    const sentences = content
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0).length;

    const paragraphs = content
      .split(/\n\n+/)
      .filter(p => p.trim().length > 0).length;

    const charactersWithSpaces = content.length;
    const charactersWithoutSpaces = content.replace(/\s/g, '').length;

    const readingTime = this.formatDuration(Math.ceil((words * 60) / 200));
    const speakingTime = this.formatDuration(Math.ceil((words * 60) / 130));

    this.stats.set({
      words,
      uniqueWords,
      charactersWithSpaces,
      charactersWithoutSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    });

    this.updateKeywordDensity(normalizedWords);
  }

  private updateKeywordDensity(normalizedWords: string[]): void {
    const excludeStop = this.excludeStopWords();
    const counts = new Map<string, number>();

    for (const word of normalizedWords) {
      if (excludeStop && STOP_WORDS.has(word)) continue;
      if (word.length < 2) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    const total = normalizedWords.length || 1;
    const top = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count, percent: Math.round((count / total) * 1000) / 10 }));

    this.keywords.set(top);
  }

  toggleExcludeStopWords(): void {
    this.excludeStopWords.set(!this.excludeStopWords());
    this.updateStats();
  }

  private formatDuration(totalSeconds: number): string {
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

  loadSample(): void {
    this.text.set(this.SAMPLE_TEXT);
    this.onTextChange();
  }

  clearText(): void {
    this.text.set('');
    this.onTextChange();
  }

  copyStats(): void {
    const s = this.stats();
    const statsText = `Word Counter Stats:
- Words: ${s.words}
- Unique words: ${s.uniqueWords}
- Characters (with spaces): ${s.charactersWithSpaces}
- Characters (without spaces): ${s.charactersWithoutSpaces}
- Sentences: ${s.sentences}
- Paragraphs: ${s.paragraphs}
- Reading time: ${s.readingTime}
- Speaking time: ${s.speakingTime}`;

    navigator.clipboard.writeText(statsText).then(() => {
      alert('Stats copied to clipboard!');
    });
  }

  downloadStats(): void {
    const s = this.stats();
    const keywordLines = this.keywords()
      .map(k => `  ${k.word} — ${k.count} (${k.percent}%)`)
      .join('\n');

    const statsText = `Word Counter Report
Generated on: ${new Date().toLocaleString()}

STATISTICS:
- Words: ${s.words}
- Unique words: ${s.uniqueWords}
- Characters (with spaces): ${s.charactersWithSpaces}
- Characters (without spaces): ${s.charactersWithoutSpaces}
- Sentences: ${s.sentences}
- Paragraphs: ${s.paragraphs}
- Reading time: ${s.readingTime}
- Speaking time: ${s.speakingTime}

TOP KEYWORDS:
${keywordLines || '  (none)'}

TEXT CONTENT:
${this.text()}`;

    const blob = new Blob([statsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `word-counter-report-${new Date().getTime()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
