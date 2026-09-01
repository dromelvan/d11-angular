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

async function setup(stats = [stat()]) {
  mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of(stats));
  const { container } = await render(TeamPlayerSeasonStatsAccordionComponent, {
    inputs: { teamId: 1, seasonId: 10 },
    providers,
  });
  TestBed.tick();
  return { container };
}

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
    describe('header row', () => {
      it('renders player names', async () => {
        const stat1 = stat();
        const stat2 = stat();
        await setup([stat1, stat2]);

        expect(screen.getByText(stat1.player.name)).toBeInTheDocument();
        expect(screen.getByText(stat2.player.name)).toBeInTheDocument();
      });

      it('renders position code', async () => {
        await setup([stat({ position: { ...fakePlayerSeasonStat().position, code: 'MID' } })]);

        expect(screen.getByText('MID')).toBeInTheDocument();
      });

      it('renders ranking with # prefix', async () => {
        await setup([stat({ ranking: 7 })]);

        expect(screen.getByText('#7')).toBeInTheDocument();
      });

      it('renders rating when greater than zero', async () => {
        await setup([stat({ rating: 750 })]);

        expect(screen.getAllByText('7.50').length).toBeGreaterThan(0);
      });

      it('does not render rating when zero', async () => {
        await setup([stat({ rating: 0 })]);

        expect(screen.queryByText('0.00')).not.toBeInTheDocument();
      });

      it('renders points', async () => {
        await setup([stat({ points: 42 })]);

        expect(screen.getAllByText('42').length).toBeGreaterThan(0);
      });

      it('renders d11 team name in detail line when not dummy', async () => {
        const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: false, name: 'D11Team1' };
        await setup([stat({ d11Team })]);

        expect(screen.getAllByText('D11Team1').length).toBeGreaterThan(0);
      });

      it('does not render d11 team name in detail line when dummy', async () => {
        const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: true, name: 'D11Team1' };
        await setup([stat({ d11Team })]);

        expect(screen.queryAllByText('D11Team1').length).toBe(0);
      });
    });

    describe('content panel', () => {
      it('renders team name when not dummy', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: false, name: 'Team1' };
        await setup([stat({ team })]);

        expect(screen.getByText('Team1')).toBeInTheDocument();
      });

      it('does not render team name when dummy', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: true, name: 'Team1' };
        await setup([stat({ team })]);

        expect(screen.queryByText('Team1')).not.toBeInTheDocument();
      });

      it('always renders games started', async () => {
        await setup([stat({ gamesStarted: 12 })]);

        expect(screen.getByText('Games started')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
      });

      it('always renders minutes played', async () => {
        await setup([stat({ minutesPlayed: 900 })]);

        expect(screen.getByText('Minutes played')).toBeInTheDocument();
        expect(screen.getByText('900')).toBeInTheDocument();
      });

      it('renders goals when greater than zero', async () => {
        await setup([stat({ goals: 3 })]);

        expect(screen.getAllByText('Goals').length).toBeGreaterThan(1);
      });

      it('does not render goals label in content when zero', async () => {
        await setup([stat({ goals: 0 })]);

        expect(screen.getAllByText('Goals').length).toBe(1);
      });

      it('renders goal assists when greater than zero', async () => {
        await setup([stat({ goalAssists: 2 })]);

        expect(screen.getByText('Assists')).toBeInTheDocument();
      });

      it('does not render goal assists when zero', async () => {
        await setup([stat({ goalAssists: 0 })]);

        expect(screen.queryByText('Assists')).not.toBeInTheDocument();
      });

      it('renders yellow cards when greater than zero', async () => {
        await setup([stat({ yellowCards: 1 })]);

        expect(screen.getByText('Yellow cards')).toBeInTheDocument();
      });

      it('does not render yellow cards when zero', async () => {
        await setup([stat({ yellowCards: 0 })]);

        expect(screen.queryByText('Yellow cards')).not.toBeInTheDocument();
      });

      it('renders red cards when greater than zero', async () => {
        await setup([stat({ redCards: 1 })]);

        expect(screen.getByText('Red cards')).toBeInTheDocument();
      });

      it('does not render red cards when zero', async () => {
        await setup([stat({ redCards: 0 })]);

        expect(screen.queryByText('Red cards')).not.toBeInTheDocument();
      });

      it('renders clean sheets when greater than zero and position id is below 5', async () => {
        const position = { ...fakePlayerSeasonStat().position, id: 4 };
        await setup([stat({ cleanSheets: 3, position })]);

        expect(screen.getByText('Clean sheets')).toBeInTheDocument();
      });

      it('does not render clean sheets when position id is 5 or above', async () => {
        const position = { ...fakePlayerSeasonStat().position, id: 5 };
        await setup([stat({ cleanSheets: 3, position })]);

        expect(screen.queryByText('Clean sheets')).not.toBeInTheDocument();
      });

      it('renders games substitute when greater than zero', async () => {
        await setup([stat({ gamesSubstitute: 4 })]);

        expect(screen.getByText('Games substitute')).toBeInTheDocument();
      });

      it('does not render games substitute when zero', async () => {
        await setup([stat({ gamesSubstitute: 0 })]);

        expect(screen.queryByText('Games substitute')).not.toBeInTheDocument();
      });
    });

    it('renders separators between players', async () => {
      const stats = [1, 2, 3].map((id) => ({ ...stat(), player: { ...stat().player, id } }));
      const { container } = await setup(stats);

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('navigates to player on profile button click', async () => {
      const stat1 = stat();
      await setup([stat1]);

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
