import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  template: `
    <section class="section faq">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">Everything you need to know about DataUtil</p>
        </div>

        <div class="faq-list">
          @for (item of faqs; track item.question; let i = $index) {
            <div class="faq-item" [class.active]="activeIndex() === i">
              <button class="faq-question" (click)="toggle(i)">
                <span>{{ item.question }}</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              @if (activeIndex() === i) {
                <div class="faq-answer">{{ item.answer }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent {
  protected readonly activeIndex = signal<number | null>(null);

  protected readonly faqs = [
    {
      question: 'Is DataUtil completely free to use?',
      answer: 'Yes! DataUtil is 100% free. We believe everyone should have access to powerful online utilities without any cost.'
    },
    {
      question: 'Do you store my uploaded files?',
      answer: 'No. Most tools process files directly in your browser. For tools that require server processing, files are automatically deleted immediately after processing.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account is required to use our tools. However, creating an account allows you to save favorites and access your history.'
    },
    {
      question: 'Are there any file size limits?',
      answer: 'File size limits vary by tool. Most tools support files up to 50MB. Premium users get increased limits and priority processing.'
    },
    {
      question: 'Can I use DataUtil on mobile devices?',
      answer: 'Absolutely! DataUtil is fully responsive and works perfectly on all devices including smartphones and tablets.'
    },
    {
      question: 'How do you ensure my data privacy?',
      answer: 'We take privacy seriously. Client-side tools never send data to our servers. For server-side tools, data is encrypted during transfer and immediately deleted after processing.'
    }
  ];

  protected toggle(index: number): void {
    this.activeIndex.update(current => current === index ? null : index);
  }
}
