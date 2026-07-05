import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule, FormsModule],
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
              [(ngModel)]="email"
              name="email"
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
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  protected email = '';
  protected readonly subscribed = signal(false);

  protected subscribe(): void {
    if (this.email) {
      console.log('Subscribing:', this.email);
      this.subscribed.set(true);
      this.email = '';
      setTimeout(() => this.subscribed.set(false), 5000);
    }
  }
}
