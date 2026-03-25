import { Component } from '@angular/core';
import { Season, TeamSeasonStat } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeason, fakeTeamSeasonStat } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { SeasonPageComponent } from './season-page.component';

let season: Season;
let teamSeasonStats: TeamSeasonStat[];
let seasonApi: SeasonApiService;
let teamSeasonStatApi: TeamSeasonStatApiService;
let loadingService: LoadingService;
let routerService: RouterService;

@Component({
  template: ` <app-table [seasonId]="seasonId" />`,
  standalone: true,
  imports: [SeasonPageComponent],
})
class HostComponent {
  seasonId: number | undefined = season.id;
}

@Component({
  template: ` <app-table />`,
  standalone: true,
  imports: [SeasonPageComponent],
})
class NoIdHostComponent {}

describe('SeasonPageComponent', () => {
  beforeEach(() => {
    season = fakeSeason();
    teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    teamSeasonStatApi = {
      getTeamSeasonStatsBySeasonId: vi.fn().mockReturnValue(of(teamSeasonStats)),
    } as unknown as TeamSeasonStatApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;
    routerService = { navigateToSeason: vi.fn() } as unknown as RouterService;
  });

  describe('with seasonId', () => {
    beforeEach(async () => {
      await render(HostComponent, {
        providers: [
          { provide: SeasonApiService, useValue: seasonApi },
          { provide: TeamSeasonStatApiService, useValue: teamSeasonStatApi },
          { provide: LoadingService, useValue: loadingService },
          { provide: RouterService, useValue: routerService },
        ],
      });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-season-page')).toBeInTheDocument();
      });
    });

    it('gets all seasons', () => {
      expect(seasonApi.getAll).toHaveBeenCalled();
    });

    it('renders season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(season.name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('Premier League')).toBeInTheDocument();
        for (const stat of teamSeasonStats) {
          const expectedName = stat.team.name.length > 22 ? stat.team.shortName : stat.team.name;
          expect(screen.getByText(expectedName)).toBeInTheDocument();
        }
      });
    });
  });

  describe('without seasonId', () => {
    beforeEach(async () => {
      await render(NoIdHostComponent, {
        providers: [
          { provide: SeasonApiService, useValue: seasonApi },
          { provide: TeamSeasonStatApiService, useValue: teamSeasonStatApi },
          { provide: LoadingService, useValue: loadingService },
          { provide: RouterService, useValue: routerService },
        ],
      });
    });

    it('gets all seasons', () => {
      expect(seasonApi.getAll).toHaveBeenCalled();
    });

    it('renders current season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(season.name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders current season team season stats card', async () => {
      await waitFor(() => {
        for (const stat of teamSeasonStats) {
          const expectedName = stat.team.name.length > 22 ? stat.team.shortName : stat.team.name;
          expect(screen.getByText(expectedName)).toBeInTheDocument();
        }
        expect(screen.getByText('Premier League')).toBeInTheDocument();
      });
    });
  });
});
