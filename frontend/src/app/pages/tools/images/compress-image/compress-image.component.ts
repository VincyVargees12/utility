import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type CompressionLevel = 'extreme' | 'recommended' | 'less';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  originalSize: number;
}

@Component({
  selector: 'app-compress-image',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent],
  templateUrl: './compress-image.component.html',
  styleUrl: './compress-image.component.scss'
})
export class CompressImageComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  errorMessage = signal<string>('');

  images = signal<ImageItem[]>([]);
  compressionLevel = signal<CompressionLevel>('recommended');
  
  savedBytes = signal<number>(0);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Compress Image - Reduce image size online | DataUtil',
      description: 'Compress JPG, PNG, SVG, and GIF images with the best quality and compression. Reduce file size of your images at once.',
      keywords: 'compress image, reduce image size, optimize image, bulk image compressor',
      ogTitle: 'Compress Image - Fast Online Image Optimizer',
      ogDescription: 'Reduce image file size while maintaining quality. Perfect for web optimization.',
      canonicalUrl: 'https://datautility.com/categories/images/compress-image'
    });
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  loadImages(files: File[]): void {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      this.errorMessage.set('Please upload valid image files (JPG, PNG, WebP).');
      return;
    }

    this.errorMessage.set('');
    
    const newItems: ImageItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      previewUrl: window.URL.createObjectURL(file),
      originalSize: file.size
    }));

    this.images.update(current => [...current, ...newItems]);
    
    if (this.state() === 'upload') {
      this.state.set('configure');
    }
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
    }
  }

  private compressSingleImage(img: ImageItem): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const imageEl = new Image();
      imageEl.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imageEl.width;
        canvas.height = imageEl.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(imageEl, 0, 0);

        let quality = 0.7; // recommended
        if (this.compressionLevel() === 'extreme') quality = 0.4;
        if (this.compressionLevel() === 'less') quality = 0.9;

        // Force convert everything to jpeg or webp to compress effectively
        // If it's a PNG, we convert it to JPEG to get huge savings, unless it has transparency. 
        // For simplicity and maximum compression, let's use webp if supported, or jpeg.
        let outputType = 'image/jpeg';
        if (img.file.type === 'image/webp') outputType = 'image/webp';
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to compress image'));
        }, outputType, quality);
      };
      imageEl.onerror = reject;
      imageEl.src = img.previewUrl;
    });
  }

  async processCompression(): Promise<void> {
    if (this.images().length === 0) return;

    this.state.set('processing');
    this.errorMessage.set('');
    this.savedBytes.set(0);

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
      
      let totalOriginal = 0;
      let totalCompressed = 0;

      for (const img of this.images()) {
        totalOriginal += img.originalSize;
        const compressedBlob = await this.compressSingleImage(img);
        totalCompressed += compressedBlob.size;

        if (multiple) {
           // If we converted PNG to JPEG, we should probably change extension, but for now just appending.
           // To be safe, let's keep original extension or replace png with jpg if we forced jpeg.
           let outName = img.name;
           if (img.file.type === 'image/png' && outName.toLowerCase().endsWith('.png')) {
              outName = outName.substring(0, outName.length - 4) + '.jpg';
           }
           zip.file(outName, compressedBlob);
        } else {
           let outName = img.name;
           if (img.file.type === 'image/png' && outName.toLowerCase().endsWith('.png')) {
              outName = outName.substring(0, outName.length - 4) + '.jpg';
           }
           singleBlobUrl = window.URL.createObjectURL(compressedBlob);
           singleFileName = outName;
        }
      }

      this.savedBytes.set(Math.max(0, totalOriginal - totalCompressed));

      let dlUrl: string;
      let dlName: string;

      if (multiple && zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        dlUrl = window.URL.createObjectURL(content);
        dlName = 'compressed_images.zip';
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
      console.error('Compression error:', error);
      this.errorMessage.set('Failed to compress images. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processCompression();
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.compressionLevel.set('recommended');
    this.savedBytes.set(0);
    this.state.set('upload');
  }
}
