import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { FIND_REPLACE_RESOURCE_CONTENT } from './find-replace.resource-content';

interface RegexResult {
  regex: RegExp | null;
  error: string | null;
}

interface MatchRange {
  start: number;
  end: number;
}

type FindReplaceTab = 'find' | 'replace';

const MATCH_STYLE = 'background-color:#fef08a;border-radius:2px;';
const ACTIVE_MATCH_STYLE = 'background-color:#fdba74;border-radius:2px;';

@Component({
  selector: 'app-find-replace',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './find-replace.component.html',
  styleUrl: './find-replace.component.scss'
})
export class FindReplaceComponent implements OnInit {
  private seoService = inject(SeoService);

  @ViewChild('textArea') private textAreaRef?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('highlightLayer') private highlightLayerRef?: ElementRef<HTMLDivElement>;

  activeTab = signal<FindReplaceTab>('find');

  text = signal<string>('');
  findText = signal<string>('');
  replaceText = signal<string>('');

  matchCase = signal<boolean>(false);
  wholeWord = signal<boolean>(false);
  useRegex = signal<boolean>(false);

  copied = signal<boolean>(false);
  lastReplacedCount = signal<number | null>(null);

  /** Index into `allMatches()` of the currently highlighted/selected match, or -1 when none is active. */
  currentMatchIndex = signal<number>(-1);
  findMessage = signal<string | null>(null);

  resourceContent = FIND_REPLACE_RESOURCE_CONTENT;

  private readonly SAMPLE_TEXT = 'Optimize Assets and CSS: Inline Critical CSS: Remove global blocking stylesheets and inline only the necessary CSS needed to render the above-the-fold content in your <head>.\n\nUse NgOptimizedImage: Replace standard <img> tags with the built-in NgOptimizedImage directive. This automatically adds preconnect hints, applies lazy loading to below-the-fold images, and enforces image sizing to prevent layout shifts.';

