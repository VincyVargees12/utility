import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  total: number;
}

const LANGUAGE_MAP: Record<string, string> = {
  txt: 'plaintext',
  json: 'json',
  xml: 'xml',
  html: 'html',
  css: 'css',
  js: 'javascript',
  ts: 'typescript',
  sql: 'sql',
  csv: 'plaintext',
  log: 'plaintext',
  md: 'markdown',
};

@Component({
  selector: 'app-text-difference',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './text-difference.component.html',
  styleUrl: './text-difference.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextDifferenceComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('diffEditorHost') diffEditorHost?: ElementRef<HTMLDivElement>;

  private monacoRef?: typeof Monaco;
  private diffEditor?: Monaco.editor.IStandaloneDiffEditor;
  private originalModel?: Monaco.editor.ITextModel;
  private modifiedModel?: Monaco.editor.ITextModel;
  // Navigation uses Monaco built-in editor actions

  private destroy$ = new Subject<void>();
  private contentChange$ = new Subject<void>();
  private isSettingOriginal = false;
  private isSettingModified = false;

  // Text state
  originalText = signal<string>('');
  modifiedText = signal<string>('');
  originalFileName = signal<string>('');
  modifiedFileName = signal<string>('');
  originalLanguage = signal<string>('plaintext');
  modifiedLanguage = signal<string>('plaintext');

  // Options
  ignoreWhitespace = signal<boolean>(false);
  ignoreCase = signal<boolean>(false);
  ignoreEmptyLines = signal<boolean>(false);
  renderSideBySide = signal<boolean>(true);
  hideUnchanged = signal<boolean>(false);

  // Stats & navigation
  stats = signal<DiffStats>({ added: 0, removed: 0, modified: 0, total: 0 });
  hasCompared = signal<boolean>(false);
  totalDiffSections = signal<number>(0);

  // UI state
  isDraggingLeft = signal<boolean>(false);
  isDraggingRight = signal<boolean>(false);
  copiedLeft = signal<boolean>(false);
  copiedRight = signal<boolean>(false);

  readonly availableLanguages = [
    'plaintext', 'json', 'xml', 'html', 'css',
    'javascript', 'typescript', 'sql', 'markdown'
  ];

  readonly acceptExtensions = '.' + Object.keys(LANGUAGE_MAP).join(',.');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Text Difference - Professional Text Comparison Tool | DataUtil',
      description: 'Compare two text files or snippets side by side. Highlights all additions, deletions, and modifications. Supports JSON, XML, HTML, JS, TS and more.',
      keywords: 'text diff, text compare, file compare, diff checker, code compare, json diff',
      ogTitle: 'Text Difference - Professional Text Comparison Tool',
      ogDescription: 'Compare two text files side by side with professional diff highlighting.',
      canonicalUrl: 'https://www.data-util.com/categories/text/text-difference'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Text Difference Checker',
      'applicationCategory': 'UtilitiesApplication',
      'description': 'Professional text comparison tool with side-by-side diff highlighting.',
      'url': 'https://www.data-util.com/categories/text/text-difference',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });

    this.contentChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.refreshDiffOptions());
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initMonaco();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.originalModel?.dispose();
    this.modifiedModel?.dispose();
    this.diffEditor?.dispose();
  }

  // ── Monaco init ───────────────────────────────────────────────

  private async initMonaco(): Promise<void> {
    this.monacoRef = await loader.init();
    this.buildDiffEditor();
  }

  private buildDiffEditor(): void {
    if (!this.diffEditorHost?.nativeElement || !this.monacoRef) return;

    this.diffEditor = this.monacoRef.editor.createDiffEditor(
      this.diffEditorHost.nativeElement,
      {
        theme: 'vs',
        renderSideBySide: this.renderSideBySide(),
        ignoreTrimWhitespace: this.ignoreWhitespace(),
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        lineNumbers: 'on',
        folding: true,
        renderIndicators: true,
        enableSplitViewResizing: true,
        diffAlgorithm: 'legacy',
        originalEditable: true,
        hideUnchangedRegions: {
          enabled: this.hideUnchanged(),
          minimumLineCount: 3,
          contextLineCount: 3
        }
      }
    );

    this.originalModel = this.monacoRef.editor.createModel(
      this.originalText(),
      this.originalLanguage()
    );

    this.modifiedModel = this.monacoRef.editor.createModel(
      this.modifiedText(),
      this.modifiedLanguage()
    );

    this.diffEditor.setModel({
      original: this.originalModel,
      modified: this.modifiedModel
    });

    this.originalModel.onDidChangeContent(() => {
      if (this.isSettingOriginal) return;
      this.originalText.set(this.originalModel?.getValue() ?? '');
      this.contentChange$.next();
    });

    this.modifiedModel.onDidChangeContent(() => {
      if (this.isSettingModified) return;
      this.modifiedText.set(this.modifiedModel?.getValue() ?? '');
      this.contentChange$.next();
    });

    this.diffEditor.onDidUpdateDiff(() => {
      this.refreshStats();
    });
  }

  // ── Comparison ────────────────────────────────────────────────

  /**
   * Called only from the debounced content-change path.
   * NEVER modifies model content — only updates Monaco diff options.
   * This prevents cursor corruption and garbled text during live typing.
   */
  private refreshDiffOptions(): void {
    if (!this.diffEditor) return;
    this.diffEditor.updateOptions({
      ignoreTrimWhitespace: this.ignoreWhitespace(),
      renderSideBySide: this.renderSideBySide(),
      hideUnchangedRegions: {
        enabled: this.hideUnchanged(),
        minimumLineCount: 3,
        contextLineCount: 3
      }
    });
    this.hasCompared.set(true);
  }

  private refreshStats(): void {
    const changes = this.diffEditor?.getLineChanges();
    if (!changes) {
      this.stats.set({ added: 0, removed: 0, modified: 0, total: 0 });
      this.totalDiffSections.set(0);
      return;
    }

    let added = 0;
    let removed = 0;
    let modified = 0;

    for (const c of changes) {
      const isInsert = c.originalEndLineNumber === 0;
      const isDelete = c.modifiedEndLineNumber === 0;

      if (isInsert) {
        added += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1;
      } else if (isDelete) {
        removed += c.originalEndLineNumber - c.originalStartLineNumber + 1;
      } else {
        modified += c.originalEndLineNumber - c.originalStartLineNumber + 1;
      }
    }

    this.stats.set({ added, removed, modified, total: added + removed + modified });
    this.totalDiffSections.set(changes.length);
    this.hasCompared.set(true);
  }

  // ── Public actions ────────────────────────────────────────────

  /**
   * Explicit Compare click: the only place that preprocesses text
   * (ignoreCase, ignoreEmptyLines) and writes transformed values to models.
   * Not called during live typing, so no cursor corruption can occur.
   */
  compare(): void {
    if (!this.diffEditor || !this.originalModel || !this.modifiedModel || !this.monacoRef) return;

    let orig = this.originalText();
    let mod = this.modifiedText();

    if (this.ignoreCase()) {
      orig = orig.toLowerCase();
      mod = mod.toLowerCase();
    }

    if (this.ignoreEmptyLines()) {
      orig = orig.split('\n').filter(l => l.trim()).join('\n');
      mod = mod.split('\n').filter(l => l.trim()).join('\n');
    }

    // Only push to models when a transform was requested
    if (this.ignoreCase() || this.ignoreEmptyLines()) {
      this.isSettingOriginal = true;
      this.originalModel.setValue(orig);
      this.isSettingOriginal = false;

      this.isSettingModified = true;
      this.modifiedModel.setValue(mod);
      this.isSettingModified = false;
    }

    this.refreshDiffOptions();
  }

  clearAll(): void {
    this.setOriginalValue('', 'plaintext');
    this.setModifiedValue('', 'plaintext');
    this.originalFileName.set('');
    this.modifiedFileName.set('');
    this.stats.set({ added: 0, removed: 0, modified: 0, total: 0 });
    this.totalDiffSections.set(0);
    this.hasCompared.set(false);
  }

  swapTexts(): void {
    const origText = this.originalText();
    const modText = this.modifiedText();
    const origLang = this.originalLanguage();
    const modLang = this.modifiedLanguage();
    const origFile = this.originalFileName();
    const modFile = this.modifiedFileName();

    this.originalFileName.set(modFile);
    this.modifiedFileName.set(origFile);
    this.setOriginalValue(modText, modLang);
    this.setModifiedValue(origText, origLang);
    this.contentChange$.next();
  }

  copyLeft(): void {
    navigator.clipboard.writeText(this.originalText()).then(() => {
      this.copiedLeft.set(true);
      setTimeout(() => this.copiedLeft.set(false), 1500);
    });
  }

  copyRight(): void {
    navigator.clipboard.writeText(this.modifiedText()).then(() => {
      this.copiedRight.set(true);
      setTimeout(() => this.copiedRight.set(false), 1500);
    });
  }

  downloadLeft(): void {
    this.saveFile(this.originalText(), this.originalFileName() || 'original.txt');
  }

  downloadRight(): void {
    this.saveFile(this.modifiedText(), this.modifiedFileName() || 'modified.txt');
  }

  clearLeft(): void {
    this.setOriginalValue('', this.originalLanguage());
    this.originalFileName.set('');
    this.contentChange$.next();
  }

  clearRight(): void {
    this.setModifiedValue('', this.modifiedLanguage());
    this.modifiedFileName.set('');
    this.contentChange$.next();
  }

  previousDiff(): void {
    this.diffEditor?.getModifiedEditor().trigger('keyboard', 'editor.action.diffReview.prev', null);
  }

  nextDiff(): void {
    this.diffEditor?.getModifiedEditor().trigger('keyboard', 'editor.action.diffReview.next', null);
  }

  setViewMode(mode: 'side' | 'inline'): void {
    const sbs = mode === 'side';
    this.renderSideBySide.set(sbs);
    this.diffEditor?.updateOptions({ renderSideBySide: sbs });
  }

  toggleHideUnchanged(): void {
    this.hideUnchanged.set(!this.hideUnchanged());
    this.diffEditor?.updateOptions({
      hideUnchangedRegions: {
        enabled: this.hideUnchanged(),
        minimumLineCount: 3,
        contextLineCount: 3
      }
    });
  }

  toggleIgnoreWhitespace(): void {
    this.ignoreWhitespace.set(!this.ignoreWhitespace());
    // ignoreTrimWhitespace is a native Monaco option — apply immediately
    this.diffEditor?.updateOptions({ ignoreTrimWhitespace: this.ignoreWhitespace() });
  }

  toggleIgnoreCase(): void {
    this.ignoreCase.set(!this.ignoreCase());
    // Requires model preprocessing — only applied on explicit Compare click
  }

  toggleIgnoreEmptyLines(): void {
    this.ignoreEmptyLines.set(!this.ignoreEmptyLines());
    // Requires model preprocessing — only applied on explicit Compare click
  }

  onLanguageChange(side: 'original' | 'modified', lang: string): void {
    if (side === 'original') {
      this.originalLanguage.set(lang);
    } else {
      this.modifiedLanguage.set(lang);
    }
    if (this.monacoRef) {
      const model = side === 'original' ? this.originalModel : this.modifiedModel;
      if (model) {
        this.monacoRef.editor.setModelLanguage(model, lang);
      }
    }
  }

  // ── File upload / drag-drop ───────────────────────────────────

  onFileSelected(event: Event, side: 'original' | 'modified'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.readFile(file, side);
    input.value = '';
  }

  onDragOver(event: DragEvent, side: 'original' | 'modified'): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    if (side === 'original') this.isDraggingLeft.set(true);
    else this.isDraggingRight.set(true);
  }

  onDragLeave(side: 'original' | 'modified'): void {
    if (side === 'original') this.isDraggingLeft.set(false);
    else this.isDraggingRight.set(false);
  }

  onDrop(event: DragEvent, side: 'original' | 'modified'): void {
    event.preventDefault();
    if (side === 'original') this.isDraggingLeft.set(false);
    else this.isDraggingRight.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readFile(file, side);
  }

  private readFile(file: File, side: 'original' | 'modified'): void {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const lang = LANGUAGE_MAP[ext] ?? 'plaintext';
    const reader = new FileReader();
    reader.onload = e => {
      const content = (e.target?.result as string) ?? '';
      if (side === 'original') {
        this.originalFileName.set(file.name);
        this.setOriginalValue(content, lang);
      } else {
        this.modifiedFileName.set(file.name);
        this.setModifiedValue(content, lang);
      }
      this.contentChange$.next();
    };
    reader.readAsText(file);
  }

  // ── Keyboard shortcuts ────────────────────────────────────────

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    // Skip shortcuts when typing inside Monaco (Monaco handles Ctrl+F internally)
    if (target.closest('.monaco-editor')) return;

    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      event.preventDefault();
      this.compare();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  private setOriginalValue(value: string, lang?: string): void {
    this.originalText.set(value);
    if (this.originalModel) {
      this.isSettingOriginal = true;
      this.originalModel.setValue(value);
      this.isSettingOriginal = false;
    }
    if (lang) {
      this.originalLanguage.set(lang);
      if (this.monacoRef && this.originalModel) {
        this.monacoRef.editor.setModelLanguage(this.originalModel, lang);
      }
    }
  }

  private setModifiedValue(value: string, lang?: string): void {
    this.modifiedText.set(value);
    if (this.modifiedModel) {
      this.isSettingModified = true;
      this.modifiedModel.setValue(value);
      this.isSettingModified = false;
    }
    if (lang) {
      this.modifiedLanguage.set(lang);
      if (this.monacoRef && this.modifiedModel) {
        this.monacoRef.editor.setModelLanguage(this.modifiedModel, lang);
      }
    }
  }

  private saveFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
