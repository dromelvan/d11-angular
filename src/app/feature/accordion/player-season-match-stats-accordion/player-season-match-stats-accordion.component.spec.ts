import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { Lineup, PlayerApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase, fakePlayerMatchStat } from '@app/test/faker-util';
import { PlayerSeasonMatchStatsAccordionComponent } from './player-season-match-stats-accordion.component';

const startingPlayer = () => ({
  ...fakePlayerMatchStat(),
  lineup: Lineup.STARTING_LINEUP,
  substitutionOnTime: 0,
  substitutionOffTime: 0,
  yellowCardTime: 0,
  redCardTime: 0,
  goals: 0,
  goalAssists: 0,
  ownGoals: 0,
  manOfTheMatch: false,
  sharedManOfTheMatch: false,
});

const unusedSub = () => ({
  ...fakePlayerMatchStat(),
  lineup: Lineup.SUBSTITUTE,
  substitutionOnTime: 0,
  manOfTheMatch: false,
  sharedManOfTheMatch: false,
});

const didNotParticipate = () => ({
  ...fakePlayerMatchStat(),
  lineup: Lineup.DID_NOT_PARTICIPATE,
  manOfTheMatch: false,
  sharedManOfTheMatch: false,
});

const mockApiService = { getPlayerMatchStatsByPlayerIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToMatch: vi.fn() };

const providers = [
  { provide: PlayerApiService, useValue: mockApiService },
  { provide: RouterService, useValue: mockRouterService },
];

const defaultInputs = { playerId: 1, seasonId: 2 };

describe('PlayerSeasonMatchStatsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([]));
    mockRouterService.navigateToMatch.mockResolvedValue(true);
  });

  describe('column headers', () => {
    it('renders column headers while loading', async () => {
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(NEVER);

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Match')).toBeInTheDocument();
      expect(screen.getByText('Rtg')).toBeInTheDocument();
      expect(screen.getByText('Pts')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(NEVER);

      const { container } = await render(PlayerSeasonMatchStatsAccordionComponent, {
        inputs: defaultInputs,
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(PlayerSeasonMatchStatsAccordionComponent, {
        inputs: defaultInputs,
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('accordion header', () => {
    it('renders formatted date', async () => {
      const stat = {
        ...startingPlayer(),
        match: { ...fakeMatchBase(), datetime: '2025-03-15T15:00:00.000Z' },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('15.3')).toBeInTheDocument();
    });

    it('renders formatted rating for active player', async () => {
      const stat = { ...startingPlayer(), rating: 725 };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('7.25')).toBeInTheDocument();
    });

    it('renders SUB label for unused substitute', async () => {
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([unusedSub()]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('SUB')).toBeInTheDocument();
    });

    it('renders DNP label for player who did not participate', async () => {
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(
        of([didNotParticipate()]),
      );

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('DNP')).toBeInTheDocument();
    });

    it('renders points', async () => {
      const stat = { ...startingPlayer(), points: 13 };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('13')).toBeInTheDocument();
    });

    it('renders separators between rows', async () => {
      const stats = [1, 2, 3].map((id) => ({
        ...startingPlayer(),
        match: { ...fakeMatchBase(), id },
      }));
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of(stats));

      const { container } = await render(PlayerSeasonMatchStatsAccordionComponent, {
        inputs: defaultInputs,
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });
  });

  describe('accordion content', () => {
    it('renders Team label for non-dummy team', async () => {
      const stat = {
        ...startingPlayer(),
        team: { ...fakePlayerMatchStat().team, dummy: false },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Team')).toBeInTheDocument();
    });

    it('omits Team label for dummy team', async () => {
      const stat = {
        ...startingPlayer(),
        team: { ...fakePlayerMatchStat().team, dummy: true },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.queryByText('Team')).not.toBeInTheDocument();
    });

    it('renders D11 team label for non-dummy d11Team', async () => {
      const stat = {
        ...startingPlayer(),
        d11Team: { ...fakePlayerMatchStat().d11Team, dummy: false },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('D11 team')).toBeInTheDocument();
    });

    it('omits D11 team label for dummy d11Team', async () => {
      const stat = {
        ...startingPlayer(),
        d11Team: { ...fakePlayerMatchStat().d11Team, dummy: true },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.queryByText('D11 team')).not.toBeInTheDocument();
    });

    it('shows "Did not participate" for DNP player', async () => {
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(
        of([didNotParticipate()]),
      );

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Did not participate')).toBeInTheDocument();
    });

    it('shows "Unused substitute" for unused sub', async () => {
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([unusedSub()]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Unused substitute')).toBeInTheDocument();
    });

    it('shows goals when goals > 0', async () => {
      const stat = { ...startingPlayer(), goals: 2 };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Goals')).toBeInTheDocument();
    });

    it('shows assists when goalAssists > 0', async () => {
      const stat = { ...startingPlayer(), goalAssists: 1 };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Assists')).toBeInTheDocument();
    });

    it('shows own goals when ownGoals > 0', async () => {
      const stat = { ...startingPlayer(), ownGoals: 1 };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Own goals')).toBeInTheDocument();
    });

    it('shows clean sheet for qualifying player with no goals conceded', async () => {
      const stat = {
        ...startingPlayer(),
        goalsConceded: 0,
        position: { ...fakePlayerMatchStat().position, id: 2 },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Clean sheet')).toBeInTheDocument();
    });

    it('shows goals conceded for defender', async () => {
      const stat = {
        ...startingPlayer(),
        goalsConceded: 3,
        position: { ...fakePlayerMatchStat().position, defender: true },
      };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Goals conceded')).toBeInTheDocument();
    });

    it('shows minutes played for starting player', async () => {
      const stat = { ...startingPlayer(), goalsConceded: 1 };
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      expect(screen.getByText('Minutes played')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  describe('match details link', () => {
    it('navigates to match when Match details is clicked', async () => {
      const stat = startingPlayer();
      mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([stat]));

      await render(PlayerSeasonMatchStatsAccordionComponent, { inputs: defaultInputs, providers });
      TestBed.tick();

      await userEvent.click(screen.getByText('Match details'));

      expect(mockRouterService.navigateToMatch).toHaveBeenCalledWith(stat.match.id);
    });
  });

  describe('API params', () => {
    it('passes playerId and seasonId to the API', async () => {
      await render(PlayerSeasonMatchStatsAccordionComponent, {
        inputs: { playerId: 7, seasonId: 3 },
        providers,
      });
      TestBed.tick();

      expect(mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId).toHaveBeenCalledWith(7, 3);
    });
  });
});
