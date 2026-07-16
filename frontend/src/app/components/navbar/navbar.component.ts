import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { TOOLS_REGISTRY } from '../../shared/data/tools.data';

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
      dropdown: TOOLS_REGISTRY['pdf'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon }))
    },
    {
      label: 'IMAGE TOOLS',
      categoryRoute: '/categories/images',
      dropdown: TOOLS_REGISTRY['images'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon }))
    },
    {
      label: 'TEXT TOOLS',
      categoryRoute: '/categories/text',
      dropdown: TOOLS_REGISTRY['text'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon }))
    },
    {
      label: 'DEVELOPER',
      categoryRoute: '/categories/developer',
      dropdown: TOOLS_REGISTRY['developer'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon }))
    },
    {
      label: 'ALL TOOLS',
      categoryRoute: '/categories',
      dropdown: [
        ...TOOLS_REGISTRY['pdf'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon })),
        ...TOOLS_REGISTRY['images'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon })),
        ...TOOLS_REGISTRY['text'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon })),
        ...TOOLS_REGISTRY['developer'].tools.map(t => ({ label: t.name, route: t.route, icon: t.icon }))
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
