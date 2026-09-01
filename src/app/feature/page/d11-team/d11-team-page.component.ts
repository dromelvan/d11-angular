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
import { D11TeamBase, D11TeamSeasonStat, Season, SeasonApiService } from '@app/core/api';
import { PRIMARY } from '@app/app.theme';
import { BreakpointService } from '@app/core/breakpoint/breakpoint.service';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { HeroContainerComponent } from '@app/feature/hero/hero-container/hero-container.component';
import { D11TeamHistoryStatsSectionComponent } from '@app/feature/section/d11-team-history-stats-section/d11-team-history-stats-section.component';
import { D11TeamPlayerSeasonStatsSectionComponent } from '@app/feature/section/d11-team-player-season-stats-section/d11-team-player-season-stats-section.component';
import { D11TeamSeasonMatchesSectionComponent } from '@app/feature/section/d11-team-season-matches-section/d11-team-season-matches-section.component';
import { D11TeamSeasonStatSectionComponent } from '@app/feature/section/d11-team-season-stat-section/d11-team-season-stat-section.component';

@Component({
  selector: 'app-d11-team-page',
  imports: [
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    HeroContainerComponent,
    D11TeamSeasonStatSectionComponent,
    D11TeamPlayerSeasonStatsSectionComponent,
    D11TeamSeasonMatchesSectionComponent,
    D11TeamHistoryStatsSectionComponent,
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
      d11TeamSeasonStat: d11TeamSeasonStats.find((stat) => stat.season.id === season?.id),
    };
  });

  protected activeTab = '0';
  protected readonly isSmOrUp = inject(BreakpointService).isSmOrUp;

  private seasonApiService = inject(SeasonApiService);
  private d11TeamApiService = inject(D11TeamApiService);
  private d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);
  private pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.pageContextService.register(destroyRef, {
      title: computed(() => this.model().d11Team?.name),
      subtitle: computed(() => {
        const name = this.model().season?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: computed(() => PRIMARY),
    });
    effect(() => {
      this.d11TeamId();
      this.seasonId();
      this.activeTab = '0';
      window.scrollTo({ top: 0 });
    });
  }
}
