import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { CASE_CONVERTER_RESOURCE_CONTENT } from './case-converter.resource-content';

interface CaseResult {
  uppercase: string;
  lowercase: string;
  titlecase: string;
  sentencecase: string;
  camelcase: string;
  pascalcase: string;
  snakecase: string;
  kebabcase: string;
  dotcase: string;
}

@Component({
  selector: 'app-case-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './case-converter.component.html',
  styleUrl: './case-converter.component.scss'
})
export class CaseConverterComponent implements OnInit {
  private seoService = inject(SeoService);

  text = signal<string>('');
  results = signal<CaseResult>({
    uppercase: '',
    lowercase: '',
    titlecase: '',
    sentencecase: '',
    camelcase: '',
    pascalcase: '',
    snakecase: '',
    kebabcase: '',
    dotcase: ''
  });
  copiedCase = signal<string | null>(null);

  resourceContent = CASE_CONVERTER_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Case Converter - Free Text Case Converter | DataUtil',
      description: 'Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and more formats instantly.',
      keywords: 'case converter, text converter, uppercase, lowercase, camelcase, snake case, text formatter',
      ogTitle: 'Case Converter - Free Text Case Converter',
      ogDescription: 'Convert text to any case format instantly. Supports uppercase, lowercase, title case, camelCase, snake_case, and more.',
      canonicalUrl: 'https://datautility.com/categories/text/case-converter'
    });
  }

  onTextChange(): void {
    this.updateCases();
  }

  private updateCases(): void {
    const content = this.text();

    this.results.set({
      uppercase: content.toUpperCase(),
      lowercase: content.toLowerCase(),
      titlecase: this.toTitleCase(content),
      sentencecase: this.toSentenceCase(content),
      camelcase: this.toCamelCase(content),
      pascalcase: this.toPascalCase(content),
      snakecase: this.toSnakeCase(content),
      kebabcase: this.toKebabCase(content),
      dotcase: this.toDotCase(content)
    });
  }

  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private toSentenceCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/([.!?]\s+)(\w)/g, (_, punct, letter) => punct + letter.toUpperCase());
  }

  private toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  private toPascalCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  private toDotCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .replace(/\s+/g, '.')
      .toLowerCase();
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
    this.copiedCase.set(null);
  }

  copyToClipboard(caseType: keyof CaseResult): void {
    const text = this.results()[caseType];
    navigator.clipboard.writeText(text).then(() => {
      this.copiedCase.set(caseType);
      setTimeout(() => this.copiedCase.set(null), 2000);
    });
  }

  downloadResult(caseType: keyof CaseResult, caseName: string): void {
    const content = this.results()[caseType];
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${caseName}-${new Date().getTime()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
