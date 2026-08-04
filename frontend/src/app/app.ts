import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopProgressBarComponent } from './components/top-progress-bar/top-progress-bar.component';
import { AnalyticsService } from './services/analytics.service';
import { environment } from '../environments/environment';
import { signal } from '@angular/core';

/** Matches a session so a stale-chunk reload is only attempted once per deploy, not looped forever. */
const CHUNK_RELOAD_FLAG = 'dataUtil:chunkReloadAttempted';
const CHUNK_LOAD_FAILURE_PATTERN = /Failed to fetch dynamically imported module|ChunkLoadError|Loading chunk .* failed|Importing a module script failed/i;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, TopProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-top-progress-bar />
    <app-navbar />
    <router-outlet />
    @if (isHomePage()) {
      @defer (on viewport; prefetch on idle) {
        <app-footer />
      } @placeholder {
        <div class="footer-placeholder" aria-hidden="true"></div>
      }
    }
  `,
  styles: [`
    .footer-placeholder {
      background: #0f172a;
      border-top: 1px solid #1e293b;
      min-height: 25rem;
    }

    @media (max-width: 767px) {
      .footer-placeholder {
        min-height: 54rem;
      }
    }
  `]
})
export class App implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);
  
  isHomePage = signal(true);

  ngOnInit(): void {
    const initAnalytics = () => this.analyticsService.init(environment.gaMeasurementId);

    if (typeof window === 'undefined') {
      return;
    }

    // Track route changes to show/hide footer, and self-heal from stale lazy-chunk references after a new deploy.
    this.router.events.subscribe(event => {
      this.isHomePage.set(this.router.url === '/');

      if (event instanceof NavigationEnd) {
        // A clean navigation succeeded — allow a future stale-chunk error to trigger another reload attempt.
        sessionStorage.removeItem(CHUNK_RELOAD_FLAG);
      } else if (event instanceof NavigationError) {
        this.recoverFromStaleChunk(event.error);
      }
    });

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initAnalytics(), { timeout: 2000 });
      return;
    }

    setTimeout(initAnalytics, 0);
  }

  /**
   * A lazy route chunk can go missing the moment a new deploy replaces its content-hashed filename —
   * any tab still holding the previous build's references gets a hard failure here. One automatic
   * reload picks up the fresh index.html/main.js with correct current chunk hashes and recovers silently.
   */
  private recoverFromStaleChunk(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    if (!CHUNK_LOAD_FAILURE_PATTERN.test(message)) return;
    if (sessionStorage.getItem(CHUNK_RELOAD_FLAG)) return;

    sessionStorage.setItem(CHUNK_RELOAD_FLAG, '1');
    window.location.reload();
  }
}
