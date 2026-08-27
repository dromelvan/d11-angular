import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { PlayerApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSeasonStat } from '@app/test/faker-util';
import { PlayerCareerStatsSectionComponent } from './player-career-stats-section.component';

const stat = (overrides = {}) => ({ ...fakePlayerSeasonStat(), ...overrides });

const mockApiService = { getPlayerSeasonStatsByPlayerId: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: PlayerApiService, useValue: mockApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('PlayerCareerStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of([]));
  });

  describe('header', () => {
    it('renders Career header', async () => {
      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('section-header')).toHaveTextContent('Career');
    });

    it('renders column headers', async () => {
      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Season')).toBeInTheDocument();
      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(screen.getByText('Rank')).toBeInTheDocument();
      expect(screen.getByText('Pts')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(NEVER);

      const { container } = await render(PlayerCareerStatsSectionComponent, {
        inputs: { playerId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(PlayerCareerStatsSectionComponent, {
        inputs: { playerId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders season short name', async () => {
      const stat1 = stat();
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of([stat1]));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText(stat1.season.shortName)).toBeInTheDocument();
    });

    it('renders team name', async () => {
      const stat1 = stat();
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of([stat1]));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText(stat1.team.name)).toBeInTheDocument();
    });

    it('renders ranking with # prefix', async () => {
      const stat1 = stat({ ranking: 5 });
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of([stat1]));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('#5')).toBeInTheDocument();
    });

    it('renders points', async () => {
      const stat1 = stat({ points: 77 });
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of([stat1]));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getAllByText('77').length).toBeGreaterThan(0);
    });

    it('renders separators between rows', async () => {
      const stats = [1, 2, 3].map((id) => stat({ id }));
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of(stats));

      const { container } = await render(PlayerCareerStatsSectionComponent, {
        inputs: { playerId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('navigates to player page when row is clicked', async () => {
      const stat1 = stat();
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of([stat1]));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      await userEvent.click(screen.getByText(stat1.season.shortName));

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(
        stat1.player.id,
        stat1.season.id,
      );
    });
  });

  describe('summary', () => {
    it('renders seasons count', async () => {
      const stats = [stat(), stat(), stat()];
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of(stats));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('3 seasons')).toBeInTheDocument();
    });

    it('renders total points', async () => {
      const stats = [stat({ points: 30 }), stat({ points: 20 })];
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of(stats));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('renders avg ranking for rated stats', async () => {
      const stats = [stat({ rating: 1, ranking: 2 }), stat({ rating: 1, ranking: 4 })];
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of(stats));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Avg 3')).toBeInTheDocument();
    });

    it('does not render avg ranking when no stats have rating > 0', async () => {
      const stats = [stat({ rating: 0 }), stat({ rating: 0 })];
      mockApiService.getPlayerSeasonStatsByPlayerId.mockReturnValue(of(stats));

      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 1 }, providers });
      TestBed.tick();

      expect(screen.queryByText(/Avg/)).not.toBeInTheDocument();
    });
  });

  describe('API', () => {
    it('passes playerId to the API', async () => {
      await render(PlayerCareerStatsSectionComponent, { inputs: { playerId: 42 }, providers });
      TestBed.tick();

      expect(mockApiService.getPlayerSeasonStatsByPlayerId).toHaveBeenCalledWith(42);
    });
  });
});
