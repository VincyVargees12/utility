import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type ResizeMode = 'pixels' | 'percentage';
type PercentageOption = 25 | 50 | 75;

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-resize-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './resize-image.component.html',
  styleUrl: './resize-image.component.scss'
})
export class ResizeImageComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');

  images = signal<ImageItem[]>([]);
  
  // Configuration
  resizeMode = signal<ResizeMode>('pixels');
  
  // Pixels configuration
  targetWidth = signal<number | null>(null);
  targetHeight = signal<number | null>(null);
  maintainRatio = signal<boolean>(true);
  doNotEnlarge = signal<boolean>(false);
  
  // Percentage configuration
  percentage = signal<PercentageOption>(50);

  hasDifferentSizes = computed(() => {
    const imgs = this.images();
    if (imgs.length <= 1) return false;
    const first = imgs[0];
    return imgs.some(img => img.width !== first.width || img.height !== first.height);
  });

  showInfoModal = signal<boolean>(false);

  // When changing inputs, update the other dimension if maintaining ratio
  onWidthChange(val: number | null) {
    this.targetWidth.set(val);
    if (this.maintainRatio() && val !== null && this.images().length > 0 && !this.hasDifferentSizes()) {
      const first = this.images()[0];
      const ratio = first.height / first.width;
      this.targetHeight.set(Math.round(val * ratio));
    }
  }

  onHeightChange(val: number | null) {
    this.targetHeight.set(val);
    if (this.maintainRatio() && val !== null && this.images().length > 0 && !this.hasDifferentSizes()) {
      const first = this.images()[0];
      const ratio = first.width / first.height;
      this.targetWidth.set(Math.round(val * ratio));
    }
  }

  onMaintainRatioChange(val: boolean) {
    this.maintainRatio.set(val);
    if (val && this.targetWidth() !== null && this.images().length > 0 && !this.hasDifferentSizes()) {
       this.onWidthChange(this.targetWidth());
    }
  }

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Resize Image - Change dimensions in bulk | DataUtil',
      description: 'Resize JPG, PNG, SVG or GIF by defining new height and width pixels. Change image dimensions in bulk online for free.',
      keywords: 'resize image, change image size, bulk image resizer, scale image',
      ogTitle: 'Resize Image - Bulk Image Resizer Online',
      ogDescription: 'Resize multiple images at once by defining new pixels or percentages.',
      canonicalUrl: 'https://datautility.com/categories/images/resize-image'
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
      this.errorMessage.set('Please upload valid image files (JPG, PNG, WebP).');
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
          width: dimensions.width,
          height: dimensions.height
        });
      } catch (err) {
        console.error('Failed to get dimensions for', file.name);
      }
    }

    const current = this.images();
    const updated = [...current, ...newItems];
    this.images.set(updated);
    
    if (updated.length > 0 && current.length === 0) {
      // Set initial target based on first image
      this.targetWidth.set(updated[0].width);
      this.targetHeight.set(updated[0].height);
    }
    
    if (this.state() === 'upload') {
      this.state.set('configure');
    }
  }

  private getImageDimensions(url: string): Promise<{width: number, height: number}> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    });
  }

  removeImage(id: string, event: Event) {
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
    } else if (updated.length > 0 && id === this.images()[0].id) {
       // if first image removed, update defaults maybe
       this.targetWidth.set(updated[0].width);
       this.targetHeight.set(updated[0].height);
    }
  }

  // Calculate specific target dimensions for an image
  getCalculatedDimensions(img: ImageItem): { width: number, height: number } {
    if (this.resizeMode() === 'percentage') {
      const scale = (100 - this.percentage()) / 100; // e.g. 50% smaller -> 50% of original -> 0.5
      return {
        width: Math.max(1, Math.round(img.width * scale)),
        height: Math.max(1, Math.round(img.height * scale))
      };
    } else {
      let w = this.targetWidth() || img.width;
      let h = this.targetHeight() || img.height;

      if (this.maintainRatio()) {
        const frameW = this.targetWidth() || img.width;
        const frameH = this.targetHeight() || img.height;
        let scale = Math.min(frameW / img.width, frameH / img.height);
        
        if (this.doNotEnlarge() && scale > 1) {
          scale = 1;
        }
        
        w = Math.round(img.width * scale);
        h = Math.round(img.height * scale);
      } else {
        if (this.doNotEnlarge()) {
          if (w > img.width) w = img.width;
          if (h > img.height) h = img.height;
        }
      }

      return { width: Math.max(1, w), height: Math.max(1, h) };
    }
  }

  async processResize(): Promise<void> {
    if (this.images().length === 0) return;

    this.state.set('processing');
    this.errorMessage.set('');

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
        const { width, height } = this.getCalculatedDimensions(img);
        
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d')!;

        // Draw image onto canvas
        const imageEl = new Image();
        await new Promise((res, rej) => {
          imageEl.onload = res;
          imageEl.onerror = rej;
          imageEl.src = img.previewUrl;
        });

        // Use good smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageEl, 0, 0, width, height);

        // Convert back to format
        const format = img.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'image/jpeg' ? 0.92 : undefined;
        
        const dataUrl = canvas.toDataURL(format, quality);
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        if (multiple) {
           zip.file(img.name, bytes);
        } else {
           const blob = new Blob([bytes], { type: format });
           singleBlobUrl = window.URL.createObjectURL(blob);
           singleFileName = img.name;
        }
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = 'resized_images.zip';
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
      console.error('Resize error:', error);
      this.errorMessage.set('Failed to resize images. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processResize();
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.loadImages(Array.from(input.files));
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.loadImages(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.resizeMode.set('pixels');
    this.percentage.set(50);
    this.state.set('upload');
  }
}
