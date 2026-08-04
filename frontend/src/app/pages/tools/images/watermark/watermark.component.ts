import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { WATERMARK_RESOURCE_CONTENT } from './watermark.resource-content';

type AppState = 'upload' | 'configure';
type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
}

const POSITIONS: Position[] = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

@Component({
  selector: 'app-watermark',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent, ToolResourceContentComponent],
  templateUrl: './watermark.component.html',
  styleUrl: './watermark.component.scss'
})
export class WatermarkComponent implements OnInit {
  private seoService = inject(SeoService);

  resourceContent = WATERMARK_RESOURCE_CONTENT;

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  activeImageId = signal<string | null>(null);

  watermarkType = signal<WatermarkType>('text');
  positions = POSITIONS;

  // Text watermark settings
  text = signal<string>('Your Watermark');
  textColor = signal<string>('#ffffff');
  fontFamily = signal<string>('Arial');
  bold = signal<boolean>(true);
  /** Font size as a percentage of the image width, so it scales consistently across image sizes. */
  fontSizePct = signal<number>(6);

  // Image watermark settings
  watermarkImageFile = signal<File | null>(null);
  watermarkImagePreview = signal<string>('');
  /** Watermark image width as a percentage of the base image width. */
  imageScalePct = signal<number>(25);

  // Shared settings
  opacity = signal<number>(60);
  rotation = signal<number>(0);
  position = signal<Position>('bottom-right');
  /** Distance from the nearest edge(s), as a percentage of the shorter image dimension. */
  marginPct = signal<number>(4);

  activeImage = computed<ImageItem | undefined>(() => {
    const id = this.activeImageId();
    return this.images().find(img => img.id === id) ?? this.images()[0];
  });

  /**
   * Rendered pixel width of the preview <img>, measured directly rather than via CSS container
   * queries: the wrapper's width comes from the image itself (shrink-to-fit), and container-type:
   * inline-size requires the opposite — a container whose size doesn't depend on its content —
   * so cqw units would resolve to 0px here. Percentage-based overlay sizing (font size, watermark
   * image width) is computed from this value instead, mirroring the canvas export math.
   */
  previewImgWidth = signal<number>(0);

