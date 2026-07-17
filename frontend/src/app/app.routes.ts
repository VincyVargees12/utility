import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryDashboardComponent } from './pages/category-dashboard/category-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'DataUtil - Free Online Utilities'
  },
  {
    path: 'categories/:category',
    component: CategoryDashboardComponent,
    title: 'Tools - DataUtil'
  },
  {
    path: 'categories/pdf/merge-pdf',
    loadComponent: () => import('./pages/tools/pdf/merge-pdf/merge-pdf.component').then(m => m.MergePdfComponent),
    title: 'Merge PDF - DataUtil'
  },
  {
    path: 'categories/pdf/split-pdf',
    loadComponent: () => import('./pages/tools/pdf/split-pdf/split-pdf.component').then(m => m.SplitPdfComponent),
    title: 'Split PDF - DataUtil'
  },
  {
    path: 'categories/pdf/compress-pdf',
    loadComponent: () => import('./pages/tools/pdf/compress-pdf/compress-pdf.component').then(m => m.CompressPdfComponent),
    title: 'Compress PDF - DataUtil'
  },
  {
    path: 'categories/pdf/rotate-pdf',
    loadComponent: () => import('./pages/tools/pdf/rotate-pdf/rotate-pdf.component').then(m => m.RotatePdfComponent),
    title: 'Rotate PDF - DataUtil'
  },
  {
    path: 'categories/pdf/unlock-pdf',
    loadComponent: () => import('./pages/tools/pdf/unlock-pdf/unlock-pdf.component').then(m => m.UnlockPdfComponent),
    title: 'Unlock PDF - DataUtil'
  },
  {
    path: 'categories/pdf/protect-pdf',
    loadComponent: () => import('./pages/tools/pdf/protect-pdf/protect-pdf.component').then(m => m.ProtectPdfComponent),
    title: 'Protect PDF - DataUtil'
  },
  {
    path: 'categories/pdf/pdf-to-jpg',
    loadComponent: () => import('./pages/tools/pdf/pdf-to-jpg/pdf-to-jpg.component').then(m => m.PdfToJpgComponent),
    title: 'PDF to JPG - DataUtil'
  },
  {
    path: 'categories/pdf/jpg-to-pdf',
    loadComponent: () => import('./pages/tools/pdf/jpg-to-pdf/jpg-to-pdf.component').then(m => m.JpgToPdfComponent),
    title: 'JPG to PDF - DataUtil'
  },
  {
    path: 'categories/images/resize-image',
    loadComponent: () => import('./pages/tools/images/resize-image/resize-image.component').then(m => m.ResizeImageComponent),
    title: 'Resize Image - DataUtil'
  },
  {
    path: 'categories/images/compress-image',
    loadComponent: () => import('./pages/tools/images/compress-image/compress-image.component').then(m => m.CompressImageComponent),
    title: 'Compress Image - DataUtil'
  },
  {
    path: 'categories/images/crop-image',
    loadComponent: () => import('./pages/tools/images/crop-image/crop-image.component').then(m => m.CropImageComponent),
    title: 'Crop Image - DataUtil'
  },
  {
    path: 'categories/images/rotate-image',
    loadComponent: () => import('./pages/tools/images/rotate-image/rotate-image.component').then(m => m.RotateImageComponent),
    title: 'Rotate Image - DataUtil'
  },
  {
    path: 'categories/images/flip-image',
    loadComponent: () => import('./pages/tools/images/flip-image/flip-image.component').then(m => m.FlipImageComponent),
    title: 'Flip Image - DataUtil'
  },
  {
    path: 'categories/images/png-to-jpg',
    loadComponent: () => import('./pages/tools/images/png-to-jpg/png-to-jpg.component').then(m => m.PngToJpgComponent),
    title: 'PNG to JPG - DataUtil'
  },
  {
    path: 'categories/images/jpg-to-png',
    loadComponent: () => import('./pages/tools/images/jpg-to-png/jpg-to-png.component').then(m => m.JpgToPngComponent),
    title: 'JPG to PNG - DataUtil'
  },
  {
    path: 'categories/images/convert-image',
    loadComponent: () => import('./pages/tools/images/convert-image/convert-image.component').then(m => m.ConvertImageComponent),
    title: 'Convert Image - DataUtil'
  },
  {
    path: 'categories/images/watermark',
    loadComponent: () => import('./pages/tools/images/watermark/watermark.component').then(m => m.WatermarkComponent),
    title: 'Add Watermark - DataUtil'
  },
  {
    path: 'categories/images/remove-background',
    loadComponent: () => import('./pages/tools/images/remove-background/remove-background.component').then(m => m.RemoveBackgroundComponent),
    title: 'Remove Background - DataUtil'
  },
  {
    path: 'categories/images/remove-bg',
    loadComponent: () => import('./pages/tools/images/remove-background/remove-background.component').then(m => m.RemoveBackgroundComponent),
    title: 'Remove Background - DataUtil'
  },
  {
    path: 'categories/images/to-webp',
    loadComponent: () => import('./pages/tools/images/to-webp/to-webp.component').then(m => m.ToWebpComponent),
    title: 'Convert to WebP - DataUtil'
  },
  {
    path: 'categories/:category/:toolId',
    loadComponent: () => import('./pages/tools/pdf/merge-pdf/merge-pdf.component').then(m => m.MergePdfComponent),
    title: 'Tool - DataUtil'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
   

