import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.scss'
})
export class JsonFormatterComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('inputEditorHost') inputEditorHost?: ElementRef<HTMLDivElement>;
  @ViewChild('outputEditorHost') outputEditorHost?: ElementRef<HTMLDivElement>;

  private inputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private outputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private isSettingInputEditor = false;
  private isSettingOutputEditor = false;

  inputText = signal<string>('');
  outputText = signal<string>('');
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);

  indentSize = signal<number>(2);
  sortKeys = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'JSON Formatter - Beautify and Validate JSON | DataUtil',
      description: 'Format, validate, and minify JSON instantly. Beautify JSON with custom indentation and copy or download the result.',
      keywords: 'json formatter, json beautifier, json validator, minify json, format json',
      ogTitle: 'JSON Formatter - Beautify and Validate JSON',
      ogDescription: 'Format and validate JSON instantly with custom indentation.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/json-formatter'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'JSON Formatter',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Format, validate, and minify JSON instantly with custom indentation.',
      'url': 'https://www.data-util.com/categories/developer/json-formatter',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.createEditors();
  }

  ngOnDestroy(): void {
    this.inputEditor?.dispose();
    this.outputEditor?.dispose();
  }

  onInputChange(): void {
    this.isValid.set(null);
    this.errorMessage.set('');
  }

  onOutputChange(value: string): void {
    this.setOutputValue(value);
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.inputText());
      const normalized = this.sortKeys() ? this.sortObjectKeys(parsed) : parsed;
      const formatted = JSON.stringify(normalized, null, this.indentSize());
      this.setOutputValue(formatted);
      this.isValid.set(true);
      this.errorMessage.set('Valid JSON');
    } catch (error) {
      this.setOutputValue(this.getDetailedErrorForOutput(error));
      this.isValid.set(false);
      this.errorMessage.set(this.getErrorMessage(error));
    }
  }

  minifyJson(): void {
    try {
      const parsed = JSON.parse(this.inputText());
      const normalized = this.sortKeys() ? this.sortObjectKeys(parsed) : parsed;
      this.setOutputValue(JSON.stringify(normalized));
      this.isValid.set(true);
      this.errorMessage.set('Valid JSON');
    } catch (error) {
      this.setOutputValue(this.getDetailedErrorForOutput(error));
      this.isValid.set(false);
      this.errorMessage.set(this.getErrorMessage(error));
    }
  }

  validateJson(): void {
    try {
      const parsed = JSON.parse(this.inputText());
      const normalized = this.sortKeys() ? this.sortObjectKeys(parsed) : parsed;
      const formatted = JSON.stringify(normalized, null, this.indentSize());
      this.setOutputValue(formatted);
      this.isValid.set(true);
      this.errorMessage.set('Valid JSON');
    } catch (error) {
      this.setOutputValue(this.getDetailedErrorForOutput(error));
      this.isValid.set(false);
      this.errorMessage.set(this.getErrorMessage(error));
    }
  }

  clearAll(): void {
    this.setInputValue('');
    this.setOutputValue('');
    this.isValid.set(null);
    this.errorMessage.set('');
  }

  copyOutput(): void {
    const content = this.outputText();
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  copyInput(): void {
    const content = this.inputText();
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  downloadOutput(): void {
    const content = this.outputText();
    if (!content) {
      return;
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'formatted.json';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  loadSample(): void {
    const sample = {
      name: 'DataUtil',
      type: 'utility-platform',
      features: ['json-formatter', 'pdf-tools', 'image-tools'],
      active: true,
      stats: {
        tools: 100,
        users: 12000
      }
    };

    this.setInputValue(JSON.stringify(sample));
    this.formatJson();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.setInputValue(content ?? '');
      this.isValid.set(null);
      this.errorMessage.set('');
    };
    reader.readAsText(file);
  }

  private sortObjectKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortObjectKeys(item));
    }

    if (value !== null && typeof value === 'object') {
      const sorted: Record<string, unknown> = {};
      Object.keys(value as Record<string, unknown>)
        .sort()
        .forEach((key) => {
          sorted[key] = this.sortObjectKeys((value as Record<string, unknown>)[key]);
        });
      return sorted;
    }

    return value;
  }

  private getErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
      return 'Invalid JSON input. Please check your syntax.';
    }

    const raw = error.message;
    const positionMatch = raw.match(/position\s+(\d+)/i);

    if (!positionMatch) {
      return `Invalid JSON: ${raw}`;
    }

    const position = Number(positionMatch[1]);
    const source = this.inputText();
    const prefix = source.slice(0, position);
    const line = prefix.split('\n').length;
    const lastNewline = prefix.lastIndexOf('\n');
    const column = position - lastNewline;
    const lineText = source.split('\n')[line - 1] ?? '';

    let hint = 'Check for missing commas, quotes, or extra characters near this location.';

    if (/unterminated string/i.test(raw)) {
      hint = 'A string is not closed. Add a closing double quote (").';
    } else if (/unexpected token/i.test(raw)) {
      hint = 'Unexpected character found. Check commas, brackets, and quotes near the marked area.';
    } else if (/expected/i.test(raw)) {
      hint = 'Something is missing. Most common issues are a missing comma, colon, or closing bracket.';
    }

    return `Invalid JSON at line ${line}, column ${column}. ${hint} Problem line: ${lineText.trim() || '(empty line)'}`;
  }

  private getDetailedErrorForOutput(error: unknown): string {
    if (!(error instanceof Error)) {
      return 'JSON Validation Error\n\nInvalid JSON input. Please check your syntax.';
    }

    const raw = error.message;
    const positionMatch = raw.match(/position\s+(\d+)/i);

    if (!positionMatch) {
      return `JSON Validation Error\n\n${raw}`;
    }

    const position = Number(positionMatch[1]);
    const source = this.inputText();
    const prefix = source.slice(0, position);
    const line = prefix.split('\n').length;
    const lastNewline = prefix.lastIndexOf('\n');
    const column = position - lastNewline;
    const lines = source.split('\n');
    const lineText = lines[line - 1] ?? '';

    let hint = 'Check for missing commas, quotes, colons, or extra characters near this location.';
    if (/unterminated string/i.test(raw)) {
      hint = 'A string is not closed. Add a closing double quote (").';
    } else if (/unexpected token/i.test(raw)) {
      hint = 'Unexpected character found. Check commas, brackets, and quotes near this point.';
    } else if (/expected/i.test(raw)) {
      hint = 'A symbol is missing. Usually this is a comma, colon, or closing bracket.';
    }

    return [
      'JSON Validation Error',
      '',
      `Line: ${line}`,
      `Column: ${column}`,
      '',
      `Problem line: ${lineText || '(empty line)'}`,
      '',
      `Details: ${raw}`,
      '',
      `Hint: ${hint}`
    ].join('\n');
  }

  private createEditors(): void {
    if (!this.inputEditorHost?.nativeElement || !this.outputEditorHost?.nativeElement) {
      return;
    }

    loader.init().then((monaco) => {
      this.inputEditor = monaco.editor.create(this.inputEditorHost!.nativeElement, {
        value: this.inputText(),
        language: 'json',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        folding: true,
        glyphMargin: false,
        scrollBeyondLastLine: false,
        tabSize: this.indentSize(),
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        links: false
      });

      this.outputEditor = monaco.editor.create(this.outputEditorHost!.nativeElement, {
        value: this.outputText(),
        language: 'json',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        folding: true,
        glyphMargin: false,
        scrollBeyondLastLine: false,
        tabSize: this.indentSize(),
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        links: false
      });

      this.inputEditor.onDidChangeModelContent(() => {
        if (this.isSettingInputEditor) {
          return;
        }
        this.inputText.set(this.inputEditor?.getValue() ?? '');
        this.onInputChange();
      });

      this.outputEditor.onDidChangeModelContent(() => {
        if (this.isSettingOutputEditor) {
          return;
        }
        this.outputText.set(this.outputEditor?.getValue() ?? '');
      });
    });
  }

  private setInputValue(value: string): void {
    this.inputText.set(value);
    if (this.inputEditor) {
      this.isSettingInputEditor = true;
      this.inputEditor.setValue(value);
      this.isSettingInputEditor = false;
    }
  }

  private setOutputValue(value: string): void {
    this.outputText.set(value);
    if (this.outputEditor) {
      this.isSettingOutputEditor = true;
      this.outputEditor.setValue(value);
      this.isSettingOutputEditor = false;
    }
  }
}
