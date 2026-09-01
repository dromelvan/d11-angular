import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { D11TeamApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSeasonStat } from '@app/test';
import { D11TeamPlayerSeasonStatsAccordionComponent } from './d11-team-player-season-stats-accordion.component';

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

const mockD11TeamApiService = { getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: D11TeamApiService, useValue: mockD11TeamApiService },
  { provide: RouterService, useValue: mockRouterService },
];

async function setup(stats = [stat()]) {
  mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of(stats));
  const { container } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
    inputs: { d11TeamId: 1, seasonId: 10 },
    providers,
  });
  TestBed.tick();
  return { container };
}

describe('D11TeamPlayerSeasonStatsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of([]));
  });

  describe('column headers', () => {
    it('renders Rtg column header when context is d11-team', async () => {
      await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Pos')).toBeInTheDocument();
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getAllByText('Rtg').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Pts').length).toBeGreaterThan(0);
    });

    it('renders Fee column header when context is d11-teams', async () => {
      await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams' },
        providers,
      });
      TestBed.tick();

      expect(screen.getAllByText('Fee').length).toBeGreaterThan(0);
      expect(screen.queryByText('Rtg')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(NEVER);

      const { container } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
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

      it('renders fee in row when context is d11-teams', async () => {
        mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(
          of([stat({ fee: 105 })]),
        );
        await render(D11TeamPlayerSeasonStatsAccordionComponent, {
          inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams' },
          providers,
        });
        TestBed.tick();

        expect(screen.getAllByText('10.5m').length).toBeGreaterThan(0);
      });

      it('renders points', async () => {
        await setup([stat({ points: 42 })]);

        expect(screen.getAllByText('42').length).toBeGreaterThan(0);
      });

      it('renders team name in detail line when not dummy', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: false, name: 'Team1' };
        await setup([stat({ team })]);

        expect(screen.getAllByText('Team1').length).toBeGreaterThan(0);
      });

      it('does not render team name in detail line when context is d11-teams', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: false, name: 'Team1' };
        mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(
          of([stat({ team })]),
        );
        const { container } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
          inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams' },
          providers,
        });
        TestBed.tick();

        const headerText = container.querySelector('p-accordion-header')?.textContent ?? '';
        expect(headerText).not.toContain('Team1');
      });

      it('does not render team name in detail line when dummy', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: true, name: 'Team1' };
        await setup([stat({ team })]);

        expect(screen.queryAllByText('Team1').length).toBe(0);
      });
    });

    describe('content panel', () => {
      it('renders team name when not dummy', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: false, name: 'Team1' };
        await setup([stat({ team })]);

        expect(screen.getAllByText('Team1').length).toBeGreaterThan(0);
      });

      it('does not render team name when dummy', async () => {
        const team = { ...fakePlayerSeasonStat().team, dummy: true, name: 'Team1' };
        await setup([stat({ team })]);

        expect(screen.queryByText('Team1')).not.toBeInTheDocument();
      });

      it('renders d11 team name when not dummy', async () => {
        const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: false, name: 'D11Team1' };
        await setup([stat({ d11Team })]);

        expect(screen.getByText('D11Team1')).toBeInTheDocument();
      });

      it('does not render d11 team name when dummy', async () => {
        const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: true, name: 'D11Team1' };
        await setup([stat({ d11Team })]);

        expect(screen.queryByText('D11Team1')).not.toBeInTheDocument();
      });

      it('renders fee when d11 team not dummy', async () => {
        const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: false };
        await setup([stat({ d11Team })]);

        expect(screen.getByText('Fee')).toBeInTheDocument();
      });

      it('does not render fee when d11 team is dummy', async () => {
        const d11Team = { ...fakePlayerSeasonStat().d11Team, dummy: true };
        await setup([stat({ d11Team })]);

        expect(screen.queryByText('Fee')).not.toBeInTheDocument();
      });

      it('renders rating when greater than zero', async () => {
        await setup([stat({ rating: 750 })]);

        expect(screen.getByText('Rating')).toBeInTheDocument();
      });

      it('does not render rating when zero', async () => {
        await setup([stat({ rating: 0 })]);

        expect(screen.queryByText('Rating')).not.toBeInTheDocument();
      });

      it('always renders games started', async () => {
        await setup([stat()]);

        expect(screen.getByText('Games started')).toBeInTheDocument();
      });

      it('always renders minutes played', async () => {
        await setup([stat()]);

        expect(screen.getByText('Minutes played')).toBeInTheDocument();
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

      it('does not render clean sheets when zero', async () => {
        const position = { ...fakePlayerSeasonStat().position, id: 4 };
        await setup([stat({ cleanSheets: 0, position })]);

        expect(screen.queryByText('Clean sheets')).not.toBeInTheDocument();
      });

      it('does not render clean sheets when position id is 5 or above', async () => {
        const position = { ...fakePlayerSeasonStat().position, id: 5 };
        await setup([stat({ cleanSheets: 3, position })]);

        expect(screen.queryByText('Clean sheets')).not.toBeInTheDocument();
      });

      it('renders own goals when greater than zero', async () => {
        await setup([stat({ ownGoals: 1 })]);

        expect(screen.getByText('Own goals')).toBeInTheDocument();
      });

      it('does not render own goals when zero', async () => {
        await setup([stat({ ownGoals: 0 })]);

        expect(screen.queryByText('Own goals')).not.toBeInTheDocument();
      });

      it('renders goals conceded when greater than zero and position is defender', async () => {
        const position = { ...fakePlayerSeasonStat().position, defender: true };
        await setup([stat({ goalsConceded: 5, position })]);

        expect(screen.getByText('Goals conceded')).toBeInTheDocument();
      });

      it('does not render goals conceded when zero', async () => {
        const position = { ...fakePlayerSeasonStat().position, defender: true };
        await setup([stat({ goalsConceded: 0, position })]);

        expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
      });

      it('does not render goals conceded when position is not defender', async () => {
        const position = { ...fakePlayerSeasonStat().position, defender: false };
        await setup([stat({ goalsConceded: 5, position })]);

        expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
      });

      it('renders man of the match when greater than zero', async () => {
        await setup([stat({ manOfTheMatch: 2 })]);

        expect(screen.getByText('Man of the match')).toBeInTheDocument();
      });

      it('does not render man of the match when zero', async () => {
        await setup([stat({ manOfTheMatch: 0 })]);

        expect(screen.queryByText('Man of the match')).not.toBeInTheDocument();
      });

      it('renders shared man of the match when greater than zero', async () => {
        await setup([stat({ sharedManOfTheMatch: 1 })]);

        expect(screen.getByText('Shared man of the match')).toBeInTheDocument();
      });

      it('does not render shared man of the match when zero', async () => {
        await setup([stat({ sharedManOfTheMatch: 0 })]);

        expect(screen.queryByText('Shared man of the match')).not.toBeInTheDocument();
      });

      it('renders games substitute when greater than zero', async () => {
        await setup([stat({ gamesSubstitute: 4 })]);

        expect(screen.getByText('Games substitute')).toBeInTheDocument();
      });

      it('does not render games substitute when zero', async () => {
        await setup([stat({ gamesSubstitute: 0 })]);

        expect(screen.queryByText('Games substitute')).not.toBeInTheDocument();
      });

      it('renders games did not participate when greater than zero', async () => {
        await setup([stat({ gamesDidNotParticipate: 3 })]);

        expect(screen.getByText('Games DNP')).toBeInTheDocument();
      });

      it('does not render games did not participate when zero', async () => {
        await setup([stat({ gamesDidNotParticipate: 0 })]);

        expect(screen.queryByText('Games DNP')).not.toBeInTheDocument();
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

  describe('context input', () => {
    it('defaults to d11-team', async () => {
      const { fixture } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });

      expect(fixture.componentInstance.context()).toBe('d11-team');
    });

    it('shows player image when context is d11-team', async () => {
      const { container } = await setup([stat()]);

      expect(container.querySelector('app-player-img')).toBeInTheDocument();
      expect(container.querySelectorAll('app-team-img').length).toBe(0);
    });

    it('shows team image when context is d11-teams', async () => {
      mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(
        of([stat()]),
      );
      const { container } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams' },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('app-team-img')).toBeInTheDocument();
      expect(container.querySelector('app-player-img')).not.toBeInTheDocument();
    });
  });

  describe('playerSeasonStats', () => {
    it('exposes loaded stats', async () => {
      const stat1 = stat();
      mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of([stat1]));
      const { fixture } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(fixture.componentInstance.playerSeasonStats()).toEqual([stat1]);
    });

    it('returns empty array when not loaded', async () => {
      const { fixture } = await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(fixture.componentInstance.playerSeasonStats()).toEqual([]);
    });
  });

  describe('API', () => {
    it('passes d11TeamId and seasonId to the API', async () => {
      await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 7, seasonId: 42 },
        providers,
      });
      TestBed.tick();

      expect(mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId).toHaveBeenCalledWith(
        7,
        42,
      );
    });

    it('does not call API when seasonId is undefined', async () => {
      await render(D11TeamPlayerSeasonStatsAccordionComponent, {
        inputs: { d11TeamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(
        mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId,
      ).not.toHaveBeenCalled();
    });
  });
});
