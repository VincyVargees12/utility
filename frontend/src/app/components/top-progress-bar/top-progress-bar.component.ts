import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  NavigationSkipped
} from '@angular/router';

/** Delay before showing the bar at all, so instant/cached route changes never flash it. */
const SHOW_DELAY_MS = 120;
/** How long the bar stays at 100% before fading out, so the completion is visible. */
const HIDE_DELAY_MS = 250;

@Component({
  selector: 'app-top-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="top-progress-track" aria-hidden="true">
        <div class="top-progress-bar" [style.width.%]="progress()"></div>
      </div>
    }
  `,
  styles: [`
    .top-progress-track {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 2000;
      pointer-events: none;
      background: transparent;
    }

    .top-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #60a5fa);
      box-shadow: 0 0 8px rgba(37, 99, 235, 0.6);
      transition: width 0.2s ease-out, opacity 0.3s ease-in;
    }
  `]
})
export class TopProgressBarComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  visible = signal(false);
  progress = signal(0);

  private showTimer?: ReturnType<typeof setTimeout>;
  private incrementTimer?: ReturnType<typeof setInterval>;
  private hideTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.start();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof NavigationSkipped
      ) {
        this.finish();
      }
    });

    this.destroyRef.onDestroy(() => {
      clearTimeout(this.showTimer);
      clearInterval(this.incrementTimer);
      clearTimeout(this.hideTimer);
    });
  }

  private start(): void {
    clearTimeout(this.showTimer);
    clearInterval(this.incrementTimer);
    clearTimeout(this.hideTimer);
    this.progress.set(0);

    // Only reveal the bar once the navigation has actually taken a moment — avoids a flash on cached/instant routes.
    this.showTimer = setTimeout(() => {
      this.visible.set(true);
      this.progress.set(8);

      // Simulated progress: creep toward 90% while the lazy chunk loads, decelerating so it never looks "stuck at 100%" early.
      this.incrementTimer = setInterval(() => {
        const current = this.progress();
        if (current >= 90) return;
        const step = current < 50 ? 8 : current < 75 ? 4 : 1;
        this.progress.set(Math.min(90, current + step));
      }, 200);
    }, SHOW_DELAY_MS);
  }

  private finish(): void {
    clearTimeout(this.showTimer);
    clearInterval(this.incrementTimer);

    if (!this.visible()) {
      // Navigation finished before the show-delay elapsed — never flash the bar for a fast/cached route.
      this.progress.set(0);
      return;
    }

    this.progress.set(100);
    this.hideTimer = setTimeout(() => {
      this.visible.set(false);
      this.progress.set(0);
    }, HIDE_DELAY_MS);
  }
}
