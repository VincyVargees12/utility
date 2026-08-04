import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { TrendingToolsComponent } from '../../components/trending-tools/trending-tools.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
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

      @defer (on viewport; prefetch on idle) {
        <app-trending-tools />
      } @placeholder {
        <section class="deferred-section-shell" aria-hidden="true"></section>
      }

      @defer (on viewport; prefetch on idle) {
        <app-why-choose />
      } @placeholder {
        <section class="deferred-section-shell" aria-hidden="true"></section>
      }

      @defer (on viewport; prefetch on idle) {
        <app-statistics />
      } @placeholder {
        <section class="deferred-section-shell deferred-section-shell--compact" aria-hidden="true"></section>
      }

      @defer (on viewport; prefetch on idle) {
        <app-faq />
      } @placeholder {
        <section class="deferred-section-shell deferred-section-shell--tall" aria-hidden="true"></section>
      }

      @defer (on viewport; prefetch on idle) {
        <app-newsletter />
      } @placeholder {
        <section class="deferred-section-shell deferred-section-shell--compact" aria-hidden="true"></section>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    main {
      min-height: 100vh;
    }

    .deferred-section-shell {
      min-height: 32rem;
    }

    .deferred-section-shell--compact {
      min-height: 18rem;
    }

    .deferred-section-shell--tall {
      min-height: 40rem;
    }

    @media (max-width: 767px) {
      .deferred-section-shell {
        min-height: 24rem;
      }

      .deferred-section-shell--compact {
        min-height: 14rem;
      }

      .deferred-section-shell--tall {
        min-height: 30rem;
      }
    }
  `]
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
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
      ogImage: 'https://www.data-util.com/ogImage.png',
      ogUrl: 'https://www.data-util.com',
      canonicalUrl: 'https://www.data-util.com'
    });

    // Add structured data for the website
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'DataUtil',
      'description': 'Free online utility platform with hundreds of tools for PDF, images, text manipulation, and developer utilities.',
      'url': 'https://www.data-util.com',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }
}
