import { Component, inject, OnInit, signal, effect, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { SeoService } from '../../../../services/seo.service';
import Cropper from 'cropperjs';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  originalWidth: number;
  originalHeight: number;
  cropData?: { x: number; y: number; width: number; height: number };
}

@Component({
  selector: 'app-crop-image',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './crop-image.component.html',
  styleUrl: './crop-image.component.scss'
})
export class CropImageComponent implements OnInit, OnDestroy {
  private seoService = inject(SeoService);

  @ViewChild('cropperImage') cropperImageRef!: ElementRef<HTMLImageElement>;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');

  images = signal<ImageItem[]>([]);
  activeImageId = signal<string | null>(null);

  // Expose current active crop dimensions so the UI sidebar can bind to it
  currentCropX = signal<number>(0);
  currentCropY = signal<number>(0);
  currentCropW = signal<number>(0);
  currentCropH = signal<number>(0);

  private cropper: any | null = null;
  private isUpdatingFromSidebar = false;

  constructor() {
    // When the active image changes, rebuild the cropper instance
    effect(() => {
      const activeId = this.activeImageId();
      if (this.state() === 'configure' && activeId) {
        // Need to wait out the current change cycle for the DOM image src to update
        setTimeout(() => this.initCropper(activeId), 0);
      }
    });
  }

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Crop Image - Crop JPG, PNG or GIF online | DataUtil',
      description: 'Crop your images online easily. Crop JPG, PNG, or GIF by defining a rectangle in pixels to remove unwanted areas.',
      keywords: 'crop image, image cropper, cut image, crop picture online',
      ogTitle: 'Crop Image - Free Online Image Cropper',
      ogDescription: 'Crop images by defining a perfect rectangle to cut out unwanted bounds.',
      canonicalUrl: 'https://datautility.com/categories/images/crop-image'
    });
  }

  ngOnDestroy(): void {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
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
          originalWidth: dimensions.width,
          originalHeight: dimensions.height
        });
      } catch (err) {
        console.error('Failed to get dimensions for', file.name);
      }
    }

    const current = this.images();
    const updated = [...current, ...newItems];
    this.images.set(updated);
    
    if (updated.length > 0 && current.length === 0) {
      this.activeImageId.set(updated[0].id);
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

  getActiveImage(): ImageItem | null {
    const id = this.activeImageId();
    if (!id) return null;
    return this.images().find(img => img.id === id) || null;
  }

  setActiveImage(id: string) {
    if (this.activeImageId() !== id) {
      this.saveCurrentCropData();
      this.activeImageId.set(id);
    }
  }

  removeImage(id: string, event: Event) {
    event.stopPropagation();
    
    if (this.activeImageId() === id) {
      this.saveCurrentCropData();
    }

    const updated = this.images().filter(img => {
      if (img.id === id) {
        window.URL.revokeObjectURL(img.previewUrl);
        return false;
      }
      return true;
    });
    this.images.set(updated);
    
    if (updated.length === 0) {
      this.activeImageId.set(null);
      this.state.set('upload');
    } else if (this.activeImageId() === id) {
      this.activeImageId.set(updated[0].id);
    }
  }

  private getCurrentCropData(): { x: number; y: number; width: number; height: number } | null {
    const selection = this.cropper?.getCropperSelection?.();
    if (!selection) return null;

    return {
      x: Math.round(selection.x ?? 0),
      y: Math.round(selection.y ?? 0),
      width: Math.round(selection.width ?? 0),
      height: Math.round(selection.height ?? 0)
    };
  }

  private syncSidebarFromSelection(data: { x: number; y: number; width: number; height: number }) {
    this.currentCropX.set(data.x);
    this.currentCropY.set(data.y);
    this.currentCropW.set(data.width);
    this.currentCropH.set(data.height);
  }

  private saveCurrentCropData() {
    if (this.cropper && this.activeImageId()) {
      const activeId = this.activeImageId();
      const cropData = this.getCurrentCropData();
      const updatedImages = this.images().map(img => 
        img.id === activeId ? { ...img, cropData: cropData ?? img.cropData } : img
      );
      this.images.set(updatedImages);
    }
  }

  private initCropper(activeId: string) {
    if (!this.cropperImageRef?.nativeElement) return;
    
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }

    const imgElement = this.cropperImageRef.nativeElement;
    const activeImage = this.images().find(img => img.id === activeId);

    this.cropper = new Cropper(imgElement, {
      viewMode: 1,
      dragMode: 'crop',
      background: true,
      autoCropArea: 0.8
    } as any);

    setTimeout(() => {
      const selection = this.cropper?.getCropperSelection?.();
      if (!selection) return;

      if (activeImage?.cropData) {
        this.isUpdatingFromSidebar = true;
        selection.$change(activeImage.cropData.x, activeImage.cropData.y, activeImage.cropData.width, activeImage.cropData.height, undefined, true);
        this.syncSidebarFromSelection(activeImage.cropData);
        this.isUpdatingFromSidebar = false;
      } else {
        const fallback = {
          x: 0,
          y: 0,
          width: imgElement.naturalWidth || imgElement.width || 0,
          height: imgElement.naturalHeight || imgElement.height || 0
        };
        this.syncSidebarFromSelection(fallback);
      }
    }, 0);
  }

  // Handle sidebar input changes
  onCropInputX(val: number) {
    this.currentCropX.set(val);
    this.updateCropperBox();
  }
  onCropInputY(val: number) {
    this.currentCropY.set(val);
    this.updateCropperBox();
  }
  onCropInputW(val: number) {
    this.currentCropW.set(val);
    this.updateCropperBox();
  }
  onCropInputH(val: number) {
    this.currentCropH.set(val);
    this.updateCropperBox();
  }

  private updateCropperBox() {
    const selection = this.cropper?.getCropperSelection?.();
    if (selection) {
      this.isUpdatingFromSidebar = true;
      selection.$change(
        this.currentCropX(),
        this.currentCropY(),
        this.currentCropW(),
        this.currentCropH(),
        undefined,
        true
      );
      this.isUpdatingFromSidebar = false;
    }
  }

  async processCrop(): Promise<void> {
    if (this.images().length === 0) return;

    this.saveCurrentCropData(); // ensures the active cropper pane is synced

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
        const cropBox = img.cropData || { x: 0, y: 0, width: img.originalWidth, height: img.originalHeight };
        
        const canvas = document.createElement('canvas');
        const imageEl = new Image();
        await new Promise((res, rej) => {
          imageEl.onload = res;
          imageEl.onerror = rej;
          imageEl.src = img.previewUrl;
        });

        const displayWidth = imageEl.clientWidth || imageEl.naturalWidth || imageEl.width || 1;
        const displayHeight = imageEl.clientHeight || imageEl.naturalHeight || imageEl.height || 1;
        const scaleX = (imageEl.naturalWidth || imageEl.width || 1) / displayWidth;
        const scaleY = (imageEl.naturalHeight || imageEl.height || 1) / displayHeight;

        const sourceX = Math.max(0, cropBox.x * scaleX);
        const sourceY = Math.max(0, cropBox.y * scaleY);
        const sourceWidth = Math.max(1, cropBox.width * scaleX);
        const sourceHeight = Math.max(1, cropBox.height * scaleY);

        canvas.width = Math.max(1, Math.round(sourceWidth));
        canvas.height = Math.max(1, Math.round(sourceHeight));
        const ctx = canvas.getContext('2d')!;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(
          imageEl,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        );

        const format = img.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'image/jpeg' ? 0.95 : undefined;
        
        const dataUrl = canvas.toDataURL(format, quality);
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Prefix "cropped_"
        const nameParts = img.name.split('.');
        const ext = nameParts.pop() || '';
        const base = nameParts.join('.');
        const newName = `${base}_cropped.${ext}`;

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
        dlName = 'cropped_images.zip';
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
      console.error('Crop error:', error);
      this.errorMessage.set('Failed to crop images. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processCrop();
  }

  reset(): void {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.activeImageId.set(null);
    this.state.set('upload');
  }
}
