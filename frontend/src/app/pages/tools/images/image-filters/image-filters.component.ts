import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { IMAGE_FILTERS_RESOURCE_CONTENT } from './image-filters.resource-content';

type AppState = 'upload' | 'configure';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
}

interface FilterValues {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  invert: number;
  hueRotate: number;
  blur: number;
}

interface FilterPreset {
  id: string;
  name: string;
  values: FilterValues;
}

const DEFAULT_FILTERS: FilterValues = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
  blur: 0
};

const PRESETS: FilterPreset[] = [
  { id: 'original', name: 'Original', values: { ...DEFAULT_FILTERS } },
  { id: 'grayscale', name: 'Grayscale', values: { ...DEFAULT_FILTERS, grayscale: 100 } },
  { id: 'sepia', name: 'Sepia', values: { ...DEFAULT_FILTERS, sepia: 100 } },
  { id: 'noir', name: 'Noir', values: { ...DEFAULT_FILTERS, grayscale: 100, contrast: 130, brightness: 90 } },
  { id: 'vintage', name: 'Vintage', values: { ...DEFAULT_FILTERS, sepia: 50, contrast: 90, brightness: 105, saturate: 80 } },
  { id: 'cool', name: 'Cool', values: { ...DEFAULT_FILTERS, hueRotate: 180, saturate: 110 } },
  { id: 'warm', name: 'Warm', values: { ...DEFAULT_FILTERS, hueRotate: -20, saturate: 120, brightness: 105 } },
  { id: 'vivid', name: 'Vivid', values: { ...DEFAULT_FILTERS, saturate: 170, contrast: 115 } },
  { id: 'fade', name: 'Fade', values: { ...DEFAULT_FILTERS, contrast: 80, brightness: 110, saturate: 70 } },
  { id: 'invert', name: 'Invert', values: { ...DEFAULT_FILTERS, invert: 100 } }
];

