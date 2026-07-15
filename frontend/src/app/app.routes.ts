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
    path: 'categories/pdf/pdf-to-word',
    loadComponent: () => import('./pages/tools/pdf/pdf-to-word/pdf-to-word.component').then(m => m.PdfToWordComponent),
    title: 'PDF to WORD - DataUtil'
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
    path: 'categories/pdf/word-to-pdf',
    loadComponent: () => import('./pages/tools/pdf/word-to-pdf/word-to-pdf.component').then(m => m.WordToPdfComponent),
    title: 'Word to PDF - DataUtil'
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
   

