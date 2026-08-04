import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly contactEmail = 'dev@data-util.com';
  copied = signal(false);

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Contact DataUtil - Get in Touch',
      description: 'Have a question, bug report, or feature request for DataUtil? Reach out at dev@data-util.com — we read every message.',
      keywords: 'contact datautil, datautil support, datautil feedback',
      ogTitle: 'Contact DataUtil',
      ogDescription: 'Reach the DataUtil team at dev@data-util.com.',
      ogImage: 'https://www.data-util.com/ogImage.png',
      ogUrl: 'https://www.data-util.com/contact',
      canonicalUrl: 'https://www.data-util.com/contact'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact DataUtil',
      'description': 'Contact the DataUtil team with questions, bug reports, or feature requests.',
      'url': 'https://www.data-util.com/contact'
    });
  }

  copyEmail(): void {
    navigator.clipboard.writeText(this.contactEmail).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
