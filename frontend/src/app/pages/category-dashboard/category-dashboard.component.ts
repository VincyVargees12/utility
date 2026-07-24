import { TOOLS_REGISTRY } from '../../shared/data/tools.data';
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

  private readonly categories: Record<string, Category> = TOOLS_REGISTRY;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Try to get category from route params first
      let categoryId = params['category'];
      
      // If no params, extract from parent route URL (for child routes)
      if (!categoryId && this.route.parent) {
        const parentUrlSegments = this.route.parent.snapshot.url.map(s => s.path);
        // Parent URL will be like ['categories', 'pdf'] so we take the last segment
        if (parentUrlSegments.length >= 2) {
          categoryId = parentUrlSegments[parentUrlSegments.length - 1] || null;
        }
      }

      if (categoryId) {
        const category = this.categories[categoryId];
        
        if (category) {
          this.category.set(category);
          this.seoService.setPageMeta({
            title: `${category.name} - DataUtil`,
            description: category.description,
            keywords: `${categoryId}, tools, online, free, ${category.name.toLowerCase()}`,
            ogTitle: `${category.name} - DataUtil`,
            ogDescription: category.description,
            canonicalUrl: `https://www.data-util.com/categories/${categoryId}`
          });

          // Add structured data for the category page
          this.seoService.addStructuredData({
            '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': category.name,
          'description': category.description,
          'url': `https://www.data-util.com/categories/${categoryId}`,
          'mainEntity': {
            '@type': 'ItemList',
            'numberOfItems': category.tools.length,
            'itemListElement': category.tools.map((tool, index) => ({
              '@type': 'ListItem',
              'position': index + 1,
              'item': {
                '@type': 'SoftwareApplication',
                'name': tool.name,
                'description': tool.description,
                'url': `https://www.data-util.com${tool.route}`,
                'applicationCategory': 'UtilitiesApplication',
                'operatingSystem': 'Any',
                'offers': {
                  '@type': 'Offer',
                  'price': '0',
                  'priceCurrency': 'USD'
                }
              }
            }))
          }
        });
        } else {
          this.router.navigate(['/']);
        }
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
