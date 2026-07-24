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
import { SeoService } from '../../../../services/seo.service';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';

@Component({
  selector: 'app-xml-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RelatedToolsComponent],
  templateUrl: './xml-formatter.component.html',
  styleUrl: './xml-formatter.component.scss'
})
export class XmlFormatterComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('inputEditorHost') inputEditorHost?: ElementRef<HTMLDivElement>;
  @ViewChild('outputEditorHost') outputEditorHost?: ElementRef<HTMLDivElement>;

  private inputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private outputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private isSettingInput = false;
  private isSettingOutput = false;

  inputText = signal<string>('');
  outputText = signal<string>('');
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);
  indentSize = signal<number>(2);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'XML Formatter - Beautify and Validate XML | DataUtil',
      description: 'Format, validate, and minify XML instantly. Beautify XML with custom indentation and copy or download the result.',
      keywords: 'xml formatter, xml beautifier, xml validator, format xml, minify xml, xml pretty print',
      ogTitle: 'XML Formatter - Beautify and Validate XML',
      ogDescription: 'Format and validate XML instantly with custom indentation.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/xml-formatter'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'XML Formatter',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Format, beautify, and validate XML documents with custom indentation.',
      'url': 'https://www.data-util.com/categories/developer/xml-formatter',
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

  private createEditors(): void {
    loader.init().then((monaco) => {
      this.inputEditor = monaco.editor.create(this.inputEditorHost!.nativeElement, {
        value: '',
        language: 'xml',
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
        language: 'xml',
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

      this.inputEditor.onDidChangeModelContent(() => {
        if (this.isSettingInput) return;
        this.inputText.set(this.inputEditor?.getValue() ?? '');
        this.isValid.set(null);
        this.errorMessage.set('');
      });

      this.outputEditor.onDidChangeModelContent(() => {
        if (this.isSettingOutput) return;
        this.outputText.set(this.outputEditor?.getValue() ?? '');
      });
    });
  }

  // ── XML processing ────────────────────────────────────────────

  formatXml(): void {
    const input = this.inputText().trim();
    if (!input) return;

    const result = this.parseAndFormat(input, this.indentSize());
    if (result.error) {
      this.setOutputValue(this.buildErrorOutput(result.error));
      this.isValid.set(false);
      this.errorMessage.set(result.error);
    } else {
      this.setOutputValue(result.formatted!);
      this.isValid.set(true);
      this.errorMessage.set('Valid XML');
    }
  }

  minifyXml(): void {
    const input = this.inputText().trim();
    if (!input) return;

    const result = this.parseAndFormat(input, 0, true);
    if (result.error) {
      this.setOutputValue(this.buildErrorOutput(result.error));
      this.isValid.set(false);
      this.errorMessage.set(result.error);
    } else {
      this.setOutputValue(result.formatted!);
      this.isValid.set(true);
      this.errorMessage.set('Valid XML');
    }
  }

  validateXml(): void {
    const input = this.inputText().trim();
    if (!input) return;

    const result = this.parseAndFormat(input, this.indentSize());
    if (result.error) {
      this.setOutputValue(this.buildErrorOutput(result.error));
      this.isValid.set(false);
      this.errorMessage.set(result.error);
    } else {
      this.setOutputValue(result.formatted!);
      this.isValid.set(true);
      this.errorMessage.set('Valid XML');
    }
  }

  private parseAndFormat(
    xml: string,
    indent: number,
    minify = false
  ): { formatted?: string; error?: string } {
    // Use DOMParser for validation
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      const msg = parseError.textContent ?? 'Invalid XML';
      return { error: this.humanizeXmlError(msg) };
    }

    // Serialize with custom indentation
    const serializer = new XMLSerializer();
    const rawXml = serializer.serializeToString(doc);

    if (minify) {
      const minified = rawXml
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
      return { formatted: minified };
    }

    return { formatted: this.prettyPrintXml(rawXml, indent) };
  }

  private prettyPrintXml(xml: string, indent: number): string {
    const pad = ' '.repeat(indent);
    let depth = 0;
    let result = '';

    // Normalise — collapse all existing whitespace between tags first
    const normalised = xml
      .replace(/>\s*</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Split on tag boundaries, keeping delimiters
    const tokens = normalised.split(/(<[^>]+>)/g).filter(t => t.trim());

    for (const token of tokens) {
      const isCData = token.startsWith('<![CDATA[');
      const isComment = token.startsWith('<!--');
      const isProcessing = token.startsWith('<?');
      const isClosing = token.startsWith('</');
      const isSelfClosing = token.endsWith('/>');
      const isOpening = token.startsWith('<') && !isClosing && !isSelfClosing && !isComment && !isProcessing && !isCData;

      if (isClosing) {
        depth = Math.max(0, depth - 1);
        result += pad.repeat(depth) + token + '\n';
      } else if (isSelfClosing || isComment || isProcessing || isCData) {
        result += pad.repeat(depth) + token + '\n';
      } else if (isOpening) {
        result += pad.repeat(depth) + token + '\n';
        depth++;
      } else {
        // text node
        const trimmed = token.trim();
        if (trimmed) {
          result += pad.repeat(depth) + trimmed + '\n';
        }
      }
    }

    return result.trimEnd();
  }

  private humanizeXmlError(raw: string): string {
    const lineMatch = raw.match(/line[:\s]+(\d+)/i);
    const colMatch = raw.match(/column[:\s]+(\d+)/i);

    let msg = 'Invalid XML.';
    if (lineMatch || colMatch) {
      msg += ` Error at line ${lineMatch?.[1] ?? '?'}, column ${colMatch?.[1] ?? '?'}.`;
    }

    if (/unclosed|not terminated/i.test(raw)) {
      msg += ' A tag or element is not properly closed.';
    } else if (/mismatch|expected/i.test(raw)) {
      msg += ' Mismatched opening and closing tags.';
    } else if (/attribute|value/i.test(raw)) {
      msg += ' Check attribute names and quoted values.';
    }

    return msg;
  }

  private buildErrorOutput(error: string): string {
    return `XML Validation Error\n\n${error}\n\nCommon causes:\n- Unclosed tags (e.g. <tag> without </tag>)\n- Mismatched tag names\n- Unquoted or missing attribute values\n- Invalid characters (&, <, > outside CDATA)`;
  }

  // ── Actions ───────────────────────────────────────────────────

  clearAll(): void {
    this.setInputValue('');
    this.setOutputValue('');
    this.isValid.set(null);
    this.errorMessage.set('');
  }

  copyInput(): void {
    const content = this.inputText();
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  copyOutput(): void {
    const content = this.outputText();
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  downloadOutput(): void {
    const content = this.outputText();
    if (!content) return;
    const blob = new Blob([content], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  loadSample(): void {
    const sample = `<?xml version="1.0" encoding="UTF-8"?>
<catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book><book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-12-16</publish_date><description>A former architect battles corporate zombies.</description></book></catalog>`;
    this.setInputValue(sample);
    this.formatXml();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setInputValue((e.target?.result as string) ?? '');
      this.isValid.set(null);
      this.errorMessage.set('');
    };
    reader.readAsText(files[0]);
    input.value = '';
  }

  // ── Helpers ───────────────────────────────────────────────────

  private setInputValue(value: string): void {
    this.inputText.set(value);
    if (this.inputEditor) {
      this.isSettingInput = true;
      this.inputEditor.setValue(value);
      this.isSettingInput = false;
    }
  }

  private setOutputValue(value: string): void {
    this.outputText.set(value);
    if (this.outputEditor) {
      this.isSettingOutput = true;
      this.outputEditor.setValue(value);
      this.isSettingOutput = false;
    }
  }
}
