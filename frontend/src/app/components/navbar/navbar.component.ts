import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme.service';
import { TOOLS_REGISTRY } from '../../shared/data/tools.data';

interface NavItem {
  label: string;
  route?: string;
  categoryRoute?: string;
  dropdownKey?: keyof typeof TOOLS_REGISTRY | 'all';
}

interface DropdownItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly themeService = inject(ThemeService);
  private readonly dropdownCache = new Map<NavItem['dropdownKey'], DropdownItem[]>();
  
  protected readonly isDarkMode = this.themeService.isDarkMode;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly activeDropdown = signal<string | null>(null);

  protected readonly navItems: NavItem[] = [
    {
      label: 'PDF TOOLS',
      categoryRoute: '/categories/pdf',
      dropdownKey: 'pdf'
    },
    {
      label: 'IMAGE TOOLS',
      categoryRoute: '/categories/images',
      dropdownKey: 'images'
    },
    {
      label: 'TEXT TOOLS',
      categoryRoute: '/categories/text',
      dropdownKey: 'text'
    },
    {
      label: 'DEVELOPER',
      categoryRoute: '/categories/developer',
      dropdownKey: 'developer'
    },
    {
      label: 'ALL TOOLS',
      categoryRoute: '/categories',
      dropdownKey: 'all'
    }
  ];

  protected getDropdownItems(item: NavItem): DropdownItem[] {
    if (!item.dropdownKey) {
      return [];
    }

    const cachedItems = this.dropdownCache.get(item.dropdownKey);
    if (cachedItems) {
      return cachedItems;
    }

    const dropdownItems = item.dropdownKey === 'all'
      ? (Object.values(TOOLS_REGISTRY) as Array<(typeof TOOLS_REGISTRY)[keyof typeof TOOLS_REGISTRY]>).flatMap(category =>
          category.tools.map(tool => ({
            label: tool.name,
            route: tool.route,
            icon: tool.icon
          }))
        )
      : TOOLS_REGISTRY[item.dropdownKey].tools.map(tool => ({
          label: tool.name,
          route: tool.route,
          icon: tool.icon
        }));

    this.dropdownCache.set(item.dropdownKey, dropdownItems);
    return dropdownItems;
  }

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
