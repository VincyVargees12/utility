import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TrendingTool {
  name: string;
  description: string;
  icon: string;
  usageCount: string;
  category: string;
  route: string;
}

@Component({
  selector: 'app-trending-tools',
  imports: [CommonModule, RouterLink],
  templateUrl: './trending-tools.component.html',
  styleUrl: './trending-tools.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendingToolsComponent {
  protected readonly tools: TrendingTool[] = [
    {
      name: 'JSON Formatter',
      description: 'Format and beautify JSON data instantly',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      usageCount: '1.2M',
      category: 'Developer',
      route: '/categories/developer/json-formatter'
    },
    {
      name: 'PDF Merge',
      description: 'Combine multiple PDF files into one',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      usageCount: '980K',
      category: 'PDF',
      route: '/categories/pdf/merge-pdf'
    },
    {
      name: 'Image Compressor',
      description: 'Reduce image size without losing quality',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      usageCount: '850K',
      category: 'Image',
      route: '/categories/images/compress-image'
    },
    {
      name: 'Word Counter',
      description: 'Count words, characters and paragraphs',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      usageCount: '650K',
      category: 'Text',
      route: '/categories/text/word-counter'
    },
    {
      name: 'Unlock PDF',
      description: 'Remove PDF password security',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      usageCount: '470K',
      category: 'PDF',
      route: '/categories/pdf/unlock-pdf'
    },
    {
      name: 'Base64 Encoder',
      description: 'Encode and decode Base64 strings',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      usageCount: '580K',
      category: 'Developer',
      route: '/categories/developer/base64'
    }
  ];
}
