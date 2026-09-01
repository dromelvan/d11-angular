import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamSeasonStat, D11TeamSeasonStatApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { SectionComponent } from '@app/shared/section/section.component';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-d11-team-history-stats-section',
  templateUrl: './d11-team-history-stats-section.component.html',
  imports: [SectionComponent, ProgressSpinner],
  host: { class: 'app-fill' },
})
export class D11TeamHistoryStatsSectionComponent {
  readonly d11TeamId = input.required<number>();

  protected readonly rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number>({
    params: () => this.d11TeamId(),
    stream: ({ params }) =>
      this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsByD11TeamId(params),
  });

  protected readonly isLoading = computed(() => this.rxD11TeamSeasonStats.isLoading());
  protected readonly d11TeamSeasonStats = computed(() => this.rxD11TeamSeasonStats.value() ?? []);

  protected readonly summary = computed(() => {
    const d11TeamSeasonStats = this.d11TeamSeasonStats();
    const seasons = d11TeamSeasonStats.length;
    const avgRanking =
      seasons > 0
        ? Math.round(
            (d11TeamSeasonStats.reduce((sum, stat) => sum + stat.ranking, 0) / seasons) * 10,
          ) / 10
        : undefined;
    const points = d11TeamSeasonStats.reduce((sum, stat) => sum + stat.points, 0);

    return { seasons, avgRanking, points };
  });

  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);
  private readonly routerService = inject(RouterService);

  protected navigateToD11Team(d11TeamSeasonStat: D11TeamSeasonStat): void {
    this.routerService.navigateToD11Team(this.d11TeamId(), d11TeamSeasonStat.season.id);
  }
}
