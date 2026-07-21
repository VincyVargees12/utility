import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type WatermarkType = 'text' | 'image';
type TextPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-watermark',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './watermark.component.html',
  styleUrl: './watermark.component.scss'
})
export class WatermarkComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  watermarkType = signal<WatermarkType>('text');
  
  // Text watermark settings
  watermarkText = signal<string>('© 2024');
  textColor = signal<string>('#ffffff');
  textSize = signal<number>(48);
  textOpacity = signal<number>(0.8);
  textPosition = signal<TextPosition>('bottom-right');
  textRotation = signal<number>(0);
  fontFamily = signal<string>('Arial');
  
  // Image watermark settings
  watermarkImageFile = signal<File | null>(null);
  watermarkImagePreview = signal<string>('');
  imageOpacity = signal<number>(0.7);
  imageSize = signal<number>(20);
  imagePosition = signal<TextPosition>('bottom-right');
  imageRotation = signal<number>(0);

  // Preview modal
  previewImage = signal<ImageItem | null>(null);
  previewCanvasUrl = signal<string>('');
  isGeneratingPreview = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Add Watermark to Images - Free Online | DataUtil',
      description: 'Add text or image watermarks to your images to protect your content. Customize position, size, color, and opacity. Batch process multiple images.',
      keywords: 'watermark image, add watermark, text watermark, image protection',
      ogTitle: 'Add Watermark to Images - Free Online',
      ogDescription: 'Easily add text or image watermarks to protect your images online.',
      canonicalUrl: 'https://datautility.com/categories/images/watermark'
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
      this.errorMessage.set('Please upload valid image files.');
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

  onWatermarkImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.watermarkImageFile.set(file);
      const url = window.URL.createObjectURL(file);
      this.watermarkImagePreview.set(url);
    }
  }

  removeWatermarkImage(): void {
    if (this.watermarkImagePreview()) {
      window.URL.revokeObjectURL(this.watermarkImagePreview());
    }
    this.watermarkImageFile.set(null);
    this.watermarkImagePreview.set('');
  }

  async showPreview(img: ImageItem): Promise<void> {
    this.previewImage.set(img);
    await this.generatePreview(img);
  }

  closePreview(): void {
    if (this.previewCanvasUrl()) {
      window.URL.revokeObjectURL(this.previewCanvasUrl());
    }
    this.previewImage.set(null);
    this.previewCanvasUrl.set('');
  }

  async generatePreview(img: ImageItem): Promise<void> {
    if (!img) return;
    
    this.isGeneratingPreview.set(true);
    
    try {
      // Clean up previous preview
      if (this.previewCanvasUrl()) {
        window.URL.revokeObjectURL(this.previewCanvasUrl());
      }

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Draw original image
      const imageEl = new Image();
      await new Promise<void>((res, rej) => {
        imageEl.onload = () => res();
        imageEl.onerror = () => rej();
        imageEl.src = img.previewUrl;
      });

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageEl, 0, 0, img.width, img.height);

      // Add watermark
      if (this.watermarkType() === 'text') {
        await this.addTextWatermark(canvas, ctx);
      } else if (this.watermarkType() === 'image' && this.watermarkImageFile()) {
        // Load watermark image
        const watermarkImg = new Image();
        await new Promise<void>((res, rej) => {
          watermarkImg.onload = () => res();
          watermarkImg.onerror = () => rej();
          watermarkImg.src = this.watermarkImagePreview();
        });
        await this.addImageWatermark(canvas, ctx, watermarkImg);
      }

      // Convert canvas to blob URL
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          },
          'image/png',
          1.0
        );
      });

      const url = window.URL.createObjectURL(blob);
      this.previewCanvasUrl.set(url);
    } catch (error) {
      console.error('Preview generation error:', error);
    } finally {
      this.isGeneratingPreview.set(false);
    }
  }

  async refreshPreview(): Promise<void> {
    const img = this.previewImage();
    if (img) {
      await this.generatePreview(img);
    }
  }

  private getTextPositionCoordinates(
    canvasWidth: number,
    canvasHeight: number,
    textMetrics: TextMetrics
  ): { x: number; y: number } {
    const padding = 20;
    const textWidth = textMetrics.width;
    const textHeight = this.textSize();

    switch (this.textPosition()) {
      case 'top-left':
        return { x: padding, y: padding + textHeight };
      case 'top-center':
        return { x: canvasWidth / 2 - textWidth / 2, y: padding + textHeight };
      case 'top-right':
        return { x: canvasWidth - textWidth - padding, y: padding + textHeight };
      case 'center-left':
        return { x: padding, y: canvasHeight / 2 + textHeight / 2 };
      case 'center':
        return { x: canvasWidth / 2 - textWidth / 2, y: canvasHeight / 2 + textHeight / 2 };
      case 'center-right':
        return { x: canvasWidth - textWidth - padding, y: canvasHeight / 2 + textHeight / 2 };
      case 'bottom-left':
        return { x: padding, y: canvasHeight - padding };
      case 'bottom-center':
        return { x: canvasWidth / 2 - textWidth / 2, y: canvasHeight - padding };
      case 'bottom-right':
        return { x: canvasWidth - textWidth - padding, y: canvasHeight - padding };
      default:
        return { x: padding, y: canvasHeight - padding };
    }
  }

  private getImagePositionCoordinates(
    canvasWidth: number,
    canvasHeight: number,
    imgWidth: number,
    imgHeight: number
  ): { x: number; y: number } {
    const padding = 20;

    switch (this.imagePosition()) {
      case 'top-left':
        return { x: padding, y: padding };
      case 'top-center':
        return { x: canvasWidth / 2 - imgWidth / 2, y: padding };
      case 'top-right':
        return { x: canvasWidth - imgWidth - padding, y: padding };
      case 'center-left':
        return { x: padding, y: canvasHeight / 2 - imgHeight / 2 };
      case 'center':
        return { x: canvasWidth / 2 - imgWidth / 2, y: canvasHeight / 2 - imgHeight / 2 };
      case 'center-right':
        return { x: canvasWidth - imgWidth - padding, y: canvasHeight / 2 - imgHeight / 2 };
      case 'bottom-left':
        return { x: padding, y: canvasHeight - imgHeight - padding };
      case 'bottom-center':
        return { x: canvasWidth / 2 - imgWidth / 2, y: canvasHeight - imgHeight - padding };
      case 'bottom-right':
        return { x: canvasWidth - imgWidth - padding, y: canvasHeight - imgHeight - padding };
      default:
        return { x: padding, y: canvasHeight - imgHeight - padding };
    }
  }

  private async addTextWatermark(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    ctx.save();
    
    ctx.font = `${this.textSize()}px ${this.fontFamily()}`;
    ctx.fillStyle = this.textColor();
    ctx.globalAlpha = this.textOpacity();

    const textMetrics = ctx.measureText(this.watermarkText());
    const coords = this.getTextPositionCoordinates(canvas.width, canvas.height, textMetrics);

    // Apply rotation if specified
    if (this.textRotation() !== 0) {
      ctx.translate(coords.x, coords.y);
      ctx.rotate((this.textRotation() * Math.PI) / 180);
      ctx.fillText(this.watermarkText(), 0, 0);
    } else {
      ctx.fillText(this.watermarkText(), coords.x, coords.y);
    }
    
    ctx.restore();
  }

  private async addImageWatermark(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    watermarkImg: HTMLImageElement
  ): Promise<void> {
    ctx.save();
    
    const maxSize = Math.min(canvas.width, canvas.height) * (this.imageSize() / 100);
    const ratio = watermarkImg.width / watermarkImg.height;
    const imgWidth = maxSize;
    const imgHeight = maxSize / ratio;

    const coords = this.getImagePositionCoordinates(canvas.width, canvas.height, imgWidth, imgHeight);

    ctx.globalAlpha = this.imageOpacity();
    
    // Apply rotation if specified
    if (this.imageRotation() !== 0) {
      ctx.translate(coords.x + imgWidth / 2, coords.y + imgHeight / 2);
      ctx.rotate((this.imageRotation() * Math.PI) / 180);
      ctx.drawImage(watermarkImg, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    } else {
      ctx.drawImage(watermarkImg, coords.x, coords.y, imgWidth, imgHeight);
    }
    
    ctx.restore();
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

      // Load watermark image if using image watermark
      let watermarkImg: HTMLImageElement | null = null;
      if (this.watermarkType() === 'image' && this.watermarkImageFile()) {
        watermarkImg = new Image();
        await new Promise<void>((res, rej) => {
          watermarkImg!.onload = () => res();
          watermarkImg!.onerror = () => rej();
          watermarkImg!.src = this.watermarkImagePreview();
        });
      }

      for (const img of this.images()) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;

        // Draw original image
        const imageEl = new Image();
        await new Promise<void>((res, rej) => {
          imageEl.onload = () => res();
          imageEl.onerror = () => rej();
          imageEl.src = img.previewUrl;
        });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageEl, 0, 0, img.width, img.height);

        // Add watermark
        if (this.watermarkType() === 'text') {
          await this.addTextWatermark(canvas, ctx);
        } else if (this.watermarkType() === 'image' && watermarkImg) {
          await this.addImageWatermark(canvas, ctx, watermarkImg);
        }

        // Convert to blob with high quality
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error('Failed to create blob'));
            },
            'image/png',
            1.0
          );
        });

        if (multiple) {
          zip.file(img.name, blob);
        } else {
          singleBlobUrl = window.URL.createObjectURL(blob);
          singleFileName = img.name;
        }
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = 'watermarked_images.zip';
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
      console.error('Watermark error:', error);
      this.errorMessage.set('Failed to add watermark. Please try again.');
      this.state.set('configure');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.watermarkType.set('text');
    this.watermarkText.set('© 2024');
    this.textColor.set('#ffffff');
    this.textSize.set(48);
    this.textOpacity.set(0.8);
    this.textPosition.set('bottom-right');
    this.textRotation.set(0);
    this.fontFamily.set('Arial');
    this.imageRotation.set(0);
    this.removeWatermarkImage();
    this.state.set('upload');
  }
}
