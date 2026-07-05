import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule],
  template: `
    <section class="section statistics">
      <div class="container">
        <div class="stats-grid">
          @for (stat of stats; track stat.label) {
            <div class="stat-card">
              <div class="stat-number">{{ stat.value() }}{{ stat.suffix }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-description">{{ stat.description }}</div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  protected readonly stats = [
    {
      value: signal(0),
      target: 1000,
      suffix: '+',
      label: 'Tools Planned',
      description: 'Comprehensive suite of utilities'
    },
    {
      value: signal(0),
      target: 99.9,
      suffix: '%',
      label: 'Uptime',
      description: 'Always available when you need'
    },
    {
      value: signal(0),
      target: 100,
      suffix: '%',
      label: 'Free',
      description: 'No hidden charges ever'
    },
    {
      value: signal(0),
      target: 2,
      suffix: 's',
      label: 'Avg Speed',
      description: 'Lightning fast processing'
    }
  ];

  ngOnInit() {
    this.animateCounters();
  }

  private animateCounters(): void {
    this.stats.forEach(stat => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          stat.value.set(stat.target);
          clearInterval(timer);
        } else {
          stat.value.set(Math.floor(current * 10) / 10);
        }
      }, duration / steps);
    });
  }
}
