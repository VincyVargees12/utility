import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TOOLS_REGISTRY, ToolItem } from '../../data/tools.data';

@Component({
  selector: 'app-related-tools',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './related-tools.component.html',
  styleUrl: './related-tools.component.scss'
})
export class RelatedToolsComponent implements OnInit {
  @Input() currentRoute!: string;
  @Input() maxTools: number = 6;

  relatedTools = signal<ToolItem[]>([]);

  ngOnInit(): void {
    this.loadRelatedTools();
  }

  private loadRelatedTools(): void {
    // Extract category and tool ID from current route
    // e.g., '/categories/developer/json-formatter' -> category: 'developer', toolId: 'json-formatter'
    const routeParts = this.currentRoute.split('/').filter(Boolean);
    if (routeParts.length < 3 || routeParts[0] !== 'categories') {
      return;
    }

    const categoryId = routeParts[1];
    const currentToolId = routeParts[2];

    // Get all tools from the same category
    const category = TOOLS_REGISTRY[categoryId];
    if (!category) {
      return;
    }

    // Filter out the current tool and get related tools
    let related = category.tools.filter(tool => tool.id !== currentToolId);

    // If we don't have enough tools in the same category, add tools from related categories
    if (related.length < this.maxTools) {
      const otherTools = this.getToolsFromOtherCategories(categoryId, currentToolId);
      related = [...related, ...otherTools];
    }

    // Limit to maxTools
    this.relatedTools.set(related.slice(0, this.maxTools));
  }

  private getToolsFromOtherCategories(excludeCategoryId: string, excludeToolId: string): ToolItem[] {
    const tools: ToolItem[] = [];

    // Define related category mappings
    const relatedCategories: Record<string, string[]> = {
      'pdf': ['images', 'text'],
      'images': ['pdf', 'developer'],
      'text': ['developer', 'pdf'],
      'developer': ['text', 'pdf']
    };

    const relatedCategoryIds = relatedCategories[excludeCategoryId] || [];

    for (const catId of relatedCategoryIds) {
      const category = TOOLS_REGISTRY[catId];
      if (category) {
        // Take up to 2 tools from each related category
        const categoryTools = category.tools
          .filter(tool => tool.id !== excludeToolId)
          .slice(0, 2);
        tools.push(...categoryTools);
      }
    }

    return tools;
  }
}
