import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-choose',
  imports: [CommonModule],
  template: `
    <section class="section why-choose">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose DataUtil?</h2>
          <p class="section-subtitle">Built for speed, privacy, and ease of use</p>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-card">
              <div class="feature-icon" [innerHTML]="feature.icon"></div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './why-choose.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhyChooseComponent {
  protected readonly features = [
    {
      title: 'Lightning Fast',
      description: 'All tools process instantly with no waiting time',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
    },
    {
      title: 'Privacy First',
      description: 'Your data never leaves your browser when possible',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'
    },
    {
      title: 'No Installation',
      description: 'Access all tools directly from your browser',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>'
    },
    {
      title: '100% Secure',
      description: 'Enterprise-grade security for all operations',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
    },
    {
      title: 'Completely Free',
      description: 'No hidden costs, no subscriptions required',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    },
    {
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices and screen sizes',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'
    }
  ];
}
