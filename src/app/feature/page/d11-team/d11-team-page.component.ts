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
import {
  D11MatchBase,
  D11TeamSeasonStat,
  PlayerSeasonStat,
  Season,
  SeasonApiService,
} from '@app/core/api';
import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { Position } from '@app/core/api/model/position.model';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { of } from 'rxjs';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { D11TeamHeaderCardComponent } from '@app/feature/card/d11-team-header-card/d11-team-header-card.component';
import { D11TeamMatchesComponent } from '@app/feature/component/d11-team-matches/d11-team-matches.component';
import { TeamPlayerSeasonStatsComponent } from '@app/feature/component/team-player-season-stats/team-player-season-stats.component';
import { D11TeamSeasonHistoryComponent } from '@app/feature/component/d11-team-season-history/d11-team-season-history.component';

@Component({
  selector: 'app-d11-team-page',
  imports: [
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    D11TeamHeaderCardComponent,
    D11TeamMatchesComponent,
    TeamPlayerSeasonStatsComponent,
    D11TeamSeasonHistoryComponent,
  ],
  templateUrl: './d11-team-page.component.html',
})
export class D11TeamPageComponent {
  d11TeamId = input.required({ transform: numberAttribute });
  seasonId = input(undefined, { transform: numberAttribute });

  protected rxD11Team = rxResource<D11TeamBase, number>({
    params: () => this.d11TeamId(),
    stream: ({ params }) => this.d11TeamApiService.getById(params),
  });
  protected rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });
  protected rxD11Matches = rxResource<
    D11MatchBase[],
    { d11TeamId: number; seasonId: number } | undefined
  >({
    params: () => {
      const seasonId = this.currentSeason()?.id;
      const d11TeamId = this.d11TeamId();
      if (seasonId == null) return undefined;
      return { d11TeamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.d11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId(
        params.d11TeamId,
        params.seasonId,
      );
    },
  });
  protected rxPlayerSeasonStats = rxResource<
    PlayerSeasonStat[],
    { d11TeamId: number; seasonId: number } | undefined
  >({
    params: () => {
      const seasonId = this.currentSeason()?.id;
      const d11TeamId = this.d11TeamId();
      if (seasonId == null) return undefined;
      return { d11TeamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.d11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId(
        params.d11TeamId,
        params.seasonId,
      );
    },
  });
  protected rxPositions = rxResource<Position[], void>({
    stream: () => this.positionApiService.getPositions(),
  });
  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number>({
    params: () => this.d11TeamId(),
    stream: ({ params }) =>
      this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsByD11TeamId(params),
  });

  protected currentSeason = computed(() => {
    const seasons = this.rxSeasons.value();
    const seasonId = this.seasonId();
    return (
      (seasonId != null ? seasons?.find((season) => season.id === seasonId) : undefined) ??
      seasons?.[0]
    );
  });

  protected model = computed(() => {
    const season = this.currentSeason();
    const d11TeamSeasonStats = this.rxD11TeamSeasonStats.value() ?? [];
    return {
      d11Team: this.rxD11Team.value(),
      season,
      seasons: this.rxSeasons.value(),
      d11Matches: this.rxD11Matches.value() ?? [],
      playerSeasonStats: this.rxPlayerSeasonStats.value() ?? [],
      positions: this.rxPositions.value() ?? [],
      d11TeamSeasonStats,
      d11TeamSeasonStat: d11TeamSeasonStats.find((stat) => stat.season.id === season?.id),
    };
  });

  protected isLoading = computed(
    () =>
      this.rxD11Team.isLoading() ||
      this.rxSeasons.isLoading() ||
      this.rxD11Matches.isLoading() ||
      this.rxPlayerSeasonStats.isLoading(),
  );

  protected activeTab = '0';

  private seasonApiService = inject(SeasonApiService);
  private d11TeamApiService = inject(D11TeamApiService);
  private d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);
  private positionApiService = inject(PositionApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
    effect(() => {
      this.d11TeamId();
      this.seasonId();
      this.activeTab = '0';
      window.scrollTo({ top: 0 });
    });
  }

  protected navigateToSeason(stat: D11TeamSeasonStat): void {
    this.routerService.navigateToD11Team(this.d11TeamId(), stat.season.id);
  }
}
