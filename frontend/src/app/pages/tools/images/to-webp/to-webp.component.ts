import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
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
  selector: 'app-to-webp',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './to-webp.component.html',
  styleUrl: './to-webp.component.scss'
})
export class ToWebpComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  quality = signal<ImageQuality>('high');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Convert to WebP - Free Online Image Converter | DataUtil',
      description: 'Convert any image format (JPG, PNG, GIF, BMP) to WebP. Reduce file size by up to 80% with superior compression. Free and fast.',
      keywords: 'convert to webp, jpg to webp, png to webp, webp converter, image compression',
      ogTitle: 'Convert to WebP - Free Online Image Converter',
      ogDescription: 'Convert any image format to WebP instantly with quality control. Compress images up to 80% smaller.',
      canonicalUrl: 'https://datautility.com/categories/images/to-webp'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  async loadImages(files: File[]): Promise<void> {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      this.errorMessage.set('Please upload valid image files (JPG, PNG, GIF, BMP, etc.).');
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
          name: file.name.replace(/\.[^/.]+$/, '.webp'),
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
      case 'medium':
        return 0.8;
      case 'high':
        return 0.95;
      default:
        return 0.95;
    }
  }

  async convertImages(): Promise<void> {
    this.isProcessing.set(true);

    try {
      const convertedImages = await Promise.all(
        this.images().map(img => this.convertToWebP(img))
      );

      // Download files
      if (convertedImages.length === 1) {
        this.downloadFile(convertedImages[0].blob, convertedImages[0].name);
      } else {
        // For multiple images, download as ZIP
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        convertedImages.forEach(img => {
          zip.file(img.name, img.blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        this.downloadFile(zipBlob, 'images.zip');
      }

      this.state.set('complete');
    } catch (error) {
      console.error('Conversion error:', error);
      this.errorMessage.set('Failed to convert images. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async convertToWebP(img: ImageItem): Promise<{ blob: Blob; name: string }> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, name: img.name });
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          'image/webp',
          this.getQualityValue()
        );
      };
      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = img.previewUrl;
    });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  reset(): void {
    this.images().forEach(img => {
      window.URL.revokeObjectURL(img.previewUrl);
    });
    this.images.set([]);
    this.state.set('upload');
    this.errorMessage.set('');
  }
}
