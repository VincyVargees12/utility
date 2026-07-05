import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="page-content">
      <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch with our team - Coming soon</p>
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    .page-content {
      min-height: 80vh;
      padding: 8rem 0 4rem;
    }
    h1 {
      font-size: 3rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 1rem;
    }
    :host-context(.dark) h1 {
      color: #f1f5f9;
    }
  `]
})
export class ContactComponent {}
