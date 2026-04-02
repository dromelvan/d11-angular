import { Component } from '@angular/core';
import { PlayerSeasonStatApiService, PlayerSeasonStatPage, Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSeasonStat, fakeSeason } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayersPageComponent } from './players-page.component';

let seasons: Season[];
let playerSeasonStatPage: PlayerSeasonStatPage;
let seasonApi: SeasonApiService;
let playerSeasonStatApi: PlayerSeasonStatApiService;
let loadingService: LoadingService;
let routerService: RouterService;

@Component({
  template: ` <app-players-page [seasonId]="seasonId" />`,
  standalone: true,
  imports: [PlayersPageComponent],
})
class HostComponent {
  seasonId: number | undefined = seasons[1].id;
}

@Component({
  template: ` <app-players-page />`,
  standalone: true,
  imports: [PlayersPageComponent],
})
class NoIdHostComponent {}

describe('PlayersPageComponent', () => {
  beforeEach(() => {
    seasons = [
      { ...fakeSeason(), date: '2023-08-01' },
      { ...fakeSeason(), date: '2022-08-01' },
      { ...fakeSeason(), date: '2021-08-01' },
    ];

    playerSeasonStatPage = {
      page: 0,
      totalPages: 1,
      totalElements: 2,
      elements: [fakePlayerSeasonStat(), fakePlayerSeasonStat()],
    };

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    playerSeasonStatApi = {
      getPlayerSeasonStatsBySeasonId: vi.fn().mockReturnValue(of(playerSeasonStatPage)),
    } as unknown as PlayerSeasonStatApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;
    routerService = { navigateToPlayers: vi.fn() } as unknown as RouterService;
  });

  const providers = () => [
    { provide: SeasonApiService, useValue: seasonApi },
    { provide: PlayerSeasonStatApiService, useValue: playerSeasonStatApi },
    { provide: LoadingService, useValue: loadingService },
    { provide: RouterService, useValue: routerService },
  ];

  describe('with seasonId', () => {
    beforeEach(async () => {
      await render(HostComponent, { providers: providers() });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-players-page')).toBeInTheDocument();
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

    it('renders player season stats card', async () => {
      await waitFor(() => {
        expect(document.querySelector('app-player-season-stats-card')).toBeInTheDocument();
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [prevButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(routerService.navigateToPlayers).toHaveBeenCalledExactlyOnceWith(seasons[2].id);
    });

    it('navigates to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [, nextButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(routerService.navigateToPlayers).toHaveBeenCalledExactlyOnceWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(async () => {
      await render(NoIdHostComponent, { providers: providers() });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-players-page')).toBeInTheDocument();
      });
    });

    it('gets all seasons', () => {
      expect(seasonApi.getAll).toHaveBeenCalled();
    });

    it('renders most recent season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[0].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders player season stats card', async () => {
      await waitFor(() => {
        expect(document.querySelector('app-player-season-stats-card')).toBeInTheDocument();
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [prevButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(routerService.navigateToPlayers).toHaveBeenCalledExactlyOnceWith(seasons[1].id);
    });
  });

  describe('at last season', () => {
    beforeEach(async () => {
      await render(`<app-players-page [seasonId]="seasonId" />`, {
        imports: [PlayersPageComponent],
        componentProperties: { seasonId: seasons[0].id },
        providers: providers(),
      });
    });

    it('does not navigate to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [, nextButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(routerService.navigateToPlayers).not.toHaveBeenCalled();
    });
  });

  describe('at first season', () => {
    beforeEach(async () => {
      await render(`<app-players-page [seasonId]="seasonId" />`, {
        imports: [PlayersPageComponent],
        componentProperties: { seasonId: seasons[2].id },
        providers: providers(),
      });
    });

    it('does not navigate to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[2].name, { exact: false }));
      const [prevButton] = document.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(routerService.navigateToPlayers).not.toHaveBeenCalled();
    });
  });
});
