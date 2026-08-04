import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { ROTATE_IMAGE_RESOURCE_CONTENT } from './rotate-image.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type RotationAngle = 90 | 180 | 270;

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  rotation: number; // in degrees
  width: number;
  height: number;
}

@Component({
  selector: 'app-rotate-image',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './rotate-image.component.html',
  styleUrl: './rotate-image.component.scss'
})
export class RotateImageComponent implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = ROTATE_IMAGE_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  images = signal<ImageItem[]>([]);
  isProcessing = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Rotate Image - Free Online Image Rotation Tool | DataUtil',
      description: 'Rotate images by 90°, 180°, 270° or any custom angle. Support for JPG, PNG, WebP and GIF. Fast and free.',
      keywords: 'rotate image, image rotation, rotate photo, flip image, turn image',
      ogTitle: 'Rotate Image - Free Online Image Rotation Tool',
      ogDescription: 'Rotate images by any angle. Quick 90° rotation or custom angles. 100% free.',
      canonicalUrl: 'https://datautility.com/categories/images/rotate-image'
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
      this.errorMessage.set('Please upload valid image files (JPG, PNG, WebP, GIF).');
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
          name: file.name,
          previewUrl: url,
          rotation: 0,
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

  getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = url;
    });
  }

  rotateImageRight(imageId: string): void {
    this.images.update(imgs => 
      imgs.map(img => img.id === imageId ? { ...img, rotation: (img.rotation + 90) % 360 } : img)
    );
  }

  rotateImageLeft(imageId: string): void {
    this.images.update(imgs => 
      imgs.map(img => img.id === imageId ? { ...img, rotation: (img.rotation - 90 + 360) % 360 } : img)
    );
  }

  rotateRight(): void {
    this.images.update(imgs => 
      imgs.map(img => ({ ...img, rotation: (img.rotation + 90) % 360 }))
    );
  }

  rotateLeft(): void {
    this.images.update(imgs => 
      imgs.map(img => ({ ...img, rotation: (img.rotation - 90 + 360) % 360 }))
    );
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.loadImages(Array.from(input.files));
    }
  }

  removeImage(imageId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const imgs = this.images();
    const imageToRemove = imgs.find(img => img.id === imageId);
    if (imageToRemove) {
      window.URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    const updated = imgs.filter(img => img.id !== imageId);
    this.images.set(updated);
    if (updated.length === 0) {
      this.reset();
    }
  }

  async processImages(): Promise<void> {
    this.isProcessing.set(true);
    this.state.set('processing');

    try {
      const results: { blob: Blob; name: string }[] = [];

      for (const img of this.images()) {
        const rotatedBlob = await this.rotateImageFile(img);
        results.push({
          blob: rotatedBlob,
          name: this.getRotatedFileName(img.name)
        });
      }

      // Download all rotated images
      for (const result of results) {
        this.downloadFile(result.blob, result.name);
      }

      this.state.set('complete');
    } catch (error) {
      console.error('Error processing images:', error);
      this.errorMessage.set('An error occurred while rotating images. Please try again.');
      this.state.set('configure');
    } finally {
      this.isProcessing.set(false);
    }
  }

  async rotateImageFile(imageItem: ImageItem): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        const rotation = imageItem.rotation;
        
        // For 90 or 270 degrees, swap width and height
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Move to center, rotate, then draw
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          imageItem.file.type || 'image/png',
          0.95
        );
      };
      img.onerror = reject;
      img.src = imageItem.previewUrl;
    });
  }

  getRotatedFileName(originalName: string): string {
    const lastDot = originalName.lastIndexOf('.');
    if (lastDot === -1) return originalName + '-rotated';
    const name = originalName.substring(0, lastDot);
    const ext = originalName.substring(lastDot);
    return `${name}-rotated${ext}`;
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.state.set('upload');
    this.errorMessage.set('');
  }
}
