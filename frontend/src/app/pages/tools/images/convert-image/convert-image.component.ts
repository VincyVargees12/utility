import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolSidebarComponent } from '../../../../shared/components/tool-sidebar/tool-sidebar.component';
import { SeoService } from '../../../../services/seo.service';

// Type for heic2any
type Heic2Any = (options: { blob: Blob }) => Promise<Blob | Blob[]>;

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'svg' | 'ico' | 'eps' | 'pdf' | 'avif' | 'jfif' | 'heic';
type ImageQuality = 'low' | 'normal' | 'high';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number;
  height: number;
  originalFormat: string;
}

@Component({
  selector: 'app-convert-image',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent, ToolSidebarComponent],
  templateUrl: './convert-image.component.html',
  styleUrl: './convert-image.component.scss'
})
export class ConvertImageComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  images = signal<ImageItem[]>([]);
  targetFormat = signal<ImageFormat>('png');
  quality = signal<ImageQuality>('high'); // Always high quality

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Convert Image - Image Format Converter (JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, HEIC) | DataUtil',
      description: 'Convert images between 15+ formats: JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, EPS, PDF, AVIF, HEIC, JFIF. Batch convert with quality control. Free online tool.',
      keywords: 'convert image, image format converter, jpg to png, png to jpg, webp converter, gif converter, bmp to jpg, heic to jpg, heic converter',
      ogTitle: 'Convert Image - 15+ Image Format Converter',
      ogDescription: 'Convert images between JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, HEIC, and more formats instantly.',
      canonicalUrl: 'https://datautility.com/categories/images/convert-image'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  async loadImages(files: File[]): Promise<void> {
    const validFiles = files.filter(f => {
      // Accept all files starting with 'image/', or HEIC/HEIF files even without proper MIME type
      const isImage = f.type.startsWith('image/');
      const isHeic = f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif');
      return isImage || isHeic;
    });
    if (validFiles.length === 0) {
      this.errorMessage.set('Please upload valid image files (JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, EPS, AVIF, HEIC, JFIF).');
      return;
    }

    this.errorMessage.set('');
    
    const newItems: ImageItem[] = [];
    for (const file of validFiles) {
      try {
        let processedFile: File = file;
        let processedBlob: Blob = file;
        
        // Convert HEIC to JPEG using heic2any
        const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        if (isHeic) {
          try {
            const heic2anyModule = await import('heic2any');
            const heic2any = heic2anyModule.default as Heic2Any;
            const converted = await heic2any({ blob: file });
            const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
            processedBlob = convertedBlob;
            // Create a new File from the converted blob
            processedFile = new File([processedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
          } catch (heicError) {
            console.error('HEIC conversion failed:', heicError);
            this.errorMessage.set('Failed to convert HEIC file. Please try a different file.');
            continue;
          }
        }

        const url = window.URL.createObjectURL(processedBlob);
        const dimensions = await this.getImageDimensions(url);
        
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: processedFile,
          name: file.name,
          previewUrl: url,
          width: dimensions.width,
          height: dimensions.height,
          originalFormat: this.getFileExtension(file.name)
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
      img.onerror = () => {
        // Fallback for formats not supported by Image API (like HEIC)
        // Use default dimensions
        resolve({ width: 800, height: 600 });
      };
      img.src = url;
    });
  }

  private getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts[parts.length - 1].toLowerCase();
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

  setFormat(format: string): void {
    this.targetFormat.set(format as ImageFormat);
  }

  private getQualityValue(): number {
    // Always use high quality (95%)
    return 0.95;
  }

  private getMimeType(format: ImageFormat): string {
    switch (format) {
      case 'jpg':
      case 'jpeg':
      case 'jfif':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'avif':
        return 'image/avif';
      case 'heic':
        return 'image/heic';
      case 'tiff':
        return 'image/tiff';
      case 'svg':
        return 'image/svg+xml';
      case 'ico':
        return 'image/x-icon';
      case 'eps':
        return 'application/postscript';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'image/png';
    }
  }

  private async convertImage(img: ImageItem): Promise<{ blob: Blob; name: string }> {
    const canvas = document.createElement('canvas');
    
    // Use actual or default dimensions
    const width = img.width > 0 ? img.width : 800;
    const height = img.height > 0 ? img.height : 600;
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Fill white background for all formats
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const imageEl = new Image();
    try {
      await new Promise<void>((res, rej) => {
        imageEl.onload = () => res();
        imageEl.onerror = () => rej();
        imageEl.src = img.previewUrl;
      });

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageEl, 0, 0, width, height);
    } catch (error) {
      // If image fails to load, canvas remains white
      console.warn('Image load failed, using white background:', error);
    }

    const mimeType = this.getMimeType(this.targetFormat());
    const qualityFormats = ['jpg', 'jpeg', 'jfif', 'webp', 'avif', 'heic'];
    const quality = qualityFormats.includes(this.targetFormat()) 
      ? this.getQualityValue() 
      : undefined;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newName = this.getConvertedFileName(img.name);
            resolve({ blob, name: newName });
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        mimeType,
        quality
      );
    });
  }

  private getConvertedFileName(originalName: string): string {
    const nameParts = originalName.split('.');
    nameParts.pop();
    const baseName = nameParts.join('.');
    const ext = this.targetFormat() === 'jpeg' ? 'jpg' : this.targetFormat();
    return `${baseName}.${ext}`;
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
        const result = await this.convertImage(img);

        if (multiple) {
          zip.file(result.name, result.blob);
        } else {
          singleBlobUrl = window.URL.createObjectURL(result.blob);
          singleFileName = result.name;
        }
      }

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = `converted_images.zip`;
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
      this.errorMessage.set('Failed to convert images. Please try again.');
      this.state.set('configure');
    } finally {
      this.isProcessing.set(false);
    }
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.targetFormat.set('png');
    this.quality.set('normal');
    this.state.set('upload');
  }
}
