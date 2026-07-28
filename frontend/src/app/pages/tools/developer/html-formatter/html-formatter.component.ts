import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';
import { HTML_FORMATTER_RESOURCE_CONTENT } from './html-formatter.resource-content';

@Component({
  selector: 'app-html-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './html-formatter.component.html',
  styleUrl: './html-formatter.component.scss'
})
export class HtmlFormatterComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('inputEditorHost') inputEditorHost?: ElementRef<HTMLDivElement>;
  @ViewChild('outputEditorHost') outputEditorHost?: ElementRef<HTMLDivElement>;

  private inputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private outputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private isSettingInput = false;
  private isSettingOutput = false;
  private beautifyHtml?: (html: string, options: object) => string;

  inputText = signal<string>('');
  outputText = signal<string>('');
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);
  indentSize = signal<number>(2);

  resourceContent = HTML_FORMATTER_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'HTML Formatter - Beautify and Minify HTML | DataUtil',
      description: 'Format, beautify, and minify HTML instantly. Beautify HTML with custom indentation and copy or download the result.',
      keywords: 'html formatter, html beautifier, html minifier, format html, minify html, html pretty print',
      ogTitle: 'HTML Formatter - Beautify and Minify HTML',
      ogDescription: 'Format and beautify HTML instantly with custom indentation.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/html-formatter'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'HTML Formatter',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Format, beautify, and minify HTML documents with custom indentation.',
      'url': 'https://www.data-util.com/categories/developer/html-formatter',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.createEditors();
  }

  ngOnDestroy(): void {
    this.inputEditor?.dispose();
    this.outputEditor?.dispose();
  }

  // ── Editor setup ──────────────────────────────────────────────

  private async loadBeautifyHtml(): Promise<(html: string, options: object) => string> {
    if (this.beautifyHtml) {
      return this.beautifyHtml;
    }
    const module = await import('js-beautify');
    this.beautifyHtml = module.html;
    return this.beautifyHtml;
  }

  private createEditors(): void {
    loader.init().then((monaco) => {
      this.inputEditor = monaco.editor.create(this.inputEditorHost!.nativeElement, {
        value: '',
        language: 'html',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        folding: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        links: false
      });

      this.outputEditor = monaco.editor.create(this.outputEditorHost!.nativeElement, {
        value: '',
        language: 'html',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        folding: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        readOnly: true,
        links: false
      });

      this.inputEditor?.onDidChangeModelContent(() => {
        if (this.isSettingInput) return;
        const value = this.inputEditor?.getValue() ?? '';
        this.inputText.set(value);
      });

      this.outputEditor?.onDidChangeModelContent(() => {
        if (this.isSettingOutput) return;
        const value = this.outputEditor?.getValue() ?? '';
        this.outputText.set(value);
      });
    });
  }

  private setInputValue(value: string): void {
    this.isSettingInput = true;
    this.inputEditor?.setValue(value);
    this.inputText.set(value);
    this.isSettingInput = false;
  }

  private setOutputValue(value: string): void {
    this.isSettingOutput = true;
    this.outputEditor?.setValue(value);
    this.outputText.set(value);
    this.isSettingOutput = false;
  }

  // ── Actions ──────────────────────────────────────────────

  async formatHtml(): Promise<void> {
    const input = this.inputText().trim();
    if (!input) return;

    try {
      const beautifyFn = await this.loadBeautifyHtml();
      const formatted = beautifyFn(input, {
        indent_size: this.indentSize(),
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        end_with_newline: true,
        wrap_line_length: 0,
        indent_inner_html: true,
        unformatted: ['pre', 'code', 'textarea'],
        content_unformatted: ['pre', 'textarea']
      });

      this.setOutputValue(formatted);
      this.isValid.set(true);
      this.errorMessage.set('HTML formatted successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error formatting HTML';
      this.setOutputValue(`<!-- Error: ${errorMsg} -->\n${input}`);
      this.isValid.set(false);
      this.errorMessage.set(errorMsg);
    }
  }

  minifyHtml(): void {
    const input = this.inputText().trim();
    if (!input) return;

    try {
      // Basic minification: remove extra whitespace
      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .trim();

      this.setOutputValue(minified);
      this.isValid.set(true);
      this.errorMessage.set('HTML minified successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error minifying HTML';
      this.setOutputValue(`<!-- Error: ${errorMsg} -->\n${input}`);
      this.isValid.set(false);
      this.errorMessage.set(errorMsg);
    }
  }

  validateHtml(): void {
    const input = this.inputText().trim();
    if (!input) return;

    try {
      // Basic HTML validation using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      const parseErrors = doc.querySelectorAll('parsererror');

      if (parseErrors.length > 0) {
        const errorMsg = parseErrors[0].textContent ?? 'Parse error in HTML';
        this.setOutputValue(input);
        this.isValid.set(false);
        this.errorMessage.set(errorMsg);
      } else {
        // HTML is valid, format it
        this.loadBeautifyHtml().then((beautifyFn) => {
          const formatted = beautifyFn(input, {
            indent_size: this.indentSize(),
            indent_char: ' ',
            max_preserve_newlines: 2,
            preserve_newlines: true,
            end_with_newline: true,
            wrap_line_length: 0,
            indent_inner_html: true,
            unformatted: ['pre', 'code', 'textarea'],
            content_unformatted: ['pre', 'textarea']
          });

          this.setOutputValue(formatted);
          this.isValid.set(true);
          this.errorMessage.set('HTML is valid and formatted');
        }).catch((error) => {
          const errorMsg = error instanceof Error ? error.message : 'Error formatting HTML';
          this.setOutputValue(input);
          this.isValid.set(false);
          this.errorMessage.set(errorMsg);
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error validating HTML';
      this.setOutputValue(input);
      this.isValid.set(false);
      this.errorMessage.set(errorMsg);
    }
  }

  clear(): void {
    this.setInputValue('');
    this.setOutputValue('');
    this.isValid.set(null);
    this.errorMessage.set('');
  }

  copyOutput(): void {
    const content = this.outputText();
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  copyInput(): void {
    const content = this.inputText();
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  downloadOutput(): void {
    const content = this.outputText();
    if (!content) return;

    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'formatted.html';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  loadSample(): void {
    const sample = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sample HTML</title>
<style>body{margin:0;padding:20px;font-family:Arial,sans-serif;}</style>
</head>
<body>
<header><h1>Welcome to DataUtil</h1><p>Your all-in-one utility platform</p></header>
<main><section><h2>Features</h2><ul><li>PDF Tools</li><li>Image Tools</li><li>Text Tools</li><li>Developer Tools</li></ul></section></main>
<footer><p>&copy; 2026 DataUtil. All rights reserved.</p></footer>
</body>
</html>`;

    this.setInputValue(sample);
    this.formatHtml();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

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
}
