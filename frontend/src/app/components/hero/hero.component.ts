import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  protected readonly searchQuery = signal('');
  
  protected readonly popularSearches = [
    'PDF', 'JSON', 'Image', 'QR', 'Word', 'Excel'
  ];

  protected onSearch(): void {
    if (this.searchQuery()) {
      console.log('Searching for:', this.searchQuery());
      // Navigate to search results
    }
  }

  protected selectPopularSearch(term: string): void {
    this.searchQuery.set(term);
    this.onSearch();
  }
}
