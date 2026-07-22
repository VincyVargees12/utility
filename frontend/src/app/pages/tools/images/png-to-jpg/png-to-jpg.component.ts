import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type JpgQuality = 'normal' | 'high' | 'low';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-png-to-jpg',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './png-to-jpg.component.html',
  styleUrl: './png-to-jpg.component.scss'
})
export class PngToJpgComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  quality = signal<JpgQuality>('normal');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'PNG to JPG Converter - Free Online | DataUtil',
      description: 'Convert PNG images to JPG format with quality control. Reduce file size while maintaining image quality. Fast and free.',
      keywords: 'png to jpg, convert png to jpg, png to jpeg, image converter',
      ogTitle: 'PNG to JPG Converter - Free Online',
      ogDescription: 'Convert PNG images to JPG format instantly with customizable quality.',
      canonicalUrl: 'https://datautility.com/categories/images/png-to-jpg'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  async loadImages(files: File[]): Promise<void> {
    const validFiles = files.filter(f => f.type === 'image/png');
    if (validFiles.length === 0) {
      this.errorMessage.set('Please upload valid PNG files.');
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
          name: file.name.replace('.png', '.jpg'),
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
      case 'high':
        return 0.95;
      case 'low':
        return 0.75;
      default:
        return 0.85;
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
      const quality = this.getQualityValue();

      for (const img of this.images()) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;

        // Fill white background for transparency
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imageEl = new Image();
        await new Promise<void>((res, rej) => {
          imageEl.onload = () => res();
          imageEl.onerror = () => rej();
          imageEl.src = img.previewUrl;
        });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageEl, 0, 0, img.width, img.height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        if (multiple) {
          zip.file(img.name, bytes);
        } else {
          const blob = new Blob([bytes], { type: 'image/jpeg' });
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
      this.errorMessage.set('Failed to convert PNG to JPG. Please try again.');
      this.state.set('configure');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.quality.set('normal');
    this.state.set('upload');
  }
}
