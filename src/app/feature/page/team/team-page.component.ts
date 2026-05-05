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
  MatchBase,
  PlayerSeasonStat,
  Season,
  SeasonApiService,
  Team,
  TeamSeasonStat,
} from '@app/core/api';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { of } from 'rxjs';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TeamHeaderCardComponent } from './team-header-card/team-header-card.component';
import { TeamMatchesCardComponent } from './team-matches-card/team-matches-card.component';
import { TeamPlayerSeasonStatsCardComponent } from './team-player-season-stats-card/team-player-season-stats-card.component';
import { TeamSeasonHistoryCardComponent } from './team-season-history-card/team-season-history-card.component';

@Component({
  selector: 'app-team-page',
  imports: [
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    TeamHeaderCardComponent,
    TeamMatchesCardComponent,
    TeamPlayerSeasonStatsCardComponent,
    TeamSeasonHistoryCardComponent,
  ],
  templateUrl: './team-page.component.html',
})
export class TeamPageComponent {
  teamId = input.required({ transform: numberAttribute });
  seasonId = input(undefined, { transform: numberAttribute });

  protected rxTeam = rxResource<Team, number>({
    params: () => this.teamId(),
    stream: ({ params }) => this.teamApiService.getById(params),
  });
  protected rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });
  protected rxMatches = rxResource<MatchBase[], { teamId: number; seasonId: number } | undefined>({
    params: () => {
      const seasonId = this.currentSeason()?.id;
      const teamId = this.teamId();
      if (seasonId == null) return undefined;
      return { teamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.teamApiService.getMatchesByTeamIdAndSeasonId(params.teamId, params.seasonId);
    },
  });
  protected rxPlayerSeasonStats = rxResource<
    PlayerSeasonStat[],
    { teamId: number; seasonId: number } | undefined
  >({
    params: () => {
      const seasonId = this.currentSeason()?.id;
      const teamId = this.teamId();
      if (seasonId == null) return undefined;
      return { teamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.teamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId(
        params.teamId,
        params.seasonId,
      );
    },
  });
  protected rxTeamSeasonStats = rxResource<TeamSeasonStat[], number>({
    params: () => this.teamId(),
    stream: ({ params }) => this.teamSeasonStatApiService.getTeamSeasonStatsByTeamId(params),
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
    const teamSeasonStats = this.rxTeamSeasonStats.value() ?? [];
    return {
      team: this.rxTeam.value(),
      season,
      seasons: this.rxSeasons.value(),
      matches: this.rxMatches.value() ?? [],
      playerSeasonStats: this.rxPlayerSeasonStats.value() ?? [],
      teamSeasonStats,
      teamSeasonStat: teamSeasonStats.find((stat) => stat.season.id === season?.id),
    };
  });

  protected isLoading = computed(
    () =>
      this.rxTeam.isLoading() ||
      this.rxSeasons.isLoading() ||
      this.rxMatches.isLoading() ||
      this.rxPlayerSeasonStats.isLoading(),
  );

  protected activeTab = '0';

  private seasonApiService = inject(SeasonApiService);
  private teamApiService = inject(TeamApiService);
  private teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
    effect(() => {
      this.teamId();
      this.seasonId();
      this.activeTab = '0';
      window.scrollTo({ top: 0 });
    });
  }

  protected navigateToSeason(stat: TeamSeasonStat): void {
    this.routerService.navigateToTeam(this.teamId(), stat.season.id);
  }
}
