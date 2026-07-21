import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Category {
  name: string;
  icon: string;
  description: string;
  toolCount: number;
  color: string;
  route: string;
}

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  protected readonly categories: Category[] = [
    {
      name: 'PDF Tools',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      description: 'Merge, split, compress and convert PDF files',
      toolCount: 15,
      color: '#EF4444',
      route: '/categories/pdf'
    },
    {
      name: 'Text Tools',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      description: 'Format, count, and transform text easily',
      toolCount: 18,
      color: '#10B981',
      route: '/categories/text'
    },
    {
      name: 'Developer Tools',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      description: 'JSON, XML, Base64 and more dev utilities',
      toolCount: 27,
      color: '#3B82F6',
      route: '/categories/developer'
    },
    {
      name: 'Calculators',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      description: 'BMI, EMI, GST and various calculators',
      toolCount: 20,
      color: '#F59E0B',
      route: '/categories/calculators'
    },
    {
      name: 'Converters',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      description: 'Convert units, currency and measurements',
      toolCount: 16,
      color: '#06B6D4',
      route: '/categories/converters'
    },
    {
      name: 'QR Tools',
      icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
      description: 'Generate and scan QR codes instantly',
      toolCount: 8,
      color: '#EC4899',
      route: '/categories/qr'
    },
    {
      name: 'AI Tools',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      description: 'AI-powered tools for productivity',
      toolCount: 10,
      color: '#6366F1',
      route: '/categories/ai'
    },
    {
      name: 'Security Tools',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      description: 'Password generators and encryption tools',
      toolCount: 12,
      color: '#DC2626',
      route: '/categories/security'
    }
  ];
}
