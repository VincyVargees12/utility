import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'About DataUtil - Free Online Utility Platform',
      description: 'DataUtil provides dozens of free PDF, image, text, and developer tools that run in your browser. Learn about our mission and privacy-first approach.',
      keywords: 'about datautil, free online tools, privacy-first utilities',
      ogTitle: 'About DataUtil',
      ogDescription: 'Free, fast, privacy-first online tools for PDFs, images, text, and development.',
      ogImage: 'https://www.data-util.com/ogImage.png',
      ogUrl: 'https://www.data-util.com/about',
      canonicalUrl: 'https://www.data-util.com/about'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About DataUtil',
      'description': 'DataUtil provides dozens of free PDF, image, text, and developer tools that run in your browser.',
      'url': 'https://www.data-util.com/about'
    });
  }
}
