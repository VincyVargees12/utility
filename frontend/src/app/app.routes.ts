import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BlogComponent } from './pages/blog/blog.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'DataUtil - Free Online Utilities'
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    title: 'Categories - DataUtil'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us - DataUtil'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact - DataUtil'
  },
  {
    path: 'blog',
    component: BlogComponent,
    title: 'Blog - DataUtil'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
