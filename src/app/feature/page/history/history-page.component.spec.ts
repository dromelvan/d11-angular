import { ComponentFixture } from '@angular/core/testing';
import { SeasonApiService, Status } from '@app/core/api';
import { PageContextService } from '@app/core/page-context/page-context.service';
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

const mockPageContextService = { register: vi.fn() };

const providers = [
  { provide: SeasonApiService, useValue: mockSeasonApiService },
  { provide: RouterService, useValue: mockRouterService },
  { provide: PageContextService, useValue: mockPageContextService },
];

describe('HistoryPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with seasons', () => {
    let fixture: ComponentFixture<HistoryPageComponent>;

    beforeEach(async () => {
      mockSeasonApiService.getSeasonWinners.mockReturnValue(of([seasonWinner1, seasonWinner2]));
      const result = await render(HistoryPageComponent, { providers });
      fixture = result.fixture;
    });

    it('renders', () => {
      expect(fixture.nativeElement).toBeInTheDocument();
    });

    it('renders a season-winners-section component for each season', async () => {
      await screen.findAllByText(seasonWinner1.season.name);

      expect(document.querySelectorAll('app-season-winners-section')).toHaveLength(2);
    });

    it('renders season names', async () => {
      expect(await screen.findAllByText(seasonWinner1.season.name)).not.toHaveLength(0);
      expect(await screen.findAllByText(seasonWinner2.season.name)).not.toHaveLength(0);
    });

    it('registers page context with Season History title', () => {
      const [, context] = mockPageContextService.register.mock.calls[0];
      expect(context.title()).toBe('Season History');
    });

    it('registers page context subtitle as year range of seasons', async () => {
      await screen.findAllByText(seasonWinner1.season.name);
      const [, context] = mockPageContextService.register.mock.calls[0];
      expect(context.subtitle()).toBe('2023-2025');
    });
  });

  describe('with pending seasons', () => {
    beforeEach(async () => {
      mockSeasonApiService.getSeasonWinners.mockReturnValue(
        of([seasonWinner1, pendingSeasonWinner]),
      );
      await render(HistoryPageComponent, { providers });
    });

    it('filters out pending season components', async () => {
      await screen.findAllByText(seasonWinner1.season.name);

      expect(document.querySelectorAll('app-season-winners-section')).toHaveLength(1);
      expect(screen.queryByText(pendingSeasonWinner.season.name)).not.toBeInTheDocument();
    });

    it('excludes pending seasons from subtitle', async () => {
      await screen.findAllByText(seasonWinner1.season.name);
      const [, context] = mockPageContextService.register.mock.calls[0];
      expect(context.subtitle()).toBe('2023-2024');
    });
  });

  describe('with no seasons', () => {
    beforeEach(async () => {
      mockSeasonApiService.getSeasonWinners.mockReturnValue(of([]));
      await render(HistoryPageComponent, { providers });
    });

    it('shows no history found', async () => {
      expect(await screen.findByText('No season history found')).toBeInTheDocument();
    });

    it('registers page context subtitle as undefined', () => {
      const [, context] = mockPageContextService.register.mock.calls[0];
      expect(context.subtitle()).toBeUndefined();
    });
  });
});
