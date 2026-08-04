import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { FLIP_IMAGE_RESOURCE_CONTENT } from './flip-image.resource-content';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type FlipDirection = 'horizontal' | 'vertical';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
  flipped: {
    horizontal: boolean;
    vertical: boolean;
  };
}

@Component({
  selector: 'app-flip-image',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './flip-image.component.html',
  styleUrl: './flip-image.component.scss'
})
export class FlipImageComponent implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = FLIP_IMAGE_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Flip Image - Mirror images horizontally or vertically | DataUtil',
      description: 'Flip images horizontally or vertically. Mirror effect tool for JPG, PNG, GIF and WebP. 100% free.',
      keywords: 'flip image, mirror image, flip horizontally, flip vertically, flip photo',
      ogTitle: 'Flip Image - Free Online Image Flipper',
      ogDescription: 'Flip images horizontally or vertically. Create mirror effects instantly.',
      canonicalUrl: 'https://www.data-util.com/categories/images/flip-image'
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
          width: dimensions.width,
          height: dimensions.height,
          flipped: {
            horizontal: false,
            vertical: false
          }
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

  flipImageHorizontal(imageId: string): void {
    this.images.update(imgs =>
      imgs.map(img =>
        img.id === imageId
          ? { ...img, flipped: { ...img.flipped, horizontal: !img.flipped.horizontal } }
          : img
      )
    );
  }

  flipImageVertical(imageId: string): void {
    this.images.update(imgs =>
      imgs.map(img =>
        img.id === imageId
          ? { ...img, flipped: { ...img.flipped, vertical: !img.flipped.vertical } }
          : img
      )
    );
  }

  flipAllHorizontal(): void {
    this.images.update(imgs =>
      imgs.map(img => ({
        ...img,
        flipped: { ...img.flipped, horizontal: !img.flipped.horizontal }
      }))
    );
  }

  flipAllVertical(): void {
    this.images.update(imgs =>
      imgs.map(img => ({
        ...img,
        flipped: { ...img.flipped, vertical: !img.flipped.vertical }
      }))
    );
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

        // Apply transformations
        if (img.flipped.horizontal || img.flipped.vertical) {
          ctx.save();

          if (img.flipped.horizontal) {
            ctx.scale(-1, 1);
            ctx.translate(-img.width, 0);
          }

          if (img.flipped.vertical) {
            ctx.scale(1, -1);
            ctx.translate(0, -img.height);
          }

          ctx.drawImage(imageEl, 0, 0, img.width, img.height);
          ctx.restore();
        } else {
          ctx.drawImage(imageEl, 0, 0, img.width, img.height);
        }

        const format = img.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'image/jpeg' ? 0.95 : undefined;

        const dataUrl = canvas.toDataURL(format, quality);
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Prefix "flipped_"
        const nameParts = img.name.split('.');
        const ext = nameParts.pop() || '';
        const base = nameParts.join('.');
        const newName = `${base}_flipped.${ext}`;

        if (multiple) {
          zip.file(newName, bytes);
        } else {
          const blob = new Blob([bytes], { type: format });
          singleBlobUrl = window.URL.createObjectURL(blob);
          singleFileName = newName;
        }
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = 'flipped_images.zip';
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
      console.error('Flip error:', error);
      this.errorMessage.set('Failed to flip images. Please try again.');
      this.state.set('configure');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.state.set('upload');
  }
}
