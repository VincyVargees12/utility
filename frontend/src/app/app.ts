import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AnalyticsService } from './services/analytics.service';
import { environment } from '../environments/environment';
import { signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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

    // Track route changes to show/hide footer
    this.router.events.subscribe(() => {
      this.isHomePage.set(this.router.url === '/');
    });

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initAnalytics(), { timeout: 2000 });
      return;
    }

    setTimeout(initAnalytics, 0);
  }
}
