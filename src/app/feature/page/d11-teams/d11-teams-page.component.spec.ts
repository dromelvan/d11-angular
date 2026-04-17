import { Component } from '@angular/core';
import { D11TeamSeasonStat, Season } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11TeamBase, fakeD11TeamSeasonStat, fakePosition, fakeSeason } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { D11TeamsPageComponent } from './d11-teams-page.component';

let seasons: Season[];
let d11TeamSeasonStats: D11TeamSeasonStat[];
let seasonApi: SeasonApiService;
let d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
let d11TeamApi: D11TeamApiService;
let positionApi: PositionApiService;
let loadingService: LoadingService;
let routerService: RouterService;

@Component({
  template: ` <app-d11-teams-page [seasonId]="seasonId" />`,
  standalone: true,
  imports: [D11TeamsPageComponent],
})
class HostComponent {
  seasonId: number | undefined = seasons[1].id;
}

@Component({
  template: ` <app-d11-teams-page />`,
  standalone: true,
  imports: [D11TeamsPageComponent],
})
class NoIdHostComponent {}

describe('D11TeamsPageComponent', () => {
  beforeEach(() => {
    seasons = [
      { ...fakeSeason(), date: '2023-08-01' },
      { ...fakeSeason(), date: '2022-08-01' },
      { ...fakeSeason(), date: '2021-08-01' },
    ];

    d11TeamSeasonStats = [
      { ...fakeD11TeamSeasonStat(), d11Team: { ...fakeD11TeamBase(), name: 'D11Team2' } },
      { ...fakeD11TeamSeasonStat(), d11Team: { ...fakeD11TeamBase(), name: 'D11Team1' } },
    ];

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsBySeasonId: vi.fn().mockReturnValue(of(d11TeamSeasonStats)),
    } as unknown as D11TeamSeasonStatApiService;

    positionApi = {
      getPositions: vi.fn().mockReturnValue(of([fakePosition(), fakePosition()])),
    } as unknown as PositionApiService;

    d11TeamApi = {
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;
    routerService = { navigateToD11Teams: vi.fn() } as unknown as RouterService;
  });

  const providers = () => [
    { provide: SeasonApiService, useValue: seasonApi },
    { provide: D11TeamSeasonStatApiService, useValue: d11TeamSeasonStatApi },
    { provide: PositionApiService, useValue: positionApi },
    { provide: D11TeamApiService, useValue: d11TeamApi },
    { provide: LoadingService, useValue: loadingService },
    { provide: RouterService, useValue: routerService },
  ];

  describe('with seasonId', () => {
    beforeEach(async () => {
      await render(HostComponent, { providers: providers() });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-d11-teams-page')).toBeInTheDocument();
      });
    });

    it('gets all seasons', () => {
      expect(seasonApi.getAll).toHaveBeenCalled();
    });

    it('renders season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[1].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders d11-team-squad-card for each stat', async () => {
      await waitFor(() => {
        expect(document.querySelectorAll('app-d11-team-squad-card').length).toBe(
          d11TeamSeasonStats.length,
        );
      });
    });

    it('renders d11-team-squad-cards sorted by d11 team name', async () => {
      await waitFor(() => {
        const cards = document.querySelectorAll('app-d11-team-squad-card');
        expect(cards.length).toBe(2);
        expect(cards[0].textContent).toContain('D11Team1');
        expect(cards[1].textContent).toContain('D11Team2');
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [prevButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(routerService.navigateToD11Teams).toHaveBeenCalledExactlyOnceWith(seasons[2].id);
    });

    it('navigates to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [, nextButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(routerService.navigateToD11Teams).toHaveBeenCalledExactlyOnceWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(async () => {
      await render(NoIdHostComponent, { providers: providers() });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-d11-teams-page')).toBeInTheDocument();
      });
    });

    it('renders most recent season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[0].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [prevButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(routerService.navigateToD11Teams).toHaveBeenCalledExactlyOnceWith(seasons[1].id);
    });
  });

  describe('at last season', () => {
    beforeEach(async () => {
      await render(`<app-d11-teams-page [seasonId]="seasonId" />`, {
        imports: [D11TeamsPageComponent],
        componentProperties: { seasonId: seasons[0].id },
        providers: providers(),
      });
    });

    it('does not navigate to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [, nextButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(routerService.navigateToD11Teams).not.toHaveBeenCalled();
    });
  });
});
