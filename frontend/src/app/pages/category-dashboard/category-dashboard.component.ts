import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: Tool[];
}

@Component({
  selector: 'app-category-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-dashboard.component.html',
  styleUrl: './category-dashboard.component.scss'
})
export class CategoryDashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  category = signal<Category | null>(null);
  selectedFilter = signal<string>('all');

  private readonly categories: Record<string, Category> = {
    pdf: {
      id: 'pdf',
      name: 'PDF Tools',
      description: 'Every tool you need to work with PDFs in one place. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.',
      icon: '📄',
      color: '#EF4444',
      tools: [
        { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: '🔗', route: '/pdf/merge-pdf', category: 'organize' },
        { id: 'split-pdf', name: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: '✂️', route: '/pdf/split-pdf', category: 'organize' },
        { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', icon: '📦', route: '/pdf/compress-pdf', category: 'optimize' },
        { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', icon: '🔄', route: '/pdf/rotate-pdf', category: 'organize' },
        { id: 'pdf-to-word', name: 'PDF to Word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', icon: '📝', route: '/pdf/pdf-to-word', category: 'convert' },
        { id: 'word-to-pdf', name: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: '📄', route: '/pdf/word-to-pdf', category: 'convert' },
        { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', icon: '📊', route: '/pdf/pdf-to-excel', category: 'convert' },
        { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Make XLSX and XLS format spreadsheets easy to read by converting them to PDF.', icon: '📈', route: '/pdf/excel-to-pdf', category: 'convert' },
        { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', icon: '📽️', route: '/pdf/pdf-to-ppt', category: 'convert' },
        { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', icon: '🎬', route: '/pdf/ppt-to-pdf', category: 'convert' },
        { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', icon: '🖼️', route: '/pdf/jpg-to-pdf', category: 'convert' },
        { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', icon: '🌄', route: '/pdf/pdf-to-jpg', category: 'convert' },
        { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: '🔓', route: '/pdf/unlock-pdf', category: 'security' },
        { id: 'protect-pdf', name: 'Protect PDF', description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', icon: '🔒', route: '/pdf/protect-pdf', category: 'security' },
        { id: 'edit-pdf', name: 'Edit PDF', description: 'Add text, images, shapes or freehand annotations to a PDF document.', icon: '✏️', route: '/pdf/edit-pdf', category: 'edit' }
      ]
    },
    images: {
      id: 'images',
      name: 'Image Tools',
      description: 'Professional image editing tools for resizing, compressing, converting, and optimizing images. Fast, secure, and easy to use.',
      icon: '🖼️',
      color: '#8B5CF6',
      tools: [
        { id: 'resize-image', name: 'Resize Image', description: 'Resize images to exact dimensions or percentage. Maintain aspect ratio or custom size.', icon: '📐', route: '/images/resize-image', category: 'edit' },
        { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size while maintaining quality. Perfect for web optimization.', icon: '🗜️', route: '/images/compress-image', category: 'optimize' },
        { id: 'crop-image', name: 'Crop Image', description: 'Crop images to remove unwanted areas. Free crop or fixed aspect ratios.', icon: '✂️', route: '/images/crop-image', category: 'edit' },
        { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate images by any angle. Quick 90° rotation or custom angles.', icon: '🔄', route: '/images/rotate-image', category: 'edit' },
        { id: 'flip-image', name: 'Flip Image', description: 'Flip images horizontally or vertically. Mirror effect tool.', icon: '🔃', route: '/images/flip-image', category: 'edit' },
        { id: 'convert-image', name: 'Convert Image', description: 'Convert between JPG, PNG, WebP, GIF, and other formats.', icon: '🔄', route: '/images/convert-image', category: 'convert' },
        { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format with optional quality settings.', icon: '🖼️', route: '/images/png-to-jpg', category: 'convert' },
        { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format for transparency support.', icon: '🌄', route: '/images/jpg-to-png', category: 'convert' },
        { id: 'webp-converter', name: 'WebP Converter', description: 'Convert images to/from WebP format for better web performance.', icon: '⚡', route: '/images/webp-converter', category: 'convert' },
        { id: 'remove-bg', name: 'Remove Background', description: 'Automatically remove image backgrounds with AI precision.', icon: '🎭', route: '/images/remove-bg', category: 'edit' },
        { id: 'watermark', name: 'Add Watermark', description: 'Add text or image watermarks to protect your images.', icon: '©️', route: '/images/watermark', category: 'edit' },
        { id: 'image-filter', name: 'Image Filters', description: 'Apply filters and effects to enhance your images.', icon: '🎨', route: '/images/filters', category: 'edit' }
      ]
    },
    text: {
      id: 'text',
      name: 'Text Tools',
      description: 'Powerful text manipulation tools for counting, formatting, converting, and analyzing text content.',
      icon: '📝',
      color: '#10B981',
      tools: [
        { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs in your text.', icon: '🔢', route: '/text/word-counter', category: 'analyze' },
        { id: 'character-counter', name: 'Character Counter', description: 'Count characters with or without spaces. Real-time counting.', icon: '📊', route: '/text/character-counter', category: 'analyze' },
        { id: 'case-converter', name: 'Case Converter', description: 'Convert text to uppercase, lowercase, title case, or sentence case.', icon: '🔤', route: '/text/case-converter', category: 'format' },
        { id: 'remove-spaces', name: 'Remove Extra Spaces', description: 'Remove extra spaces, tabs, and line breaks from text.', icon: '🧹', route: '/text/remove-spaces', category: 'format' },
        { id: 'remove-lines', name: 'Remove Blank Lines', description: 'Remove empty lines and clean up text formatting.', icon: '📋', route: '/text/remove-lines', category: 'format' },
        { id: 'reverse-text', name: 'Reverse Text', description: 'Reverse text, words, or entire paragraphs instantly.', icon: '🔄', route: '/text/reverse-text', category: 'transform' },
        { id: 'sort-lines', name: 'Sort Lines', description: 'Sort text lines alphabetically or numerically.', icon: '🔢', route: '/text/sort-lines', category: 'format' },
        { id: 'duplicate-remover', name: 'Remove Duplicates', description: 'Remove duplicate lines from your text.', icon: '🗑️', route: '/text/duplicate-remover', category: 'format' },
        { id: 'find-replace', name: 'Find and Replace', description: 'Search and replace text with support for regex.', icon: '🔍', route: '/text/find-replace', category: 'transform' },
        { id: 'text-difference', name: 'Text Difference', description: 'Compare two texts and highlight the differences.', icon: '⚖️', route: '/text/text-difference', category: 'analyze' },
        { id: 'random-text', name: 'Random Text Generator', description: 'Generate random text, lorem ipsum, or placeholder content.', icon: '🎲', route: '/text/random-text', category: 'generate' },
        { id: 'slug-generator', name: 'URL Slug Generator', description: 'Convert text into URL-friendly slugs.', icon: '🔗', route: '/text/slug-generator', category: 'transform' }
      ]
    },
    developer: {
      id: 'developer',
      name: 'Developer Tools',
      description: 'Essential tools for developers including formatters, validators, encoders, and code generators.',
      icon: '💻',
      color: '#3B82F6',
      tools: [
        { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and beautify JSON with syntax highlighting.', icon: '{ }', route: '/developer/json-formatter', category: 'format' },
        { id: 'json-validator', name: 'JSON Validator', description: 'Validate JSON syntax and structure with detailed error messages.', icon: '✓', route: '/developer/json-validator', category: 'validate' },
        { id: 'xml-formatter', name: 'XML Formatter', description: 'Format and beautify XML documents.', icon: '<>', route: '/developer/xml-formatter', category: 'format' },
        { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format SQL queries for better readability.', icon: '🗄️', route: '/developer/sql-formatter', category: 'format' },
        { id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML code.', icon: '🌐', route: '/developer/html-formatter', category: 'format' },
        { id: 'css-beautifier', name: 'CSS Beautifier', description: 'Format and beautify CSS stylesheets.', icon: '🎨', route: '/developer/css-beautifier', category: 'format' },
        { id: 'js-minifier', name: 'JavaScript Minifier', description: 'Minify JavaScript code to reduce file size.', icon: '⚡', route: '/developer/js-minifier', category: 'optimize' },
        { id: 'base64-encode', name: 'Base64 Encode/Decode', description: 'Encode and decode Base64 strings.', icon: '🔐', route: '/developer/base64', category: 'encode' },
        { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode and decode URL components.', icon: '🔗', route: '/developer/url-encoder', category: 'encode' },
        { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and verify JSON Web Tokens.', icon: '🎫', route: '/developer/jwt-decoder', category: 'decode' },
        { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique identifiers (UUIDs/GUIDs).', icon: '🔑', route: '/developer/uuid-generator', category: 'generate' },
        { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA1, SHA256, and other hashes.', icon: '#️⃣', route: '/developer/hash-generator', category: 'generate' },
        { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions with live results.', icon: '🔍', route: '/developer/regex-tester', category: 'test' },
        { id: 'color-picker', name: 'Color Picker', description: 'Pick colors and convert between HEX, RGB, HSL.', icon: '🎨', route: '/developer/color-picker', category: 'tool' },
        { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Convert between Unix timestamps and dates.', icon: '⏰', route: '/developer/timestamp', category: 'convert' }
      ]
    }
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = params['category'];
      const category = this.categories[categoryId];
      
      if (category) {
        this.category.set(category);
        this.seoService.setPageMeta({
          title: `${category.name} - DataUtil`,
          description: category.description,
          keywords: `${categoryId}, tools, online, free, ${category.name.toLowerCase()}`,
          ogTitle: `${category.name} - DataUtil`,
          ogDescription: category.description,
          canonicalUrl: `https://datautility.com/categories/${categoryId}`
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  filterTools(filter: string): Tool[] {
    const category = this.category();
    if (!category) return [];
    
    if (filter === 'all') {
      return category.tools;
    }
    
    return category.tools.filter(tool => tool.category === filter);
  }

  getUniqueFilters(): string[] {
    const category = this.category();
    if (!category) return [];
    
    const filters = new Set(category.tools.map(tool => tool.category));
    return ['all', ...Array.from(filters)];
  }

  setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  navigateToTool(toolRoute: string): void {
    this.router.navigate([toolRoute]);
  }
}
