import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { TrendingToolsComponent } from '../../components/trending-tools/trending-tools.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    CategoriesComponent,
    TrendingToolsComponent,
    WhyChooseComponent,
    StatisticsComponent,
    FaqComponent,
    NewsletterComponent,
  ],
  template: `
    <main>
      <app-hero />
      <app-categories />
      <app-trending-tools />
      <app-why-choose />
      <app-statistics />
      <app-faq />
      <app-newsletter />
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    main {
      min-height: 100vh;
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'DataUtil - Free Online Utilities for Everyone',
      description: 'Access hundreds of free online tools for PDF, images, text, development, calculations, and more. Fast, secure, and privacy-first utility platform.',
      keywords: 'online tools, pdf tools, image tools, developer tools, calculators, converters, free utilities, online utilities',
      ogTitle: 'DataUtil - One Platform. Hundreds of Powerful Online Utilities',
      ogDescription: 'Convert files, edit documents, calculate values, transform data and boost productivity with one modern platform.',
      ogImage: '/assets/og-image.jpg',
      ogUrl: 'https://datau til.com',
      canonicalUrl: 'https://datautil.com'
    });

    // Add structured data for the website
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'DataUtil',
      'description': 'Free online utility platform with hundreds of tools',
      'url': 'https://datautil.com',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://datautil.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });
  }
}
