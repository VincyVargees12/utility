import { Routes } from '@angular/router';

export const IMAGE_TOOL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../category-dashboard/category-dashboard.component').then(m => m.CategoryDashboardComponent),
    title: 'Image Tools - DataUtil'
  },
  {
    path: 'resize-image',
    loadComponent: () => import('./resize-image/resize-image.component').then(m => m.ResizeImageComponent),
    title: 'Resize Image - DataUtil'
  },
  {
    path: 'compress-image',
    loadComponent: () => import('./compress-image/compress-image.component').then(m => m.CompressImageComponent),
    title: 'Compress Image - DataUtil'
  },
  {
    path: 'crop-image',
    loadComponent: () => import('./crop-image/crop-image.component').then(m => m.CropImageComponent),
    title: 'Crop Image - DataUtil'
  },
  {
    path: 'rotate-image',
    loadComponent: () => import('./rotate-image/rotate-image.component').then(m => m.RotateImageComponent),
    title: 'Rotate Image - DataUtil'
  },
  {
    path: 'flip-image',
    loadComponent: () => import('./flip-image/flip-image.component').then(m => m.FlipImageComponent),
    title: 'Flip Image - DataUtil'
  },
  {
    path: 'png-to-jpg',
    loadComponent: () => import('./png-to-jpg/png-to-jpg.component').then(m => m.PngToJpgComponent),
    title: 'PNG to JPG - DataUtil'
  },
  {
    path: 'jpg-to-png',
    loadComponent: () => import('./jpg-to-png/jpg-to-png.component').then(m => m.JpgToPngComponent),
    title: 'JPG to PNG - DataUtil'
  },
  {
    path: 'convert-image',
    loadComponent: () => import('./convert-image/convert-image.component').then(m => m.ConvertImageComponent),
    title: 'Convert Image - DataUtil'
  },
  {
    path: 'watermark',
    loadComponent: () => import('./watermark/watermark.component').then(m => m.WatermarkComponent),
    title: 'Add Watermark - DataUtil'
  },
  {
    path: 'remove-background',
    loadComponent: () => import('./remove-background/remove-background.component').then(m => m.RemoveBackgroundComponent),
    title: 'Remove Background - DataUtil'
  },
  {
    path: 'remove-bg',
    loadComponent: () => import('./remove-background/remove-background.component').then(m => m.RemoveBackgroundComponent),
    title: 'Remove Background - DataUtil'
  },
  {
    path: 'to-webp',
    loadComponent: () => import('./to-webp/to-webp.component').then(m => m.ToWebpComponent),
    title: 'Convert to WebP - DataUtil'
  },
  {
    path: 'filters',
    loadComponent: () => import('./image-filters/image-filters.component').then(m => m.ImageFiltersComponent),
    title: 'Image Filters - DataUtil'
  }
];