  loadSample(): void {
    this.onTextInput(this.SAMPLE_TEXT);
    this.setFindText('inline');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** Builds a fresh search pattern (never reused across calls, since RegExp.exec mutates lastIndex). */
  private buildRegex(global: boolean): RegexResult {
    const find = this.findText();
    if (!find) return { regex: null, error: null };

    try {
      const base = this.useRegex() ? find : this.escapeRegExp(find);
      const pattern = this.wholeWord() ? `\\b${base}\\b` : base;
      const flags = (global ? 'g' : '') + (this.matchCase() ? '' : 'i');
      return { regex: new RegExp(pattern, flags), error: null };
    } catch {
      return { regex: null, error: 'Invalid regular expression pattern.' };
    }
  }

  regexError = computed<string | null>(() => this.buildRegex(true).error);

  /** All match ranges in `text()` for the current search, used for highlighting, the counter, and Previous/Next. */
  allMatches = computed<MatchRange[]>(() => {
    const { regex } = this.buildRegex(true);
    if (!regex) return [];

    const content = this.text();
    const matches: MatchRange[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      matches.push({ start, end });
      if (match[0].length === 0) regex.lastIndex++;
    }

    return matches;
  });

  matchCount = computed<number>(() => this.allMatches().length);

  currentMatchPosition = computed<number>(() => {
    const idx = this.currentMatchIndex();
    return idx >= 0 && idx < this.allMatches().length ? idx + 1 : 0;
  });

  /** HTML for the highlight overlay behind the (visually transparent) textarea: every match in yellow, the active one in orange. */
  highlightedHtml = computed<string>(() => {
    const content = this.text();
    const matches = this.allMatches();
    if (!content) return '';
    if (matches.length === 0) return this.escapeHtml(content);

    const activeIndex = this.currentMatchIndex();
    let html = '';
    let cursor = 0;

    matches.forEach((match, i) => {
      html += this.escapeHtml(content.slice(cursor, match.start));
      const style = i === activeIndex ? ACTIVE_MATCH_STYLE : MATCH_STYLE;
      html += `<mark style="${style}">${this.escapeHtml(content.slice(match.start, match.end))}</mark>`;
      cursor = match.end;
    });
    html += this.escapeHtml(content.slice(cursor));

    return html;
  });

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Find and Replace - Free Text Search & Replace Tool | DataUtil',
      description: 'Find and replace text instantly with support for match case, whole word, and regular expressions. Free and private, runs entirely in your browser.',
      keywords: 'find and replace, search and replace, text replace tool, regex replace, find text online',
      ogTitle: 'Find and Replace - Free Text Search & Replace Tool',
      ogDescription: 'Search and replace text with match case, whole word, and regex support.',
      canonicalUrl: 'https://www.data-util.com/categories/text/find-replace'
    });
  }

  setTab(tab: FindReplaceTab): void {
    this.activeTab.set(tab);
    this.findMessage.set(null);
  }

  onTextInput(value: string): void {
    this.text.set(value);
    this.resetSearchState();
  }

  onTextareaScroll(): void {
    const textarea = this.textAreaRef?.nativeElement;
    const layer = this.highlightLayerRef?.nativeElement;
    if (textarea && layer) {
      layer.scrollTop = textarea.scrollTop;
      layer.scrollLeft = textarea.scrollLeft;
    }
  }

  private resetSearchState(): void {
    this.currentMatchIndex.set(-1);
    this.findMessage.set(null);
    this.lastReplacedCount.set(null);
  }

  setFindText(value: string): void {
    this.findText.set(value);
    this.resetSearchState();
  }

  setReplaceText(value: string): void {
    this.replaceText.set(value);
  }

  setMatchCase(value: boolean): void {
    this.matchCase.set(value);
    this.resetSearchState();
  }

  setWholeWord(value: boolean): void {
    this.wholeWord.set(value);
    this.resetSearchState();
  }

  setUseRegex(value: boolean): void {
    this.useRegex.set(value);
    this.resetSearchState();
  }

  swapFindReplace(): void {
    const find = this.findText();
    const replace = this.replaceText();
    this.findText.set(replace);
    this.replaceText.set(find);
    this.resetSearchState();
  }

  private selectMatch(index: number, matches: MatchRange[], wrapped: 'end' | 'start' | null): void {
    this.currentMatchIndex.set(index);
    this.findMessage.set(
      wrapped === 'end' ? 'Reached the end — wrapped around to the start.' :
      wrapped === 'start' ? 'Reached the start — wrapped around to the end.' :
      null
    );

    const match = matches[index];
    const textarea = this.textAreaRef?.nativeElement;
    if (textarea && match) {
      textarea.focus();
      textarea.setSelectionRange(match.start, match.end);
      this.onTextareaScroll();
    }
  }

  findNext(): void {
    if (this.regexError()) {
      this.findMessage.set(this.regexError());
      return;
    }

    const matches = this.allMatches();
    if (matches.length === 0) {
      this.currentMatchIndex.set(-1);
      this.findMessage.set(this.findText() ? 'No matches found.' : null);
      return;
    }

    const current = this.currentMatchIndex();
    if (current === -1) {
      const textarea = this.textAreaRef?.nativeElement;
      const cursorPos = textarea ? textarea.selectionEnd : 0;
      const idx = matches.findIndex(m => m.start >= cursorPos);
      this.selectMatch(idx === -1 ? 0 : idx, matches, idx === -1 ? 'end' : null);
    } else if (current + 1 < matches.length) {
      this.selectMatch(current + 1, matches, null);
    } else {
      this.selectMatch(0, matches, 'end');
    }
  }

  findPrevious(): void {
    if (this.regexError()) {
      this.findMessage.set(this.regexError());
      return;
    }

    const matches = this.allMatches();
    if (matches.length === 0) {
      this.currentMatchIndex.set(-1);
      this.findMessage.set(this.findText() ? 'No matches found.' : null);
      return;
    }

    const current = this.currentMatchIndex();
    if (current === -1) {
      const textarea = this.textAreaRef?.nativeElement;
      const cursorPos = textarea ? textarea.selectionStart : matches[matches.length - 1].end;
      let idx = -1;
      for (let i = matches.length - 1; i >= 0; i--) {
        if (matches[i].end <= cursorPos) { idx = i; break; }
      }
      this.selectMatch(idx === -1 ? matches.length - 1 : idx, matches, idx === -1 ? 'start' : null);
    } else if (current - 1 >= 0) {
      this.selectMatch(current - 1, matches, null);
    } else {
      this.selectMatch(matches.length - 1, matches, 'start');
    }
  }

  /** Replaces the currently selected match, then advances to the next one; finds/selects first if nothing is active yet. */
  replaceOne(): void {
    if (this.regexError()) return;

    const matches = this.allMatches();
    const idx = this.currentMatchIndex();

    if (idx >= 0 && idx < matches.length) {
      const match = matches[idx];
      const content = this.text();
      const replacement = this.replaceText();
      const newContent = content.slice(0, match.start) + replacement + content.slice(match.end);

      this.text.set(newContent);
      this.lastReplacedCount.set((this.lastReplacedCount() ?? 0) + 1);
      this.currentMatchIndex.set(-1);

      const textarea = this.textAreaRef?.nativeElement;
      if (textarea) {
        const newPos = match.start + replacement.length;
        textarea.setSelectionRange(newPos, newPos);
      }

      this.findNext();
      return;
    }

    this.findNext();
  }

  replaceAll(): void {
    const { regex, error } = this.buildRegex(true);
    if (error || !regex) return;

    const count = this.matchCount();
    this.text.set(this.text().replace(regex, this.replaceText()));
    this.lastReplacedCount.set(count);
    this.currentMatchIndex.set(-1);
    this.findMessage.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.text.set(content);
        this.resetSearchState();
      };

      reader.readAsText(file);
    }
  }

  clearText(): void {
    this.text.set('');
    this.copied.set(false);
    this.resetSearchState();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.text()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  downloadText(): void {
    const blob = new Blob([this.text()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'replaced-text.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
