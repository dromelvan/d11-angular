import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  Player,
  PlayerApiService,
  PlayerSeasonStat,
  Season,
  SeasonApiService,
} from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { PlayerHeaderCardComponent } from './player-header-card/player-header-card.component';
import { PlayerInfoCardComponent } from './player-info-card/player-info-card.component';
import { PlayerSeasonSummaryCardComponent } from './player-season-summary-card/player-season-summary-card.component';
import { PlayerMatchStatsCardComponent } from './player-match-stats-card/player-match-stats-card.component';
import { PlayerSeasonStatCardComponent } from './player-season-stat-card/player-season-stat-card.component';

@Component({
  selector: 'app-player-page',
  imports: [
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    PlayerInfoCardComponent,
    PlayerSeasonSummaryCardComponent,
    PlayerHeaderCardComponent,
    PlayerMatchStatsCardComponent,
    PlayerSeasonStatCardComponent,
  ],
  templateUrl: './player-page.component.html',
})
export class PlayerPageComponent {
  playerId = input.required({ transform: numberAttribute });
  seasonId = input(undefined, { transform: numberAttribute });

  protected rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });
  protected rxPlayer = rxResource<Player, number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getById(params),
  });
  protected rxPlayerSeasonStats = rxResource<PlayerSeasonStat[], number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getPlayerSeasonStatsByPlayerId(params),
  });

  protected model = computed(() => {
    const seasons = this.rxSeasons.value();
    const player = this.rxPlayer.value();
    const playerSeasonStats = this.rxPlayerSeasonStats.value();
    const seasonId = this.seasonId();

    const season =
      (seasonId != null ? seasons?.find((season) => season.id === seasonId) : undefined) ??
      seasons?.[0];

    const playerSeasonStat = playerSeasonStats?.find(
      (playerSeasonStat) => playerSeasonStat.season.id === season?.id,
    );

    return {
      player,
      seasons,
      season,
      playerSeasonStat,
      playerSeasonStats: playerSeasonStats,
      hasPlayerSeasonStat: !!playerSeasonStat,
    } as const;
  });
  protected isLoading = computed(
    () =>
      this.rxSeasons.isLoading() ||
      this.rxPlayer.isLoading() ||
      this.rxPlayerSeasonStats.isLoading(),
  );

  protected activeTab = '0';

  private seasonApiService = inject(SeasonApiService);
  private playerApiService = inject(PlayerApiService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }
}