@Component({
  selector: 'app-image-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './image-filters.component.html',
  styleUrl: './image-filters.component.scss'
})
export class ImageFiltersComponent implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = IMAGE_FILTERS_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  activeImageId = signal<string | null>(null);

  presets = PRESETS;
  activePresetId = signal<string>('original');

  brightness = signal<number>(DEFAULT_FILTERS.brightness);
  contrast = signal<number>(DEFAULT_FILTERS.contrast);
  saturate = signal<number>(DEFAULT_FILTERS.saturate);
  grayscale = signal<number>(DEFAULT_FILTERS.grayscale);
  sepia = signal<number>(DEFAULT_FILTERS.sepia);
  invert = signal<number>(DEFAULT_FILTERS.invert);
  hueRotate = signal<number>(DEFAULT_FILTERS.hueRotate);
  blur = signal<number>(DEFAULT_FILTERS.blur);

  activeImage = computed<ImageItem | undefined>(() => {
    const id = this.activeImageId();
    return this.images().find(img => img.id === id) ?? this.images()[0];
  });

  /** CSS filter string, shared by the live preview (applied to the <img>) and canvas export (ctx.filter uses identical syntax). */
  filterString = computed<string>(() => {
    const parts: string[] = [];
    if (this.brightness() !== 100) parts.push(`brightness(${this.brightness()}%)`);
    if (this.contrast() !== 100) parts.push(`contrast(${this.contrast()}%)`);
    if (this.saturate() !== 100) parts.push(`saturate(${this.saturate()}%)`);
    if (this.grayscale() > 0) parts.push(`grayscale(${this.grayscale()}%)`);
    if (this.sepia() > 0) parts.push(`sepia(${this.sepia()}%)`);
    if (this.invert() > 0) parts.push(`invert(${this.invert()}%)`);
    if (this.hueRotate() !== 0) parts.push(`hue-rotate(${this.hueRotate()}deg)`);
    if (this.blur() > 0) parts.push(`blur(${this.blur()}px)`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  });

  hasChanges = computed<boolean>(() => this.filterString() !== 'none');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Image Filters - Free Online Photo Editor | DataUtil',
      description: 'Apply filters and effects to your photos: grayscale, sepia, vintage, cool, warm, vivid, and more. Fine-tune brightness, contrast, saturation, and blur — free and processed entirely in your browser.',
      keywords: 'image filters, photo filters online, grayscale image, sepia effect, vintage filter, adjust brightness contrast',
      ogTitle: 'Image Filters - Apply Photo Effects Online',
      ogDescription: 'Enhance your photos with one-click filters and fine-grained adjustments.',
      canonicalUrl: 'https://datautility.com/categories/images/filters'
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
      const url = URL.createObjectURL(file);
      try {
        const dims = await this.getImageDimensions(url);
        newItems.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          previewUrl: url,
          width: dims.width,
          height: dims.height
        });
      } catch {
        console.error('Failed to read image', file.name);
        URL.revokeObjectURL(url);
      }
    }

    const updated = [...this.images(), ...newItems];
    this.images.set(updated);

    if (!this.activeImageId() && updated.length > 0) {
      this.activeImageId.set(updated[0].id);
    }

    if (updated.length > 0) {
      this.state.set('configure');
    }
  }

  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    });
  }

  setActiveImage(id: string): void {
    this.activeImageId.set(id);
  }

  removeImage(id: string, event: Event): void {
    event.stopPropagation();
    const img = this.images().find(i => i.id === id);
    if (!img) return;

    URL.revokeObjectURL(img.previewUrl);
    const remaining = this.images().filter(i => i.id !== id);
    this.images.set(remaining);

    if (this.activeImageId() === id) {
      this.activeImageId.set(remaining[0]?.id ?? null);
    }

    if (remaining.length === 0) {
      this.state.set('upload');
    }
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

  applyPreset(preset: FilterPreset): void {
    this.activePresetId.set(preset.id);
    this.brightness.set(preset.values.brightness);
    this.contrast.set(preset.values.contrast);
    this.saturate.set(preset.values.saturate);
    this.grayscale.set(preset.values.grayscale);
    this.sepia.set(preset.values.sepia);
    this.invert.set(preset.values.invert);
    this.hueRotate.set(preset.values.hueRotate);
    this.blur.set(preset.values.blur);
  }

  /** Manual slider tweaks no longer correspond to a named preset. */
  onManualAdjust(): void {
    this.activePresetId.set('');
  }

  resetFilters(): void {
    this.applyPreset(PRESETS[0]);
  }

  private loadImageEl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  async processFilters(): Promise<void> {
    if (this.images().length === 0) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      if (typeof window === 'undefined') throw new Error('Browser only');

      const filter = this.filterString();
      const multiple = this.images().length > 1;
      let zip: any;
      if (multiple) {
        const JSZip = (await import('jszip')).default;
        zip = new JSZip();
      }

      let singleBlobUrl: string | null = null;
      let singleFileName: string | null = null;

      for (const img of this.images()) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;

        const imageEl = await this.loadImageEl(img.previewUrl);
        ctx.filter = filter;
        ctx.drawImage(imageEl, 0, 0, img.width, img.height);

        const format = img.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'image/jpeg' ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(format, quality);
        const base64Data = dataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        if (multiple) {
          zip.file(img.name, bytes);
        } else {
          const blob = new Blob([bytes], { type: format });
          singleBlobUrl = URL.createObjectURL(blob);
          singleFileName = img.name;
        }
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = URL.createObjectURL(content);
        dlName = 'filtered_images.zip';
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
        URL.revokeObjectURL(dlUrl);
      }, 100);
    } catch (error) {
      console.error('Filter export error:', error);
      this.errorMessage.set('Failed to apply filters. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.activeImageId.set(null);
    this.errorMessage.set('');
    this.resetFilters();
    this.state.set('upload');
  }
}