  onPreviewImgLoad(event: Event): void {
    this.updatePreviewImgWidth(event.target as HTMLImageElement);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.previewImgEl) {
      this.updatePreviewImgWidth(this.previewImgEl);
    }
  }

  private previewImgEl: HTMLImageElement | null = null;

  private updatePreviewImgWidth(img: HTMLImageElement): void {
    this.previewImgEl = img;
    this.previewImgWidth.set(img.clientWidth);
  }

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Add Watermark to Images - Free Online Tool | DataUtil',
      description: 'Add a text or image watermark to your photos, in bulk. Customize position, opacity, rotation, color, and size — processed entirely in your browser.',
      keywords: 'add watermark, image watermark, text watermark, watermark photos online, logo watermark',
      ogTitle: 'Add Watermark to Images Online',
      ogDescription: 'Protect your photos with a custom text or logo watermark, free and private.',
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

  onWatermarkImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (this.watermarkImagePreview()) {
        URL.revokeObjectURL(this.watermarkImagePreview());
      }
      this.watermarkImageFile.set(file);
      this.watermarkImagePreview.set(URL.createObjectURL(file));
    }
  }

  removeWatermarkImage(): void {
    if (this.watermarkImagePreview()) {
      URL.revokeObjectURL(this.watermarkImagePreview());
    }
    this.watermarkImageFile.set(null);
    this.watermarkImagePreview.set('');
  }

  /** justify-content / align-items for the live CSS preview overlay, derived from the 3x3 position grid. */
  previewAlignment(): { justifyContent: string; alignItems: string } {
    const pos = this.position();
    const [row, col] = pos.split('-') as [string, string];
    const justifyContent = col === 'left' ? 'flex-start' : col === 'right' ? 'flex-end' : 'center';
    const alignItems = row === 'top' ? 'flex-start' : row === 'bottom' ? 'flex-end' : 'center';
    return { justifyContent, alignItems };
  }

  private loadImageEl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /** Anchor point + text alignment for drawing text on canvas, based on the 3x3 position grid and margin. */
  private getTextAnchor(canvasW: number, canvasH: number, marginPx: number): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
    const pos = this.position();
    const [row, col] = pos.split('-') as [string, string];

    const align: CanvasTextAlign = col === 'left' ? 'left' : col === 'right' ? 'right' : 'center';
    const baseline: CanvasTextBaseline = row === 'top' ? 'top' : row === 'bottom' ? 'bottom' : 'middle';

    const x = col === 'left' ? marginPx : col === 'right' ? canvasW - marginPx : canvasW / 2;
    const y = row === 'top' ? marginPx : row === 'bottom' ? canvasH - marginPx : canvasH / 2;

    return { x, y, align, baseline };
  }

  /** Center point for drawing the watermark image on canvas, based on the 3x3 position grid and margin. */
  private getImageAnchorCenter(canvasW: number, canvasH: number, wmW: number, wmH: number, marginPx: number): { cx: number; cy: number } {
    const pos = this.position();
    const [row, col] = pos.split('-') as [string, string];

    const cx = col === 'left' ? marginPx + wmW / 2 : col === 'right' ? canvasW - marginPx - wmW / 2 : canvasW / 2;
    const cy = row === 'top' ? marginPx + wmH / 2 : row === 'bottom' ? canvasH - marginPx - wmH / 2 : canvasH / 2;

    return { cx, cy };
  }

  async processWatermark(): Promise<void> {
    if (this.images().length === 0) return;

    if (this.watermarkType() === 'text' && !this.text().trim()) {
      this.errorMessage.set('Please enter watermark text.');
      return;
    }
    if (this.watermarkType() === 'image' && !this.watermarkImageFile()) {
      this.errorMessage.set('Please upload a watermark image.');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      if (typeof window === 'undefined') throw new Error('Browser only');

      const watermarkImgEl = this.watermarkType() === 'image'
        ? await this.loadImageEl(this.watermarkImagePreview())
        : null;

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

        const baseImageEl = await this.loadImageEl(img.previewUrl);
        ctx.drawImage(baseImageEl, 0, 0, img.width, img.height);

        const marginPx = (this.marginPct() / 100) * Math.min(img.width, img.height);

        ctx.save();
        ctx.globalAlpha = this.opacity() / 100;

        if (this.watermarkType() === 'text') {
          const fontPx = Math.max(8, Math.round((this.fontSizePct() / 100) * img.width));
          const { x, y, align, baseline } = this.getTextAnchor(img.width, img.height, marginPx);

          ctx.fillStyle = this.textColor();
          ctx.font = `${this.bold() ? 'bold' : 'normal'} ${fontPx}px ${this.fontFamily()}`;
          ctx.textAlign = align;
          ctx.textBaseline = baseline;

          ctx.translate(x, y);
          ctx.rotate((this.rotation() * Math.PI) / 180);
          ctx.fillText(this.text(), 0, 0);
        } else if (watermarkImgEl) {
          const wmW = img.width * (this.imageScalePct() / 100);
          const wmH = wmW * (watermarkImgEl.height / watermarkImgEl.width);
          const { cx, cy } = this.getImageAnchorCenter(img.width, img.height, wmW, wmH, marginPx);

          ctx.translate(cx, cy);
          ctx.rotate((this.rotation() * Math.PI) / 180);
          ctx.drawImage(watermarkImgEl, -wmW / 2, -wmH / 2, wmW, wmH);
        }

        ctx.restore();

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
        URL.revokeObjectURL(dlUrl);
      }, 100);
    } catch (error) {
      console.error('Watermark error:', error);
      this.errorMessage.set('Failed to apply watermark. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => URL.revokeObjectURL(img.previewUrl));
    if (this.watermarkImagePreview()) {
      URL.revokeObjectURL(this.watermarkImagePreview());
    }

    this.images.set([]);
    this.activeImageId.set(null);
    this.watermarkImageFile.set(null);
    this.watermarkImagePreview.set('');
    this.errorMessage.set('');
    this.watermarkType.set('text');
    this.text.set('Your Watermark');
    this.opacity.set(60);
    this.rotation.set(0);
    this.position.set('bottom-right');
    this.marginPct.set(4);
    this.state.set('upload');
  }
}
