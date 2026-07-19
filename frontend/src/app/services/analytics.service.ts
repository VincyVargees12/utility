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
    this.setupGtag();
    this.loadTagScript(measurementId);

    window.gtag?.('js', new Date());
    // Disable automatic page views and track them on router navigation.
    window.gtag?.('config', measurementId, { send_page_view: false });

    this.trackInitialPage();
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

  private trackInitialPage(): void {
    window.gtag?.('config', this.measurementId, {
      page_path: this.router.url
    });
  }

  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        window.gtag?.('config', this.measurementId, {
          page_path: event.urlAfterRedirects
        });
      });
  }
}
