import { ComponentFixture } from '@angular/core/testing';
import { SeasonApiService, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeasonWinners } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { HistoryPageComponent } from './history-page.component';

const seasonWinner1 = {
  ...fakeSeasonWinners(),
  season: { ...fakeSeasonWinners().season, name: '2023-2024', status: Status.FINISHED },
};
const seasonWinner2 = {
  ...fakeSeasonWinners(),
  season: { ...fakeSeasonWinners().season, name: '2024-2025', status: Status.ACTIVE },
};
const pendingSeasonWinner = {
  ...fakeSeasonWinners(),
  season: { ...fakeSeasonWinners().season, name: '2022-2023', status: Status.PENDING },
};

const mockSeasonApiService = {
  getSeasonWinners: vi.fn(),
};

const mockRouterService = {
  navigateToD11Team: vi.fn(),
  navigateToPlayer: vi.fn(),
  navigateToTeam: vi.fn(),
};

const providers = [
  { provide: SeasonApiService, useValue: mockSeasonApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('HistoryPageComponent', () => {
  let fixture: ComponentFixture<HistoryPageComponent>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with seasons', () => {
    beforeEach(async () => {
      mockSeasonApiService.getSeasonWinners.mockReturnValue(of([seasonWinner1, seasonWinner2]));
      const result = await render(HistoryPageComponent, { providers });
      fixture = result.fixture;
    });

    it('renders', () => {
      expect(fixture.nativeElement).toBeInTheDocument();
    });

    it('renders a component for each season', async () => {
      await screen.findByText(seasonWinner1.season.name);

      expect(document.querySelectorAll('app-season-history')).toHaveLength(2);
    });

    it('renders season names', async () => {
      expect(await screen.findByText(seasonWinner1.season.name)).toBeInTheDocument();
      expect(await screen.findByText(seasonWinner2.season.name)).toBeInTheDocument();
    });
  });

  describe('with pending seasons', () => {
    beforeEach(async () => {
      mockSeasonApiService.getSeasonWinners.mockReturnValue(
        of([seasonWinner1, pendingSeasonWinner]),
      );
      const result = await render(HistoryPageComponent, { providers });
      fixture = result.fixture;
    });

    it('filters out pending season components', async () => {
      await screen.findByText(seasonWinner1.season.name);

      expect(document.querySelectorAll('app-season-history')).toHaveLength(1);
      expect(screen.queryByText(pendingSeasonWinner.season.name)).not.toBeInTheDocument();
    });
  });

  describe('with no seasons', () => {
    beforeEach(async () => {
      mockSeasonApiService.getSeasonWinners.mockReturnValue(of([]));
      const result = await render(HistoryPageComponent, { providers });
      fixture = result.fixture;
    });

    it('shows no history found', async () => {
      expect(await screen.findByText('No season history found')).toBeInTheDocument();
    });
  });
});
