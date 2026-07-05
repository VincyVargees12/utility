import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  setPageMeta(pageMeta: PageMeta): void {
    // Set title
    this.titleService.setTitle(pageMeta.title);

    // Set basic meta tags
    this.meta.updateTag({ name: 'description', content: pageMeta.description });
    
    if (pageMeta.keywords) {
      this.meta.updateTag({ name: 'keywords', content: pageMeta.keywords });
    }

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: pageMeta.ogTitle || pageMeta.title });
    this.meta.updateTag({ property: 'og:description', content: pageMeta.ogDescription || pageMeta.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    if (pageMeta.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: pageMeta.ogImage });
    }
    
    if (pageMeta.ogUrl) {
      this.meta.updateTag({ property: 'og:url', content: pageMeta.ogUrl });
    }

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: pageMeta.twitterCard || 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageMeta.ogTitle || pageMeta.title });
    this.meta.updateTag({ name: 'twitter:description', content: pageMeta.ogDescription || pageMeta.description });
    
    if (pageMeta.ogImage) {
      this.meta.updateTag({ name: 'twitter:image', content: pageMeta.ogImage });
    }

    // Canonical URL
    if (pageMeta.canonicalUrl) {
      this.updateCanonicalUrl(pageMeta.canonicalUrl);
    }
  }

  private updateCanonicalUrl(url: string): void {
    if (!this.isBrowser) return;
    
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  addStructuredData(data: any): void {
    if (!this.isBrowser) return;
    
    let script: HTMLScriptElement | null = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  }
}
