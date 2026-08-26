import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Player, PlayerApiService, PlayerSeasonStat } from '@app/core/api';
import { PRIMARY } from '@app/app.theme';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { PlayerHeroComponent } from '@app/feature/hero/player-hero/player-hero.component';
import { HeroContainerComponent } from '@app/feature/hero/hero-container/hero-container.component';
import { PlayerSeasonStatSectionComponent } from '@app/feature/section/player-season-stat-section/player-season-stat-section.component';
import { PlayerCareerStatsSectionComponent } from '@app/feature/section/player-career-stats-section/player-career-stats-section.component';
import { PlayerSeasonMatchStatsSectionComponent } from '@app/feature/section/player-season-match-stats-section/player-season-match-stats-section.component';

@Component({
  selector: 'app-player-page',
  imports: [
    PlayerHeroComponent,
    HeroContainerComponent,
    PlayerSeasonStatSectionComponent,
    PlayerCareerStatsSectionComponent,
    PlayerSeasonMatchStatsSectionComponent,
  ],
  templateUrl: './player-page.component.html',
})
export class PlayerPageComponent {
  playerId = input.required({ transform: numberAttribute });
  seasonId = input(undefined, { transform: numberAttribute });

  protected rxPlayer = rxResource<Player, number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getById(params),
  });
  protected rxPlayerSeasonStats = rxResource<PlayerSeasonStat[], number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getPlayerSeasonStatsByPlayerId(params),
  });

  protected model = computed(() => {
    const player = this.rxPlayer.value();
    const playerSeasonStats = this.rxPlayerSeasonStats.value();
    const seasonId = this.seasonId();

    const playerSeasonStat =
      (seasonId != null
        ? playerSeasonStats?.find((playerSeasonStat) => playerSeasonStat.season.id === seasonId)
        : undefined) ?? playerSeasonStats?.[0];

    return { player, playerSeasonStat } as const;
  });

  private playerApiService = inject(PlayerApiService);
  private pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.pageContextService.register(destroyRef, {
      title: computed(() => this.rxPlayer.value()?.name),
      subtitle: computed(() => {
        const name = this.model().playerSeasonStat?.season?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: computed(() => this.model().playerSeasonStat?.team.colour ?? PRIMARY),
    });
    effect(() => {
      this.playerId();
      this.seasonId();
      window.scrollTo({ top: 0 });
    });
  }
}
