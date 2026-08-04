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
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';
import { SQL_FORMATTER_RESOURCE_CONTENT } from './sql-formatter.resource-content';

@Component({
  selector: 'app-sql-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './sql-formatter.component.html',
  styleUrl: './sql-formatter.component.scss'
})
export class SqlFormatterComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('inputEditorHost') inputEditorHost?: ElementRef<HTMLDivElement>;
  @ViewChild('outputEditorHost') outputEditorHost?: ElementRef<HTMLDivElement>;

  private inputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private outputEditor?: Monaco.editor.IStandaloneCodeEditor;
  private isSettingInputEditor = false;
  private isSettingOutputEditor = false;
  private formatSqlFn?: (sql: string, options: object) => string;

  inputText = signal<string>('');
  outputText = signal<string>('');
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string>('');
  copied = signal<boolean>(false);

  indentSize = signal<number>(2);
  dialect = signal<string>('sql');
  uppercase = signal<boolean>(true);

  dialects = [
    { value: 'sql', label: 'Standard SQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'mariadb', label: 'MariaDB' },
    { value: 'sqlserver', label: 'SQL Server (T-SQL)' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'oracle', label: 'Oracle PL/SQL' },
    { value: 'db2', label: 'DB2' },
    { value: 'redshift', label: 'Amazon Redshift' },
    { value: 'bigquery', label: 'BigQuery' },
    { value: 'snowflake', label: 'Snowflake' },
    { value: 'spark', label: 'Spark SQL' }
  ];

  resourceContent = SQL_FORMATTER_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'SQL Formatter - Online SQL Beautifier & Validator | DataUtil',
      description: 'Format, beautify, and validate SQL queries for multiple dialects including MySQL, PostgreSQL, SQL Server, and Oracle. Standardize your SQL code instantly.',
      keywords: 'sql formatter, sql beautifier, sql validator, format sql, mysql formatter, postgresql formatter, sql server formatter',
      ogTitle: 'SQL Formatter - Online SQL Beautifier & Validator',
      ogDescription: 'Format and beautify SQL queries instantly with support for multiple dialects.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/sql-formatter'
    });

    // Add structured data for the tool
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'SQL Formatter',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Format and beautify SQL queries for MySQL, PostgreSQL, SQL Server, Oracle, and more.',
      'url': 'https://www.data-util.com/categories/developer/sql-formatter',
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

  private async createEditors(): Promise<void> {
    const monaco = await loader.init();

    if (this.inputEditorHost) {
      this.inputEditor = monaco.editor.create(this.inputEditorHost.nativeElement, {
        value: this.inputText(),
        language: 'sql',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        tabSize: this.indentSize(),
        wordWrap: 'on',
        links: false
      });

      this.inputEditor.onDidChangeModelContent(() => {
        if (!this.isSettingInputEditor) {
          this.inputText.set(this.inputEditor?.getValue() || '');
          this.isValid.set(null);
          this.errorMessage.set('');
        }
      });
    }

    if (this.outputEditorHost) {
      this.outputEditor = monaco.editor.create(this.outputEditorHost.nativeElement, {
        value: this.outputText(),
        language: 'sql',
        theme: 'vs',
        automaticLayout: true,
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        tabSize: this.indentSize(),
        wordWrap: 'on',
        links: false
      });
    }
  }

  private setInputValue(value: string): void {
    this.isSettingInputEditor = true;
    this.inputText.set(value);
    this.inputEditor?.setValue(value);
    this.isSettingInputEditor = false;
  }

  private setOutputValue(value: string): void {
    this.isSettingOutputEditor = true;
    this.outputText.set(value);
    this.outputEditor?.setValue(value);
    this.isSettingOutputEditor = false;
  }

  private async loadSqlFormatter(): Promise<(sql: string, options: object) => string> {
    if (this.formatSqlFn) {
      return this.formatSqlFn;
    }
    const module = await import('sql-formatter');
    this.formatSqlFn = module.format;
    return this.formatSqlFn;
  }

  async formatSql(): Promise<void> {
    const sql = this.inputText().trim();
    if (!sql) return;

    try {
      const formatFn = await this.loadSqlFormatter();
      const formatted = formatFn(sql, {
        language: this.dialect() as any,
        tabWidth: this.indentSize(),
        keywordCase: this.uppercase() ? 'upper' : 'lower',
        indentStyle: 'tabularLeft',
        logicalOperatorNewline: 'before',
        expressionWidth: 50
      });
      this.setOutputValue(formatted);
      this.isValid.set(true);
      this.errorMessage.set('SQL formatted successfully.');
    } catch (error: any) {
      this.isValid.set(false);
      this.errorMessage.set(error.message || 'Error formatting SQL');
      this.setOutputValue('-- Error: ' + (error.message || 'Invalid SQL syntax') + '\n\n' + sql);
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
      // Show some feedback if needed
    });
  }

  downloadOutput(): void {
    const content = this.outputText();
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_${this.dialect()}.sql`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.setInputValue(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  loadSample(): void {
    const sample = `SELECT a.id, a.name, b.order_date, b.amount FROM users a JOIN orders b ON a.id = b.user_id WHERE b.amount > 100 AND b.status = 'completed' ORDER BY b.order_date DESC LIMIT 10;`;
    this.setInputValue(sample);
  }
}
