import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly categories = [
    { name: 'PDF Tools', route: '/pdf-tools' },
    { name: 'Image Tools', route: '/image-tools' },
    { name: 'Text Tools', route: '/text-tools' },
    { name: 'Developer Tools', route: '/developer-tools' },
    { name: 'Calculators', route: '/calculators' }
  ];

  protected readonly company = [
    { name: 'About Us', route: '/about' },
    { name: 'Contact', route: '/contact' },
    { name: 'Blog', route: '/blog' },
    { name: 'Careers', route: '/careers' }
  ];

  protected readonly legal = [
    { name: 'Privacy Policy', route: '/privacy' },
    { name: 'Terms of Service', route: '/terms' },
    { name: 'Cookie Policy', route: '/cookies' }
  ];
}
