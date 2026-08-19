import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { RouterService } from '@app/core/router/router.service';
import { FormMatchPointsComponent } from '@app/shared/form-match-points/form-match-points.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-d11-team-season-stats-accordion',
  templateUrl: './d11-team-season-stats-accordion.component.html',
  styleUrl: './d11-team-season-stats-accordion.component.css',
  imports: [
    FormMatchPointsComponent,
    IconComponent,
    SvgIconComponent,
    D11TeamImgComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ProgressSpinner,
  ],
  host: { class: 'min-h-211' },
})
export class D11TeamSeasonStatsAccordionComponent {
  readonly seasonId = input.required<number>();

  protected readonly d11TeamSeasonStats = computed(() => this.rxD11TeamSeasonStats.value() ?? []);
  protected readonly isLoading = computed(() => this.rxD11TeamSeasonStats.isLoading());

  private readonly rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number>({
    params: () => this.seasonId(),
    stream: ({ params }) =>
      this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsBySeasonId(params),
  });

  private readonly routerService = inject(RouterService);
  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);

  protected navigateToD11Team(stat: D11TeamSeasonStat): void {
    this.routerService.navigateToD11Team(stat.d11Team.id, stat.season.id);
  }

  protected rowBackgroundColor(index: number): string | null {
    if (index === 0) return 'var(--p-primary-color)';
    if (index < 4) return 'var(--p-primary-300)';
    if (index >= this.d11TeamSeasonStats().length - 3) return 'var(--p-surface-500)';
    return null;
  }

  protected rowTextColor(index: number): string | null {
    if (index < 4 || index >= this.d11TeamSeasonStats().length - 3) {
      return 'var(--p-primary-contrast-color)';
    }
    return null;
  }
}
