import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type ImageQuality = 'low' | 'medium' | 'high';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-jpg-to-png',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent],
  templateUrl: './jpg-to-png.component.html',
  styleUrl: './jpg-to-png.component.scss'
})
export class JpgToPngComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  quality = signal<ImageQuality>('medium');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'JPG to PNG Converter - Free Online | DataUtil',
      description: 'Convert JPG images to PNG format with transparency support. Preserve image quality in lossless PNG format. Fast and free.',
      keywords: 'jpg to png, convert jpg to png, jpeg to png, image converter',
      ogTitle: 'JPG to PNG Converter - Free Online',
      ogDescription: 'Convert JPG images to PNG format instantly with full transparency support.',
      canonicalUrl: 'https://datautility.com/categories/images/jpg-to-png'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  async loadImages(files: File[]): Promise<void> {
    const validFiles = files.filter(f => f.type === 'image/jpeg' || f.type === 'image/jpg');
    if (validFiles.length === 0) {
      this.errorMessage.set('Please upload valid JPG files.');
      return;
    }

    this.errorMessage.set('');
    
    const newItems: ImageItem[] = [];
    for (const file of validFiles) {
      const url = window.URL.createObjectURL(file);
      try {
        const dimensions = await this.getImageDimensions(url);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name.replace(/\.(jpg|jpeg)$/i, '.png'),
          previewUrl: url,
          width: dimensions.width,
          height: dimensions.height
        });
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }

    this.images.set([...this.images(), ...newItems]);
    this.state.set('configure');
  }

  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = url;
    });
  }

  removeImage(id: string, event: Event): void {
    event.stopPropagation();
    const updated = this.images().filter(img => {
      if (img.id === id) {
        window.URL.revokeObjectURL(img.previewUrl);
        return false;
      }
      return true;
    });
    this.images.set(updated);

    if (updated.length === 0) {
      this.state.set('upload');
    }
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.loadImages(Array.from(input.files));
    }
  }

  private getQualityValue(): number {
    switch (this.quality()) {
      case 'low':
        return 0.6;
      case 'high':
        return 0.95;
      default:
        return 0.8;
    }
  }

  async processImages(): Promise<void> {
    if (this.images().length === 0) return;

    this.state.set('processing');
    this.errorMessage.set('');
    this.isProcessing.set(true);

    try {
      if (typeof window === 'undefined') throw new Error('Browser only');

      let JSZip;
      let zip: any;
      const multiple = this.images().length > 1;

      if (multiple) {
        JSZip = (await import('jszip')).default;
        zip = new JSZip();
      }

      let singleBlobUrl: string | null = null;
      let singleFileName: string | null = null;

      for (const img of this.images()) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;

        const imageEl = new Image();
        await new Promise<void>((res, rej) => {
          imageEl.onload = () => res();
          imageEl.onerror = () => rej();
          imageEl.src = img.previewUrl;
        });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageEl, 0, 0, img.width, img.height);

        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        if (multiple) {
          zip.file(img.name, bytes);
        } else {
          const blob = new Blob([bytes], { type: 'image/png' });
          singleBlobUrl = window.URL.createObjectURL(blob);
          singleFileName = img.name;
        }
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = 'converted_images.zip';
      } else {
        dlUrl = singleBlobUrl!;
        dlName = singleFileName!;
      }

      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = dlName;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(dlUrl);
      }, 100);

      this.state.set('complete');
    } catch (error: any) {
      console.error('Conversion error:', error);
      this.errorMessage.set('Failed to convert JPG to PNG. Please try again.');
      this.state.set('configure');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.quality.set('medium');
    this.state.set('upload');
  }
}
