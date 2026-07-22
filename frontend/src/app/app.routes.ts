import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'DataUtil - Free Online Utilities'
  },
  {
    path: 'categories/pdf',
    loadChildren: () => import('./pages/tools/pdf/pdf.routes').then(m => m.PDF_TOOL_ROUTES)
  },
  {
    path: 'categories/images',
    loadChildren: () => import('./pages/tools/images/image.routes').then(m => m.IMAGE_TOOL_ROUTES)
  },
  {
    path: 'categories/text',
    loadChildren: () => import('./pages/tools/text/text.routes').then(m => m.TEXT_TOOL_ROUTES)
  },
  {
    path: 'categories/developer',
    loadChildren: () => import('./pages/tools/developer/developer.routes').then(m => m.DEVELOPER_TOOL_ROUTES)
  },
  {
    path: 'categories/:category',
    loadComponent: () => import('./pages/category-dashboard/category-dashboard.component').then(m => m.CategoryDashboardComponent),
    title: 'Tools - DataUtil'
  },
  {
    path: '**',
    redirectTo: ''
  }
];


