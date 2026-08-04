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
    { name: 'PDF Tools', route: '/categories/pdf' },
    { name: 'Image Tools', route: '/categories/images' },
    { name: 'Text Tools', route: '/categories/text' },
    { name: 'Developer Tools', route: '/categories/developer' }
  ];

  protected readonly company = [
    { name: 'About Us', route: '/about' },
    { name: 'Contact', route: '/contact' }
  ];
}
