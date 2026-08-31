import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { RouterService } from '@app/core/router/router.service';
import { SectionComponent } from '@app/shared/section/section.component';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-team-history-stats-section',
  templateUrl: './team-history-stats-section.component.html',
  imports: [SectionComponent, ProgressSpinner],
  host: { class: 'app-fill' },
})
export class TeamHistoryStatsSectionComponent {
  readonly teamId = input.required<number>();

  protected readonly rxTeamSeasonStats = rxResource<TeamSeasonStat[], number>({
    params: () => this.teamId(),
    stream: ({ params }) => this.teamSeasonStatApiService.getTeamSeasonStatsByTeamId(params),
  });

  protected readonly isLoading = computed(() => this.rxTeamSeasonStats.isLoading());
  protected readonly teamSeasonStats = computed(() => this.rxTeamSeasonStats.value() ?? []);

  protected readonly summary = computed(() => {
    const teamSeasonStats = this.teamSeasonStats();
    const seasons = teamSeasonStats.length;
    const avgRanking =
      seasons > 0
        ? teamSeasonStats.reduce((sum, stat) => sum + stat.ranking, 0) / seasons
        : undefined;
    const points = teamSeasonStats.reduce((sum, stat) => sum + stat.points, 0);

    return { seasons, avgRanking, points };
  });

  private readonly teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private readonly routerService = inject(RouterService);

  protected navigateToTeam(teamSeasonStat: TeamSeasonStat): void {
    this.routerService.navigateToTeam(this.teamId(), teamSeasonStat.season.id);
  }
}
