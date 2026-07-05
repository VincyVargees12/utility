import { Component } from '@angular/core';
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
  styleUrl: './trending-tools.component.scss'
})
export class TrendingToolsComponent {
  protected readonly tools: TrendingTool[] = [
    {
      name: 'JSON Formatter',
      description: 'Format and beautify JSON data instantly',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      usageCount: '1.2M',
      category: 'Developer',
      route: '/tools/json-formatter'
    },
    {
      name: 'PDF Merge',
      description: 'Combine multiple PDF files into one',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      usageCount: '980K',
      category: 'PDF',
      route: '/tools/pdf-merge'
    },
    {
      name: 'Image Compressor',
      description: 'Reduce image size without losing quality',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      usageCount: '850K',
      category: 'Image',
      route: '/tools/image-compressor'
    },
    {
      name: 'QR Code Generator',
      description: 'Create custom QR codes for any URL',
      icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
      usageCount: '720K',
      category: 'QR',
      route: '/tools/qr-generator'
    },
    {
      name: 'Word Counter',
      description: 'Count words, characters and paragraphs',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      usageCount: '650K',
      category: 'Text',
      route: '/tools/word-counter'
    },
    {
      name: 'Base64 Encoder',
      description: 'Encode and decode Base64 strings',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      usageCount: '580K',
      category: 'Developer',
      route: '/tools/base64-encoder'
    }
  ];
}
