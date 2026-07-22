import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule],
  template: `
    <section class="section newsletter">
      <div class="container">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <h2 class="newsletter-title">Stay Updated</h2>
            <p class="newsletter-subtitle">
              Get notified when we add new tools and features
            </p>
          </div>

          <form class="newsletter-form" (ngSubmit)="subscribe()">
            <input
              type="email"
              placeholder="Enter your email"
              class="newsletter-input"
              [value]="email()"
              (input)="updateEmail($event)"
              required
            />
            <button type="submit" class="newsletter-btn">
              Subscribe
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </form>

          @if (subscribed()) {
            <div class="success-message">
              ✓ Thank you for subscribing!
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterComponent {
  protected readonly email = signal('');
  protected readonly subscribed = signal(false);

  protected updateEmail(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }

  protected subscribe(): void {
    const email = this.email().trim();

    if (email) {
      console.log('Subscribing:', email);
      this.subscribed.set(true);
      this.email.set('');
      setTimeout(() => this.subscribed.set(false), 5000);
    }
  }
}
