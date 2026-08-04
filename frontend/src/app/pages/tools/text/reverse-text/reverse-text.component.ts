import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { REVERSE_TEXT_RESOURCE_CONTENT } from './reverse-text.resource-content';

type ReverseMode = 'text' | 'words' | 'paragraphs';

const MODE_LABELS: Record<ReverseMode, string> = {
  text: 'Reverse Text',
  words: 'Reverse Words',
  paragraphs: 'Reverse Paragraphs'
};

@Component({
  selector: 'app-reverse-text',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './reverse-text.component.html',
  styleUrl: './reverse-text.component.scss'
})
export class ReverseTextComponent implements OnInit {
  private seoService = inject(SeoService);

  /** Text currently shown in the textarea — either raw input or, after applying a mode, the reversed result. */
  text = signal<string>('');
  /** Snapshot of `text` taken right before the active mode was applied, so "Reset" can restore it. Null when nothing is applied. */
  private preOriginalText = signal<string | null>(null);
  /** Which mode (if any) is currently reflected in `text`. */
  activeMode = signal<ReverseMode | null>(null);

  copied = signal<boolean>(false);
  previewMode = signal<ReverseMode | null>(null);

  resourceContent = REVERSE_TEXT_RESOURCE_CONTENT;

  private readonly SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog.\n\nThis is a second paragraph for testing paragraph reversal.';

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Reverse Text - Free Text Reverser Tool | DataUtil',
      description: 'Reverse text, words, or paragraphs instantly. Preview each mode before applying, then reset back to your original text any time.',
      keywords: 'reverse text, reverse words, reverse paragraphs, text reverser, backwards text',
      ogTitle: 'Reverse Text - Free Text Reverser Tool',
      ogDescription: 'Reverse text, words, or paragraphs instantly with multiple reverse modes.',
      canonicalUrl: 'https://www.data-util.com/categories/text/reverse-text'
    });
  }

  onTextInput(value: string): void {
    // A direct edit invalidates any applied mode — the box is raw/user-owned again.
    this.text.set(value);
    this.activeMode.set(null);
    this.preOriginalText.set(null);
  }

  loadSample(): void {
    this.onTextInput(this.SAMPLE_TEXT);
  }

  private transform(content: string, mode: ReverseMode): string {
    switch (mode) {
      case 'words':
        return content
          .split(/\s+/)
          .filter(word => word.length > 0)
          .reverse()
          .join(' ');
      case 'paragraphs':
        return content
          .split('\n\n')
          .filter(para => para.trim().length > 0)
          .reverse()
          .join('\n\n');
      default:
        return content.split('').reverse().join('');
    }
  }

  setMode(mode: ReverseMode): void {
    // Always transform from the true pre-reverse baseline, not from an already-reversed result,
    // so switching between modes never compounds a previous transform.
    const baseline = this.preOriginalText() ?? this.text();
    this.preOriginalText.set(baseline);
    this.text.set(this.transform(baseline, mode));
    this.activeMode.set(mode);
  }

  resetToOriginal(): void {
    const original = this.preOriginalText();
    if (original === null) return;
    this.text.set(original);
    this.activeMode.set(null);
    this.preOriginalText.set(null);
  }

  openPreview(mode: ReverseMode): void {
    this.previewMode.set(mode);
  }

  closePreview(): void {
    this.previewMode.set(null);
  }

  getPreviewText(): string {
    const mode = this.previewMode();
    if (!mode) return '';
    const baseline = this.preOriginalText() ?? this.text();
    return this.transform(baseline, mode);
  }

  getPreviewTitle(): string {
    const mode = this.previewMode();
    return mode ? `Preview: ${MODE_LABELS[mode]}` : '';
  }

  applyPreviewedMode(): void {
    const mode = this.previewMode();
    if (mode) this.setMode(mode);
    this.closePreview();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.text.set(content);
        this.activeMode.set(null);
        this.preOriginalText.set(null);
      };

      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.text.set('');
    this.activeMode.set(null);
    this.preOriginalText.set(null);
    this.copied.set(false);
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.text()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  downloadReversed(): void {
    const mode = this.activeMode() ?? 'text';
    const fileName = `reversed-${mode}.txt`;

    const element = document.createElement('a');
    const file = new Blob([this.text()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  }
}
