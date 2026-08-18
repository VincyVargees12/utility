import { Routes } from '@angular/router';

export const PDF_TOOL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../category-dashboard/category-dashboard.component').then(m => m.CategoryDashboardComponent),
    title: 'PDF Tools - DataUtil'
  },
  {
    path: 'merge-pdf',
    loadComponent: () => import('./merge-pdf/merge-pdf.component').then(m => m.MergePdfComponent),
    title: 'Merge PDF - DataUtil'
  },
  {
    path: 'split-pdf',
    loadComponent: () => import('./split-pdf/split-pdf.component').then(m => m.SplitPdfComponent),
    title: 'Split PDF - DataUtil'
  },
  {
    path: 'compress-pdf',
    loadComponent: () => import('./compress-pdf/compress-pdf.component').then(m => m.CompressPdfComponent),
    title: 'Compress PDF - DataUtil'
  },
  {
    path: 'rotate-pdf',
    loadComponent: () => import('./rotate-pdf/rotate-pdf.component').then(m => m.RotatePdfComponent),
    title: 'Rotate PDF - DataUtil'
  },
  {
    path: 'unlock-pdf',
    loadComponent: () => import('./unlock-pdf/unlock-pdf.component').then(m => m.UnlockPdfComponent),
    title: 'Unlock PDF - DataUtil'
  },
  {
    path: 'protect-pdf',
    loadComponent: () => import('./protect-pdf/protect-pdf.component').then(m => m.ProtectPdfComponent),
    title: 'Protect PDF - DataUtil'
  },
  {
    path: 'pdf-to-jpg',
    loadComponent: () => import('./pdf-to-jpg/pdf-to-jpg.component').then(m => m.PdfToJpgComponent),
    title: 'PDF to JPG - DataUtil'
  },
  {
    path: 'jpg-to-pdf',
    loadComponent: () => import('./jpg-to-pdf/jpg-to-pdf.component').then(m => m.JpgToPdfComponent),
    title: 'JPG to PDF - DataUtil'
  },
  {
    path: 'watermark-pdf',
    loadComponent: () => import('./watermark-pdf/watermark-pdf.component').then(m => m.WatermarkPdfComponent),
    title: 'Watermark PDF - DataUtil'
  },
  {
    path: 'rearrange-pdf',
    loadComponent: () => import('./rearrange-pdf/rearrange-pdf.component').then(m => m.RearrangePdfComponent),
    title: 'Rearrange PDF Pages - DataUtil'
  },
  {
    path: 'remove-blank-pages',
    loadComponent: () => import('./remove-blank-pages/remove-blank-pages.component').then(m => m.RemoveBlankPagesComponent),
    title: 'PDF Blank Page Remover - DataUtil'
  },
  {
    path: 'duplicate-page-finder',
    loadComponent: () => import('./duplicate-page-finder/duplicate-page-finder.component').then(m => m.DuplicatePageFinderComponent),
    title: 'PDF Duplicate Page Finder - DataUtil'
  }
];