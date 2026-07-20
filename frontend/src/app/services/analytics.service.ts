import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private initialized = false;
  private measurementId = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {}

  init(measurementId: string): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized || !measurementId) {
      return;
    }

    this.measurementId = measurementId;

    // We no longer need to manually load the script here because it's in index.html,
    // but we'll ensure window.gtag exists just in case.
    if (!window.gtag) {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer.push(args);
      };
    }

    // Explicitly send the first page view for the current path
    window.gtag('event', 'page_view', {
      page_path: this.router.url,
      page_location: window.location.href
    });

    this.trackRouteChanges();
    this.initialized = true;
  }

  private setupGtag(): void {
    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer.push(args);
      };
    }
  }

  private loadTagScript(measurementId: string): void {
    const scriptId = 'ga4-gtag-script';

    if (this.document.getElementById(scriptId)) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    this.document.head.appendChild(script);
  }

  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (window.gtag) {
          window.gtag('event', 'page_view', {
            page_path: event.urlAfterRedirects,
            page_location: window.location.href,
            page_title: this.document.title
          });
          console.debug('[Analytics] Page View:', event.urlAfterRedirects);
        }
      });
  }
}
