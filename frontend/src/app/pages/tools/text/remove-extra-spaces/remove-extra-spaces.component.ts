import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { REMOVE_EXTRA_SPACES_RESOURCE_CONTENT } from './remove-extra-spaces.resource-content';

type RemovalMode = 'all' | 'single' | 'blank';

interface CleanupStats {
  originalCharacters: number;
  cleanedCharacters: number;
  charactersRemoved: number;
  originalLines: number;
  cleanedLines: number;
  linesRemoved: number;
}

const MODE_LABELS: Record<RemovalMode, string> = {
  all: 'Remove All',
  single: 'Single Spaces',
  blank: 'Remove Blank Lines'
};

@Component({
  selector: 'app-remove-extra-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './remove-extra-spaces.component.html',
  styleUrl: './remove-extra-spaces.component.scss'
})
export class RemoveExtraSpacesComponent implements OnInit {
  private seoService = inject(SeoService);

  /** Text currently shown in the textarea — either raw input or, after applying a mode, the cleaned result. */
  text = signal<string>('');
  /** Snapshot of `text` taken right before the active mode was applied, so "Reset" can restore it. Null when nothing is applied. */
  private preCleanText = signal<string | null>(null);
  /** Which mode (if any) is currently reflected in `text`. */
  activeMode = signal<RemovalMode | null>(null);

  copied = signal<boolean>(false);
  previewMode = signal<RemovalMode | null>(null);

  stats = computed<CleanupStats>(() => {
    const original = this.preCleanText() ?? this.text();
    const cleaned = this.text();
    const originalLines = original ? original.split('\n').length : 0;
    const cleanedLines = cleaned ? cleaned.split('\n').length : 0;

    return {
      originalCharacters: original.length,
      cleanedCharacters: cleaned.length,
      charactersRemoved: Math.max(0, original.length - cleaned.length),
      originalLines,
      cleanedLines,
      linesRemoved: Math.max(0, originalLines - cleanedLines)
    };
  });

  resourceContent = REMOVE_EXTRA_SPACES_RESOURCE_CONTENT;

  private readonly SAMPLE_TEXT = '  Hello   world!  \n\n\n   This  is    a   test   with     extra   spaces.   \n\n\nAnd   some   more   text   here.  ';

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Remove Extra Spaces - Free Whitespace Cleaner | DataUtil',
      description: 'Remove extra spaces, tabs, and blank lines from your text instantly. Three cleanup modes with instant preview, and statistics. Free and private.',
      keywords: 'remove extra spaces, remove whitespace, collapse spaces, remove blank lines, trim text, whitespace cleaner',
      ogTitle: 'Remove Extra Spaces - Free Whitespace Cleaner',
      ogDescription: 'Clean up messy text by collapsing repeated spaces and removing blank lines.',
      canonicalUrl: 'https://www.data-util.com/categories/text/remove-extra-spaces'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Remove Extra Spaces',
      'applicationCategory': 'UtilitiesApplication',
      'description': 'Collapse repeated spaces, trim whitespace, and remove blank lines from text.',
      'url': 'https://www.data-util.com/categories/text/remove-extra-spaces',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  onTextInput(value: string): void {
    // A direct edit invalidates any applied mode — the box is raw/user-owned again.
    this.text.set(value);
    this.activeMode.set(null);
    this.preCleanText.set(null);
  }

  loadSample(): void {
    this.onTextInput(this.SAMPLE_TEXT);
  }

  private collapseSpaces(line: string): string {
    return line.trim().replace(/[ \t]+/g, ' ');
  }

  private transform(content: string, mode: RemovalMode): string {
    switch (mode) {
      case 'single':
        return content
          .split('\n')
          .map(line => this.collapseSpaces(line))
          .join('\n');
      case 'blank':
        return content
          .split('\n')
          .filter(line => line.trim().length > 0)
          .join('\n');
      default:
        return content
          .split('\n')
          .map(line => this.collapseSpaces(line))
          .filter(line => line.length > 0)
          .join('\n');
    }
  }

  setMode(mode: RemovalMode): void {
    // Always transform from the true pre-clean baseline, not from an already-cleaned result,
    // so switching between modes never compounds a previous transform.
    const baseline = this.preCleanText() ?? this.text();
    this.preCleanText.set(baseline);
    this.text.set(this.transform(baseline, mode));
    this.activeMode.set(mode);
  }

  resetToOriginal(): void {
    const original = this.preCleanText();
    if (original === null) return;
    this.text.set(original);
    this.activeMode.set(null);
    this.preCleanText.set(null);
  }

  openPreview(mode: RemovalMode): void {
    this.previewMode.set(mode);
  }

  closePreview(): void {
    this.previewMode.set(null);
  }

  getPreviewText(): string {
    const mode = this.previewMode();
    if (!mode) return '';
    const baseline = this.preCleanText() ?? this.text();
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
        this.preCleanText.set(null);
      };

      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.text.set('');
    this.activeMode.set(null);
    this.preCleanText.set(null);
    this.copied.set(false);
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.text()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  downloadCleaned(): void {
    const blob = new Blob([this.text()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned-text.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
