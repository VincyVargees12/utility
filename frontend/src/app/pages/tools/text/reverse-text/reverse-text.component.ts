import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

interface ReverseResult {
  text: string;
  words: string;
  paragraphs: string;
}

@Component({
  selector: 'app-reverse-text',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './reverse-text.component.html',
  styleUrl: './reverse-text.component.scss'
})
export class ReverseTextComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  results = signal<ReverseResult>({
    text: '',
    words: '',
    paragraphs: ''
  });
  copiedMode = signal<string | null>(null);
  reverseMode = signal<'text' | 'words' | 'paragraphs'>('text');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Reverse Text - Free Text Reverser Tool | DataUtil',
      description: 'Reverse text, words, or paragraphs instantly. Multiple reverse modes for different text manipulation needs.',
      keywords: 'reverse text, reverse words, reverse paragraphs, text reverser, backwards text',
      ogTitle: 'Reverse Text - Free Text Reverser Tool',
      ogDescription: 'Reverse text, words, or paragraphs instantly with multiple reverse modes.',
      canonicalUrl: 'https://datautility.com/categories/text/reverse-text'
    });
  }

  onTextChange(): void {
    this.updateResults();
  }

  private updateResults(): void {
    const content = this.text();

    this.results.set({
      text: this.reverseFullText(content),
      words: this.reverseWordsOrder(content),
      paragraphs: this.reverseParagraphsOrder(content)
    });
  }

  private reverseFullText(str: string): string {
    return str.split('').reverse().join('');
  }

  private reverseWordsOrder(str: string): string {
    return str
      .split(/\s+/)
      .filter(word => word.length > 0)
      .reverse()
      .join(' ');
  }

  private reverseParagraphsOrder(str: string): string {
    return str
      .split('\n\n')
      .filter(para => para.trim().length > 0)
      .reverse()
      .join('\n\n');
  }

  setReverseMode(mode: 'text' | 'words' | 'paragraphs'): void {
    this.reverseMode.set(mode);
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
    this.copiedMode.set(null);
  }

  copyToClipboard(mode: 'text' | 'words' | 'paragraphs'): void {
    const textToCopy = this.results()[mode];
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copiedMode.set(mode);
      setTimeout(() => this.copiedMode.set(null), 2000);
    });
  }

  downloadReversed(): void {
    const currentMode = this.reverseMode();
    const textToDownload = this.results()[currentMode];
    const fileName = `reversed-${currentMode}.txt`;

    const element = document.createElement('a');
    const file = new Blob([textToDownload], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  }
}
