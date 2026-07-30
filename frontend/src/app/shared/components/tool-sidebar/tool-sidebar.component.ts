import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Shared "options panel" shell used by tool pages that show an image/file grid
 * next to a settings sidebar. Handles the sticky/flush-right/dark-mode/mobile-card
 * positioning in one place; each tool page projects its own header, controls, and
 * action button as content since those differ per tool.
 */
@Component({
  selector: 'app-tool-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-sidebar.component.html',
  styleUrl: './tool-sidebar.component.scss'
})
export class ToolSidebarComponent {
  /** Desktop (lg+) width in pixels. Mobile is always full width. */
  @Input() width = 380;

  // Tailwind's arbitrary-value classes must appear as complete literal strings
  // somewhere in scanned source for its content-scanner to generate the CSS —
  // a dynamically-built class name (e.g. `lg:w-[${width}px]`) would silently
  // produce no styles at all. Widths used across tool pages are a small fixed
  // set, so a plain switch keeps every literal class visible to the scanner.
  get widthClass(): string {
    switch (this.width) {
      case 340: return 'lg:w-[340px]';
      case 400: return 'lg:w-[400px]';
      default: return 'lg:w-[380px]';
    }
  }
}
