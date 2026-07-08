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
    path: 'categories/:category/:toolId',
    loadComponent: () => import('./pages/tools/pdf/merge-pdf/merge-pdf.component').then(m => m.MergePdfComponent),
    title: 'Tool - DataUtil'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
   

