import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { FileUploaderComponent } from '../../../../shared/components/file-uploader/file-uploader.component';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type PageSize = 'fit' | 'a4';
type Margin = 'none' | 'small' | 'big';

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

@Component({
  selector: 'app-jpg-to-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, FileUploaderComponent, RelatedToolsComponent],
  templateUrl: './jpg-to-pdf.component.html',
  styleUrl: './jpg-to-pdf.component.scss'
})
export class JpgToPdfComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  
  pageSize = signal<PageSize>('fit');
  margin = signal<Margin>('none');

  images = signal<ImageFile[]>([]);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'JPG to PDF Converter - Free Online | DataUtil',
      description: 'Convert JPG, PNG, and other images to PDF documents. Free online image to PDF converter.',
      keywords: 'jpg to pdf, image to pdf, png to pdf, convert jpg to pdf',
      ogTitle: 'JPG to PDF Converter - Free Online',
      ogDescription: 'Convert JPG, PNG, and other images to PDF quickly and easily.',
      canonicalUrl: 'https://datautility.com/categories/pdf/jpg-to-pdf'
    });
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      this.loadImages(Array.from(files));
    }
  }

  loadImages(files: File[]): void {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      this.errorMessage.set('Please upload valid image files (JPG, PNG, etc).');
      return;
    }

    const currentImages = [...this.images()];
    
    for (const file of validFiles) {
      currentImages.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        previewUrl: window.URL.createObjectURL(file)
      });
    }

    this.images.set(currentImages);
    this.errorMessage.set('');
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

  async processConversion(): Promise<void> {
    if (this.images().length === 0) return;

    this.state.set('processing');
    this.errorMessage.set('');

    try {
      if (typeof window === 'undefined') throw new Error('Browser only');
      const { PDFDocument, PageSizes } = await import('pdf-lib');
      
      const pdfDoc = await PDFDocument.create();

      const PAGE_A4 = PageSizes.A4; // [595.28, 841.89]
      
      const getMarginPt = () => {
        if (this.margin() === 'small') return 15;
        if (this.margin() === 'big') return 30;
        return 0;
      };
      
      const marginPt = getMarginPt();

      for (const img of this.images()) {
        const buffer = await img.file.arrayBuffer();
        let pdfImage;
        
        try {
          if (img.file.type === 'image/png') {
            pdfImage = await pdfDoc.embedPng(buffer);
          } else {
            // Assume jpeg for jpg, jpeg, etc. pdf-lib throws if format is not supported, 
            // but we can try embedding as jpg first.
            pdfImage = await pdfDoc.embedJpg(buffer);
          }
        } catch (err) {
          console.warn(`Could not embed image ${img.name}. Skipping or format unsupported.`, err);
          continue; 
        }

        const imgDims = pdfImage.scale(1);

        if (this.pageSize() === 'fit') {
          // Page size matches image size + margins
          const pageW = imgDims.width + (marginPt * 2);
          const pageH = imgDims.height + (marginPt * 2);
          const page = pdfDoc.addPage([pageW, pageH]);
          page.drawImage(pdfImage, {
            x: marginPt,
            y: marginPt,
            width: imgDims.width,
            height: imgDims.height
          });
        } else {
          // A4 Size
          const page = pdfDoc.addPage(PAGE_A4);
          const drawW = PAGE_A4[0] - (marginPt * 2);
          const drawH = PAGE_A4[1] - (marginPt * 2);

          // Fit image securely inside draw area while maintaining aspect ratio
          const scale = Math.min(drawW / imgDims.width, drawH / imgDims.height);
          const finalW = imgDims.width * scale;
          const finalH = imgDims.height * scale;

          // Center the image
          const x = marginPt + (drawW - finalW) / 2;
          const y = marginPt + (drawH - finalH) / 2;

          page.drawImage(pdfImage, {
            x, y,
            width: finalW,
            height: finalH
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const outName = this.images().length === 1 
        ? this.images()[0].name.replace(/\.[^/.]+$/, "") + '.pdf' 
        : 'images-converted.pdf';
        
      const a = document.createElement('a');
      a.href = url;
      a.download = outName;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => { 
        document.body.removeChild(a); 
        window.URL.revokeObjectURL(url); 
      }, 100);

      this.state.set('complete');
    } catch (error: any) {
      console.error('Conversion error:', error);
      this.errorMessage.set('Failed to convert images to PDF. Ensure they are valid JPG or PNG files.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processConversion();
  }

  reset(): void {
    this.images().forEach(img => window.URL.revokeObjectURL(img.previewUrl));
    this.images.set([]);
    this.errorMessage.set('');
    this.pageSize.set('fit');
    this.margin.set('none');
    this.state.set('upload');
  }
}
