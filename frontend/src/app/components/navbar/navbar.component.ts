import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

interface NavItem {
  label: string;
  route?: string;
  categoryRoute?: string;
  dropdown?: { label: string; route: string; icon: string }[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly themeService = inject(ThemeService);
  
  protected readonly isDarkMode = this.themeService.isDarkMode;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly activeDropdown = signal<string | null>(null);

  protected readonly navItems: NavItem[] = [
    {
      label: 'PDF TOOLS',
      categoryRoute: '/categories/pdf',
      dropdown: [
        { label: 'Merge PDF', route: '/categories/pdf/merge-pdf', icon: '🔗' },
        { label: 'Split PDF', route: '/categories/pdf/split-pdf', icon: '✂️' },
        { label: 'Compress PDF', route: '/categories/pdf/compress-pdf', icon: '📦' },
        { label: 'Rotate PDF', route: '/categories/pdf/rotate-pdf', icon: '🔄' },
        { label: 'PDF to Word', route: '/categories/pdf/pdf-to-word', icon: '📝' },
        { label: 'Word to PDF', route: '/categories/pdf/word-to-pdf', icon: '📄' },
        { label: 'PDF to Excel', route: '/categories/pdf/pdf-to-excel', icon: '📊' },
        { label: 'Excel to PDF', route: '/categories/pdf/excel-to-pdf', icon: '📈' },
        { label: 'PDF to JPG', route: '/categories/pdf/pdf-to-jpg', icon: '🌄' },
        { label: 'JPG to PDF', route: '/categories/pdf/jpg-to-pdf', icon: '🖼️' },
      ]
    },
    {
      label: 'IMAGE TOOLS',
      categoryRoute: '/categories/images',
      dropdown: [
        { label: 'Resize Image', route: '/categories/images/resize-image', icon: '📐' },
        { label: 'Compress Image', route: '/categories/images/compress-image', icon: '🗜️' },
        { label: 'Crop Image', route: '/categories/images/crop-image', icon: '✂️' },
        { label: 'Rotate Image', route: '/categories/images/rotate-image', icon: '🔄' },
        { label: 'Flip Image', route: '/categories/images/flip-image', icon: '🔃' },
        { label: 'Convert Image', route: '/categories/images/convert-image', icon: '🔄' },
        { label: 'PNG to JPG', route: '/categories/images/png-to-jpg', icon: '🖼️' },
        { label: 'JPG to PNG', route: '/categories/images/jpg-to-png', icon: '🌄' },
        { label: 'Remove Background', route: '/categories/images/remove-bg', icon: '🎭' },
        { label: 'Add Watermark', route: '/categories/images/watermark', icon: '©️' },
      ]
    },
    {
      label: 'TEXT TOOLS',
      categoryRoute: '/categories/text',
      dropdown: [
        { label: 'Word Counter', route: '/categories/text/word-counter', icon: '🔢' },
        { label: 'Character Counter', route: '/categories/text/character-counter', icon: '📊' },
        { label: 'Case Converter', route: '/categories/text/case-converter', icon: '🔤' },
        { label: 'Remove Extra Spaces', route: '/categories/text/remove-spaces', icon: '🧹' },
        { label: 'Remove Blank Lines', route: '/categories/text/remove-lines', icon: '📋' },
        { label: 'Reverse Text', route: '/categories/text/reverse-text', icon: '🔄' },
        { label: 'Sort Lines', route: '/categories/text/sort-lines', icon: '🔢' },
        { label: 'Remove Duplicates', route: '/categories/text/duplicate-remover', icon: '🗑️' },
        { label: 'Find and Replace', route: '/categories/text/find-replace', icon: '🔍' },
        { label: 'Text Difference', route: '/categories/text/text-difference', icon: '⚖️' },
      ]
    },
    {
      label: 'DEVELOPER',
      categoryRoute: '/categories/developer',
      dropdown: [
        { label: 'JSON Formatter', route: '/categories/developer/json-formatter', icon: '{ }' },
        { label: 'JSON Validator', route: '/categories/developer/json-validator', icon: '✓' },
        { label: 'XML Formatter', route: '/categories/developer/xml-formatter', icon: '<>' },
        { label: 'SQL Formatter', route: '/categories/developer/sql-formatter', icon: '🗄️' },
        { label: 'HTML Formatter', route: '/categories/developer/html-formatter', icon: '🌐' },
        { label: 'Base64 Encode/Decode', route: '/categories/developer/base64', icon: '🔐' },
        { label: 'URL Encoder', route: '/categories/developer/url-encoder', icon: '🔗' },
        { label: 'JWT Decoder', route: '/categories/developer/jwt-decoder', icon: '🎫' },
        { label: 'UUID Generator', route: '/categories/developer/uuid-generator', icon: '🔑' },
        { label: 'Hash Generator', route: '/categories/developer/hash-generator', icon: '#️⃣' },
      ]
    },
    {
      label: 'ALL TOOLS',
      categoryRoute: '/categories',
      dropdown: [
        // PDF Tools
        { label: 'Merge PDF', route: '/categories/pdf/merge-pdf', icon: '🔗' },
        { label: 'Split PDF', route: '/categories/pdf/split-pdf', icon: '✂️' },
        { label: 'Compress PDF', route: '/categories/pdf/compress-pdf', icon: '📦' },
        { label: 'Rotate PDF', route: '/categories/pdf/rotate-pdf', icon: '🔄' },
        { label: 'PDF to Word', route: '/categories/pdf/pdf-to-word', icon: '📝' },
        { label: 'Word to PDF', route: '/categories/pdf/word-to-pdf', icon: '📄' },
        { label: 'PDF to Excel', route: '/categories/pdf/pdf-to-excel', icon: '📊' },
        { label: 'Excel to PDF', route: '/categories/pdf/excel-to-pdf', icon: '📈' },
        { label: 'PDF to JPG', route: '/categories/pdf/pdf-to-jpg', icon: '🌄' },
        { label: 'JPG to PDF', route: '/categories/pdf/jpg-to-pdf', icon: '🖼️' },
        // Image Tools
        { label: 'Resize Image', route: '/categories/images/resize-image', icon: '📐' },
        { label: 'Compress Image', route: '/categories/images/compress-image', icon: '🗜️' },
        { label: 'Crop Image', route: '/categories/images/crop-image', icon: '✂️' },
        { label: 'Rotate Image', route: '/categories/images/rotate-image', icon: '🔄' },
        { label: 'Flip Image', route: '/categories/images/flip-image', icon: '🔃' },
        { label: 'Convert Image', route: '/categories/images/convert-image', icon: '🔄' },
        { label: 'PNG to JPG', route: '/categories/images/png-to-jpg', icon: '🖼️' },
        { label: 'JPG to PNG', route: '/categories/images/jpg-to-png', icon: '🌄' },
        { label: 'Remove Background', route: '/categories/images/remove-bg', icon: '🎭' },
        { label: 'Add Watermark', route: '/categories/images/watermark', icon: '©️' },
        // Text Tools
        { label: 'Word Counter', route: '/categories/text/word-counter', icon: '🔢' },
        { label: 'Character Counter', route: '/categories/text/character-counter', icon: '📊' },
        { label: 'Case Converter', route: '/categories/text/case-converter', icon: '🔤' },
        { label: 'Remove Extra Spaces', route: '/categories/text/remove-spaces', icon: '🧹' },
        { label: 'Remove Blank Lines', route: '/categories/text/remove-lines', icon: '📋' },
        { label: 'Reverse Text', route: '/categories/text/reverse-text', icon: '🔄' },
        { label: 'Sort Lines', route: '/categories/text/sort-lines', icon: '🔢' },
        { label: 'Remove Duplicates', route: '/categories/text/duplicate-remover', icon: '🗑️' },
        { label: 'Find and Replace', route: '/categories/text/find-replace', icon: '🔍' },
        { label: 'Text Difference', route: '/categories/text/text-difference', icon: '⚖️' },
        // Developer Tools
        { label: 'JSON Formatter', route: '/categories/developer/json-formatter', icon: '{ }' },
        { label: 'JSON Validator', route: '/categories/developer/json-validator', icon: '✓' },
        { label: 'XML Formatter', route: '/categories/developer/xml-formatter', icon: '<>' },
        { label: 'SQL Formatter', route: '/categories/developer/sql-formatter', icon: '🗄️' },
        { label: 'HTML Formatter', route: '/categories/developer/html-formatter', icon: '🌐' },
        { label: 'Base64 Encode/Decode', route: '/categories/developer/base64', icon: '🔐' },
        { label: 'URL Encoder', route: '/categories/developer/url-encoder', icon: '🔗' },
        { label: 'JWT Decoder', route: '/categories/developer/jwt-decoder', icon: '🎫' },
        { label: 'UUID Generator', route: '/categories/developer/uuid-generator', icon: '🔑' },
        { label: 'Hash Generator', route: '/categories/developer/hash-generator', icon: '#️⃣' },
      ]
    },
  ];

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  protected toggleDropdown(label: string): void {
    this.activeDropdown.update(current => current === label ? null : label);
  }

  protected closeDropdown(): void {
    this.activeDropdown.set(null);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
