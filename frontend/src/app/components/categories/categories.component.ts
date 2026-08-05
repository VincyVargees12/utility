import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TOOLS_REGISTRY } from '../../shared/data/tools.data';

interface Category {
  name: string;
  icon: string;
  description: string;
  toolCount: number;
  color: string;
  route: string;
}

/** Short, card-friendly copy and icon per category — kept separate from the registry's longer page-level descriptions. */
const CATEGORY_DISPLAY: Record<string, { icon: string; description: string }> = {
  pdf: {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    description: 'Merge, split, compress and convert PDF files'
  },
  images: {
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    description: 'Resize, compress, convert and edit images'
  },
  text: {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    description: 'Format, count, and transform text easily'
  },
  developer: {
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    description: 'JSON, XML, Base64 and more dev utilities'
  }
};

const CATEGORY_ORDER = ['pdf', 'images', 'text', 'developer'];

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
  // Derived from TOOLS_REGISTRY so the tool count and route can never drift out of sync with the real catalog.
  protected readonly categories: Category[] = CATEGORY_ORDER.map(id => {
    const category = TOOLS_REGISTRY[id];
    const display = CATEGORY_DISPLAY[id];
    return {
      name: category.name,
      icon: display.icon,
      description: display.description,
      toolCount: category.tools.length,
      color: category.color,
      route: `/categories/${id}`
    };
  });
}
