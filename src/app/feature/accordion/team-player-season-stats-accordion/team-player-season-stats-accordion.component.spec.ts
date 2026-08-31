import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSeasonStat } from '@app/test';
import { TeamPlayerSeasonStatsAccordionComponent } from './team-player-season-stats-accordion.component';

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

const mockTeamApiService = { getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: TeamApiService, useValue: mockTeamApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('TeamPlayerSeasonStatsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([]));
  });

  describe('column headers', () => {
    it('renders column headers', async () => {
      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Pos')).toBeInTheDocument();
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getAllByText('Rtg').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Pts').length).toBeGreaterThan(0);
    });
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(NEVER);

      const { container } = await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders player names', async () => {
      const stat1 = stat();
      const stat2 = stat();
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(
        of([stat1, stat2]),
      );

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText(stat1.player.name)).toBeInTheDocument();
      expect(screen.getByText(stat2.player.name)).toBeInTheDocument();
    });

    it('renders position code', async () => {
      const stat1 = stat({ position: { ...fakePlayerSeasonStat().position, code: 'MID' } });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('MID')).toBeInTheDocument();
    });

    it('renders ranking with # prefix', async () => {
      const stat1 = stat({ ranking: 7 });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('#7')).toBeInTheDocument();
    });

    it('renders rating when greater than zero', async () => {
      const stat1 = stat({ rating: 750 });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getAllByText('7.50').length).toBeGreaterThan(0);
    });

    it('does not render rating when zero', async () => {
      const stat1 = stat({ rating: 0 });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('0.00')).not.toBeInTheDocument();
    });

    it('renders d11 team name in detail line when not dummy', async () => {
      const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: false, name: 'D11Team1' };
      const stat1 = stat({ d11Team });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getAllByText('D11Team1').length).toBeGreaterThan(0);
    });

    it('does not render d11 team name in detail line when dummy', async () => {
      const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: true, name: 'D11Team1' };
      const stat1 = stat({ d11Team });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryAllByText('D11Team1').length).toBe(0);
    });

    it('renders points', async () => {
      const stat1 = stat({ points: 42 });
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getAllByText('42').length).toBeGreaterThan(0);
    });

    it('renders separators between players', async () => {
      const stats = [1, 2, 3].map((id) => ({ ...stat(), player: { ...stat().player, id } }));
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of(stats));

      const { container } = await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('navigates to player on profile button click', async () => {
      const stat1 = stat();
      mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([stat1]));

      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      await userEvent.click(screen.getByText('Player profile'));

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(
        stat1.player.id,
        stat1.season.id,
      );
    });
  });

  describe('API', () => {
    it('passes teamId and seasonId to the API', async () => {
      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 7, seasonId: 42 },
        providers,
      });
      TestBed.tick();

      expect(mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId).toHaveBeenCalledWith(
        7,
        42,
      );
    });

    it('does not call API when seasonId is undefined', async () => {
      await render(TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { teamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId).not.toHaveBeenCalled();
    });
  });
});
