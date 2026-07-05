import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly darkMode = signal<boolean>(false);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  readonly isDarkMode = this.darkMode.asReadonly();

  constructor() {
    // Only access browser APIs when running in browser
    if (this.isBrowser) {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.darkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

      // Apply theme changes to document
      effect(() => {
        if (this.darkMode()) {
          document.body.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  toggleTheme(): void {
    this.darkMode.update(value => !value);
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.set(isDark);
  }
}
