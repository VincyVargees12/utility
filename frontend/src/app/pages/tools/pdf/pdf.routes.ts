import { Routes } from '@angular/router';

export const PDF_TOOL_ROUTES: Routes = [
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
  }
];