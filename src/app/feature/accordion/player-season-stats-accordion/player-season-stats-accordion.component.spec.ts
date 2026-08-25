import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { PlayerSeasonStatSort, POSITION_IDS } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { PlayerSeasonStatPage } from '@app/core/api';
import { PlayerSeasonStatsSearchParams } from '@app/shared/model';
import { fakePlayerSeasonStat } from '@app/test/faker-util';
import { PlayerSeasonStatsAccordionComponent } from './player-season-stats-accordion.component';

const stat = (overrides = {}) => ({
  ...fakePlayerSeasonStat(),
  goals: 0,
  goalAssists: 0,
  ownGoals: 0,
  cleanSheets: 0,
  yellowCards: 0,
  redCards: 0,
  gamesSubstitute: 0,
  gamesDidNotParticipate: 0,
  manOfTheMatch: 0,
  sharedManOfTheMatch: 0,
  rating: 0,
  d11Team: { ...fakePlayerSeasonStat().d11Team, dummy: true },
  team: { ...fakePlayerSeasonStat().team, dummy: true },
  ...overrides,
});

const fakePage = (stats = [stat()]): PlayerSeasonStatPage => ({
  elements: stats,
  totalElements: stats.length,
  totalPages: 1,
  page: 0,
});

const mockApiService = { getPlayerSeasonStatsBySeasonId: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: PlayerSeasonStatApiService, useValue: mockApiService },
  { provide: RouterService, useValue: mockRouterService },
];

const defaultSearchParams: PlayerSeasonStatsSearchParams = {
  seasonId: 1,
  dummy: undefined,
  positionIds: [],
  sort: PlayerSeasonStatSort.RANKING,
};

const defaultInputs = { page: 0, searchParams: defaultSearchParams };

describe('PlayerSeasonStatsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage()));
  });

  describe('column headers', () => {
    it('renders column headers while loading', async () => {
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(NEVER);

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getAllByText('Pts').length).toBeGreaterThan(0);
    });
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(NEVER);

      const { container } = await render(PlayerSeasonStatsAccordionComponent, {
        inputs: defaultInputs,
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders player names', async () => {
      const stat1 = stat();
      const stat2 = stat();
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1, stat2])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText(stat1.player.name)).toBeInTheDocument();
      expect(screen.getByText(stat2.player.name)).toBeInTheDocument();
    });

    it('renders separators between players', async () => {
      const stats = [1, 2, 3].map((id) => ({ ...stat(), player: { ...stat().player, id } }));
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage(stats)));

      const { container } = await render(PlayerSeasonStatsAccordionComponent, {
        inputs: defaultInputs,
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('renders points', async () => {
      const stat1 = { ...stat(), points: 42 };
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getAllByText('42').length).toBeGreaterThan(0);
    });

    it('renders formatted rating when rating is positive', async () => {
      const stat1 = { ...stat(), rating: 650 };
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getAllByText('6.50').length).toBeGreaterThan(0);
    });

    it('emits totalElementsCount when data loads', async () => {
      const stats = [stat(), stat(), stat()];
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage(stats)));

      const { fixture } = await render(PlayerSeasonStatsAccordionComponent, {
        inputs: defaultInputs,
        providers,
      });
      let emitted: number | undefined;
      fixture.componentInstance.totalElementsCount.subscribe((value) => (emitted = value));
      TestBed.tick();

      expect(emitted).toBe(3);
    });
  });

  describe('API params', () => {
    it('passes searchParams fields to the API', async () => {
      const searchParams: PlayerSeasonStatsSearchParams = {
        seasonId: 7,
        dummy: true,
        positionIds: [POSITION_IDS.MIDFIELDER],
        sort: PlayerSeasonStatSort.GOALS,
      };

      await render(PlayerSeasonStatsAccordionComponent, {
        inputs: { page: 2, searchParams },
        providers,
      });
      TestBed.tick();

      expect(mockApiService.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        7,
        2,
        [POSITION_IDS.MIDFIELDER],
        true,
        PlayerSeasonStatSort.GOALS,
      );
    });

    it('expands defender positionId to include full back', async () => {
      const searchParams: PlayerSeasonStatsSearchParams = {
        ...defaultSearchParams,
        positionIds: [POSITION_IDS.DEFENDER],
      };

      await render(PlayerSeasonStatsAccordionComponent, {
        inputs: { page: 0, searchParams },
        providers,
      });
      TestBed.tick();

      expect(mockApiService.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        defaultSearchParams.seasonId,
        0,
        expect.arrayContaining([POSITION_IDS.DEFENDER, POSITION_IDS.FULL_BACK]),
        defaultSearchParams.dummy,
        PlayerSeasonStatSort.RANKING,
      );
    });

    it('does not add full back when defender is not selected', async () => {
      const searchParams: PlayerSeasonStatsSearchParams = {
        ...defaultSearchParams,
        positionIds: [POSITION_IDS.FORWARD],
      };

      await render(PlayerSeasonStatsAccordionComponent, {
        inputs: { page: 0, searchParams },
        providers,
      });
      TestBed.tick();

      const positionIds = mockApiService.getPlayerSeasonStatsBySeasonId.mock
        .calls[0][2] as number[];
      expect(positionIds).not.toContain(POSITION_IDS.FULL_BACK);
    });

    it('falls back to RANKING when sort is null', async () => {
      const searchParams: PlayerSeasonStatsSearchParams = {
        ...defaultSearchParams,
        sort: null,
      };

      await render(PlayerSeasonStatsAccordionComponent, {
        inputs: { page: 0, searchParams },
        providers,
      });
      TestBed.tick();

      expect(mockApiService.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        defaultSearchParams.seasonId,
        0,
        defaultSearchParams.positionIds,
        defaultSearchParams.dummy,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  describe('accordion content', () => {
    it('renders team label for non-dummy team', async () => {
      const stat1 = {
        ...stat(),
        team: { ...fakePlayerSeasonStat().team, dummy: false },
      };
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Team')).toBeInTheDocument();
    });

    it('renders D11 team and fee for non-dummy d11Team', async () => {
      const stat1 = {
        ...stat(),
        d11Team: { ...fakePlayerSeasonStat().d11Team, dummy: false },
        fee: 55,
      };
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('D11 team')).toBeInTheDocument();
      expect(screen.getByText('Fee')).toBeInTheDocument();
      expect(screen.getByText('£5.5m')).toBeInTheDocument();
    });

    it('renders goals label when goals > 0', async () => {
      const stat1 = { ...stat(), goals: 3 };
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      // column header always present; content label adds a second occurrence
      expect(screen.getAllByText('Goals').length).toBeGreaterThan(1);
    });

    it('omits goals label when goals is 0', async () => {
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat()])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getAllByText('Goals').length).toBe(1);
    });

    it('renders assists when goalAssists > 0', async () => {
      const stat1 = { ...stat(), goalAssists: 2 };
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Assists')).toBeInTheDocument();
    });

    it('omits rating label when rating is 0', async () => {
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat()])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.queryByText('Rating')).not.toBeInTheDocument();
    });

    it('navigates to player on profile button click', async () => {
      const stat1 = stat();
      mockApiService.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(fakePage([stat1])));

      await render(PlayerSeasonStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      await userEvent.click(screen.getByText('Player profile'));

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(
        stat1.player.id,
        stat1.season.id,
      );
    });
  });
});
