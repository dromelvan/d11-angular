import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PlayerApiService, PlayerSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { SectionComponent } from '@app/shared/section/section.component';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-player-career-stats-section',
  templateUrl: './player-career-stats-section.component.html',
  imports: [SectionComponent, ProgressSpinner, TeamImgComponent],
  host: { class: 'app-fill' },
})
export class PlayerCareerStatsSectionComponent {
  readonly playerId = input.required<number>();

  protected readonly rxPlayerSeasonStats = rxResource<PlayerSeasonStat[], number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getPlayerSeasonStatsByPlayerId(params),
  });

  protected readonly isLoading = computed(() => this.rxPlayerSeasonStats.isLoading());
  protected readonly playerSeasonStats = computed(() => this.rxPlayerSeasonStats.value() ?? []);

  protected readonly summary = computed(() => {
    const playerSeasonStats = this.playerSeasonStats();
    const seasons = playerSeasonStats.length;
    const ratedStats = playerSeasonStats.filter((s) => s.rating > 0);
    const avgRanking =
      ratedStats.length > 0
        ? ratedStats.reduce((sum, s) => sum + s.ranking, 0) / ratedStats.length
        : undefined;
    const points = playerSeasonStats.reduce((sum, s) => sum + s.points, 0);

    return { seasons, avgRanking, points };
  });

  private readonly playerApiService = inject(PlayerApiService);
  private readonly routerService = inject(RouterService);

  protected navigateToPlayer(playerSeasonStat: PlayerSeasonStat): void {
    this.routerService.navigateToPlayer(playerSeasonStat.player.id, playerSeasonStat.season.id);
  }
}
