import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AnalyticsService } from './services/analytics.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <router-outlet />
    @defer (on viewport; prefetch on idle) {
      <app-footer />
    } @placeholder {
      <div class="footer-placeholder" aria-hidden="true"></div>
    }
  `,
  styles: [`
    .footer-placeholder {
      min-height: 18rem;
    }

    @media (max-width: 767px) {
      .footer-placeholder {
        min-height: 14rem;
      }
    }
  `]
})
export class App implements OnInit {
  private analyticsService = inject(AnalyticsService);

  ngOnInit(): void {
    const initAnalytics = () => this.analyticsService.init(environment.gaMeasurementId);

    if (typeof window === 'undefined') {
      return;
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initAnalytics(), { timeout: 2000 });
      return;
    }

    setTimeout(initAnalytics, 0);
  }
}
