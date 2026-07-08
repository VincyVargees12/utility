import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-tool-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="border-b border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <app-breadcrumb [items]="breadcrumbs"></app-breadcrumb>
      </div>
    </div>
    <div *ngIf="title" class="text-center py-10 px-4">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ title }}</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">{{ subtitle }}</p>
    </div>
  `,
})
export class ToolHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}
