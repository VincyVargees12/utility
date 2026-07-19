import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AnalyticsService } from './services/analytics.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
  `,
  styles: []
})
export class App implements OnInit {
  private analyticsService = inject(AnalyticsService);

  ngOnInit(): void {
    this.analyticsService.init(environment.gaMeasurementId);
  }
}
