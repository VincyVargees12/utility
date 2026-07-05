import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

interface NavItem {
  label: string;
  route?: string;
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
      dropdown: [
        { label: 'Merge PDF', route: '/tools/merge-pdf', icon: '🔗' },
        { label: 'Split PDF', route: '/tools/split-pdf', icon: '✂️' },
        { label: 'Compress PDF', route: '/tools/compress-pdf', icon: '📦' },
        { label: 'PDF to Word', route: '/tools/pdf-to-word', icon: '📝' },
      ]
    },
    {
      label: 'IMAGE TOOLS',
      dropdown: [
        { label: 'Compress Image', route: '/tools/compress-image', icon: '🖼️' },
        { label: 'Resize Image', route: '/tools/resize-image', icon: '📐' },
        { label: 'Convert Image', route: '/tools/convert-image', icon: '🔄' },
        { label: 'Crop Image', route: '/tools/crop-image', icon: '✂️' },
      ]
    },
    {
      label: 'TEXT TOOLS',
      dropdown: [
        { label: 'Word Counter', route: '/tools/word-counter', icon: '📊' },
        { label: 'Case Converter', route: '/tools/case-converter', icon: '🔤' },
        { label: 'Text Formatter', route: '/tools/text-formatter', icon: '📝' },
        { label: 'Find & Replace', route: '/tools/find-replace', icon: '🔍' },
      ]
    },
    {
      label: 'DEVELOPER',
      dropdown: [
        { label: 'JSON Formatter', route: '/tools/json-formatter', icon: '{}' },
        { label: 'Base64 Encode', route: '/tools/base64-encode', icon: '🔐' },
        { label: 'Hash Generator', route: '/tools/hash-generator', icon: '#' },
        { label: 'QR Code', route: '/tools/qr-code', icon: '📱' },
      ]
    },
    {
      label: 'ALL TOOLS',
      route: '/categories'
    }
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
