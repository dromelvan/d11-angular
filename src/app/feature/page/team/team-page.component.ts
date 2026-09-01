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
import { PRIMARY } from '@app/app.theme';
import { BreakpointService } from '@app/core/breakpoint/breakpoint.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { of } from 'rxjs';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { HeroContainerComponent } from '@app/feature/hero/hero-container/hero-container.component';
import { TeamHeroComponent } from '@app/feature/hero/team-hero/team-hero.component';
import { TeamHistoryStatsSectionComponent } from '@app/feature/section/team-history-stats-section/team-history-stats-section.component';
import { TeamPlayerSeasonStatsSectionComponent } from '@app/feature/section/team-player-season-stats-section/team-player-season-stats-section.component';
import { TeamSeasonMatchesSectionComponent } from '@app/feature/section/team-season-matches-section/team-season-matches-section.component';
import { TeamSeasonStatSectionComponent } from '@app/feature/section/team-season-stat-section/team-season-stat-section.component';

@Component({
  selector: 'app-team-page',
  imports: [
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    HeroContainerComponent,
    TeamHeroComponent,
    TeamSeasonStatSectionComponent,
    TeamPlayerSeasonStatsSectionComponent,
    TeamSeasonMatchesSectionComponent,
    TeamHistoryStatsSectionComponent,
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

  protected activeTab = '0';
  protected readonly isSmOrUp = inject(BreakpointService).isSmOrUp;

  private seasonApiService = inject(SeasonApiService);
  private teamApiService = inject(TeamApiService);
  private teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private routerService = inject(RouterService);
  private pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.pageContextService.register(destroyRef, {
      title: computed(() => this.model().team?.name),
      subtitle: computed(() => {
        const name = this.model().season?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: computed(() => this.model().team?.colour ?? PRIMARY),
    });
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
