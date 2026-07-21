import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'processing' | 'configure' | 'complete';
type BackgroundType = 'transparent' | 'color' | 'blur' | 'image';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalUrl: string;
  removedBgUrl: string;
  processedUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-remove-background',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './remove-background.component.html',
  styleUrl: './remove-background.component.scss'
})
export class RemoveBackgroundComponent implements OnInit {
  private seoService = inject(SeoService);

  // Component state
  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);
  processingProgress = signal<string>('');

  images = signal<ImageItem[]>([]);
  backgroundType = signal<BackgroundType>('transparent');

  // Color background settings
  backgroundColor = signal<string>('#ffffff');
  presetColors = ['transparent', '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', 
                  '#ffa500', '#800080', '#008080', '#ffc0cb', '#a52a2a', '#808080'];

  // Blur background settings
  blurAmount = signal<number>(10);

  // Image background settings
  backgroundImageFile = signal<File | null>(null);
  backgroundImagePreview = signal<string>('');
  bgImageScale = signal<number>(100);
  bgImagePositionX = signal<number>(50);
  bgImagePositionY = signal<number>(50);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Remove Background from Image - Free Online Tool | Utility',
      description: 'Remove background from images instantly. Add blur, solid color, or custom image backgrounds. Easy-to-use online background remover.',
      keywords: 'remove background, background remover, transparent background, blur background, change background'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  async loadImages(files: File[]): Promise<void> {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.errorMessage.set('Please select valid image files');
      return;
    }

    this.errorMessage.set('');
    this.state.set('processing');
    this.processingProgress.set('Removing backgrounds...');

    try {
      const loadedImages: ImageItem[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        this.processingProgress.set(`Processing ${i + 1} of ${imageFiles.length}...`);

        const originalUrl = URL.createObjectURL(file);
        
        // Remove background
        const removedBgBlob = await this.removeBackground(file);
        const removedBgUrl = URL.createObjectURL(removedBgBlob);

        // Load image to get dimensions
        const img = await this.loadImage(originalUrl);

        const imageItem: ImageItem = {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          originalUrl,
          removedBgUrl,
          processedUrl: removedBgUrl,
          width: img.width,
          height: img.height
        };

        loadedImages.push(imageItem);
      }

      this.images.set(loadedImages);
      this.state.set('configure');
    } catch (error) {
      console.error('Error processing images:', error);
      this.errorMessage.set('Failed to remove backgrounds. Please try again.');
      this.state.set('upload');
    }
  }

  private async removeBackground(file: File): Promise<Blob> {
    // Dynamic import of background removal library
    const { removeBackground } = await import('@imgly/background-removal');
    
    const blob = await removeBackground(file, {
      progress: (key, current, total) => {
        const percentage = Math.round((current / total) * 100);
        this.processingProgress.set(`Removing background... ${percentage}%`);
      }
    });

    return blob;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  async applyBackgroundChanges(): Promise<void> {
    this.isProcessing.set(true);
    
    try {
      const updatedImages = await Promise.all(
        this.images().map(async (img) => {
          const processedUrl = await this.processImage(img);
          return { ...img, processedUrl };
        })
      );

      this.images.set(updatedImages);
    } catch (error) {
      console.error('Error applying background:', error);
      this.errorMessage.set('Failed to apply background. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async processImage(img: ImageItem): Promise<string> {
    const bgType = this.backgroundType();

    if (bgType === 'transparent') {
      return img.removedBgUrl;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Load the image with removed background
    const removedBgImage = await this.loadImage(img.removedBgUrl);
    canvas.width = removedBgImage.width;
    canvas.height = removedBgImage.height;

    // Apply background based on type
    if (bgType === 'color') {
      ctx.fillStyle = this.backgroundColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'blur') {
      // Draw original image with blur
      const originalImage = await this.loadImage(img.originalUrl);
      ctx.filter = `blur(${this.blurAmount()}px)`;
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    } else if (bgType === 'image' && this.backgroundImageFile()) {
      // Draw custom background image
      const bgImage = await this.loadImage(this.backgroundImagePreview());
      
      const scale = this.bgImageScale() / 100;
      const bgWidth = canvas.width * scale;
      const bgHeight = canvas.height * scale;
      
      const posX = (canvas.width - bgWidth) * (this.bgImagePositionX() / 100);
      const posY = (canvas.height - bgHeight) * (this.bgImagePositionY() / 100);
      
      ctx.drawImage(bgImage, posX, posY, bgWidth, bgHeight);
    }

    // Draw the image with removed background on top
    ctx.drawImage(removedBgImage, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob!));
      }, 'image/png', 1.0);
    });
  }

  onBackgroundImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      this.backgroundImageFile.set(file);
      this.backgroundImagePreview.set(URL.createObjectURL(file));
      this.applyBackgroundChanges();
    }
  }

  removeBackgroundImage(): void {
    if (this.backgroundImagePreview()) {
      URL.revokeObjectURL(this.backgroundImagePreview());
    }
    this.backgroundImageFile.set(null);
    this.backgroundImagePreview.set('');
    this.applyBackgroundChanges();
  }

  selectPresetColor(color: string): void {
    if (color === 'transparent') {
      this.backgroundType.set('transparent');
    } else {
      this.backgroundColor.set(color);
    }
    this.applyBackgroundChanges();
  }

  async downloadImages(): Promise<void> {
    this.isProcessing.set(true);

    try {
      if (this.images().length === 1) {
        // Single image download
        const img = this.images()[0];
        const response = await fetch(img.processedUrl);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${img.name.replace(/\.[^/.]+$/, '')}_no-bg.png`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        // Multiple images - create ZIP
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        for (const img of this.images()) {
          const response = await fetch(img.processedUrl);
          const blob = await response.blob();
          zip.file(`${img.name.replace(/\.[^/.]+$/, '')}_no-bg.png`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'removed-backgrounds.zip';
        link.click();
        URL.revokeObjectURL(link.href);
      }

      this.state.set('complete');
    } catch (error) {
      console.error('Error downloading images:', error);
      this.errorMessage.set('Failed to download images. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    // Clean up URLs
    this.images().forEach(img => {
      URL.revokeObjectURL(img.originalUrl);
      URL.revokeObjectURL(img.removedBgUrl);
      if (img.processedUrl !== img.removedBgUrl) {
        URL.revokeObjectURL(img.processedUrl);
      }
    });

    if (this.backgroundImagePreview()) {
      URL.revokeObjectURL(this.backgroundImagePreview());
    }

    this.images.set([]);
    this.state.set('upload');
    this.errorMessage.set('');
    this.backgroundType.set('transparent');
    this.backgroundImageFile.set(null);
    this.backgroundImagePreview.set('');
  }
}
