import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Lineup } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerMatchStat } from '@app/test/faker-util';
import { PlayerMatchStatsAccordionComponent } from './player-match-stats-accordion.component';

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

describe('PlayerMatchStatsAccordionComponent', () => {
  describe('column headers', () => {
    it('renders column headers', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [startingPlayer()] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Pos')).toBeInTheDocument();
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Rtg')).toBeInTheDocument();
      expect(screen.getByText('Pts')).toBeInTheDocument();
    });
  });

  describe('accordion header', () => {
    it('renders player names', async () => {
      const player1 = startingPlayer();
      const player2 = startingPlayer();

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [player1, player2] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText(player1.player.name)).toBeInTheDocument();
      expect(screen.getByText(player2.player.name)).toBeInTheDocument();
    });

    it('renders position code', async () => {
      const stat = startingPlayer();

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText(stat.position.code)).toBeInTheDocument();
    });

    it('renders formatted rating for active player', async () => {
      const stat = { ...startingPlayer(), rating: 650 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('6.50')).toBeInTheDocument();
    });

    it('renders SUB label for unused substitute', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [unusedSub()] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('SUB')).toBeInTheDocument();
    });

    it('renders DNP label for player who did not participate', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [didNotParticipate()] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('DNP')).toBeInTheDocument();
    });

    it('renders man of the match icon', async () => {
      const stat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        manOfTheMatch: true,
        sharedManOfTheMatch: false,
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('star')).toBeInTheDocument();
    });

    it('renders shared man of the match icon', async () => {
      const stat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        manOfTheMatch: false,
        sharedManOfTheMatch: true,
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('star_half')).toBeInTheDocument();
    });

    it('renders points', async () => {
      const stat = { ...startingPlayer(), points: 13 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('13')).toBeInTheDocument();
    });

    it('renders substitution on time for active substitute', async () => {
      const stat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.SUBSTITUTE,
        substitutionOnTime: 62,
        manOfTheMatch: false,
        sharedManOfTheMatch: false,
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText("62'")).toBeInTheDocument();
    });

    it('renders yellow card time', async () => {
      const stat = { ...startingPlayer(), yellowCardTime: 34 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText("34'")).toBeInTheDocument();
    });

    it('renders red card time', async () => {
      const stat = { ...startingPlayer(), redCardTime: 78 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText("78 '")).toBeInTheDocument();
    });

    it('renders substitution off time', async () => {
      const stat = { ...startingPlayer(), substitutionOffTime: 55 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText("55'")).toBeInTheDocument();
    });

    it('renders Substitutes header at substitute boundary', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [startingPlayer(), unusedSub()] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Substitutes')).toBeInTheDocument();
    });

    it('does not render Substitutes header when all players are starters', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [startingPlayer(), startingPlayer()] },
        providers: [provideRouter([])],
      });

      expect(screen.queryByText('Substitutes')).not.toBeInTheDocument();
    });

    it('does not render Substitutes header in d11-match context', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'd11-match', playerMatchStats: [startingPlayer(), unusedSub()] },
        providers: [provideRouter([])],
      });

      expect(screen.queryByText('Substitutes')).not.toBeInTheDocument();
    });

    it('renders separators between starting players', async () => {
      const stats = Array.from({ length: 3 }, (_, index) => {
        const stat = startingPlayer();
        return { ...stat, player: { ...stat.player, id: index + 1 } };
      });

      const { container } = await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: stats },
        providers: [provideRouter([])],
      });

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });
  });

  describe('accordion content', () => {
    it('shows Team label in d11-match context for non-dummy team', async () => {
      const stat = { ...startingPlayer(), team: { ...fakePlayerMatchStat().team, dummy: false } };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'd11-match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Team')).toBeInTheDocument();
    });

    it('does not show Team label in match context', async () => {
      const stat = { ...startingPlayer(), team: { ...fakePlayerMatchStat().team, dummy: false } };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.queryByText('Team')).not.toBeInTheDocument();
    });

    it('shows D11 team label in match context for non-dummy d11Team', async () => {
      const stat = {
        ...startingPlayer(),
        d11Team: { ...fakePlayerMatchStat().d11Team, dummy: false },
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('D11 team')).toBeInTheDocument();
    });

    it('does not show D11 team label in d11-match context', async () => {
      const stat = {
        ...startingPlayer(),
        d11Team: { ...fakePlayerMatchStat().d11Team, dummy: false },
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'd11-match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.queryByText('D11 team')).not.toBeInTheDocument();
    });

    it('shows "Did not participate" for DNP player', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [didNotParticipate()] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Did not participate')).toBeInTheDocument();
    });

    it('shows "Unused substitute" for unused sub', async () => {
      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [unusedSub()] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Unused substitute')).toBeInTheDocument();
    });

    it('shows goals when goals > 0', async () => {
      const stat = { ...startingPlayer(), goals: 2 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Goals')).toBeInTheDocument();
    });

    it('shows assists when goalAssists > 0', async () => {
      const stat = { ...startingPlayer(), goalAssists: 1 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Assists')).toBeInTheDocument();
    });

    it('shows own goals when ownGoals > 0', async () => {
      const stat = { ...startingPlayer(), ownGoals: 1 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Own goals')).toBeInTheDocument();
    });

    it('shows clean sheet for qualifying player with no goals conceded', async () => {
      const stat = {
        ...startingPlayer(),
        goalsConceded: 0,
        position: { ...fakePlayerMatchStat().position, id: 2 },
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Clean sheet')).toBeInTheDocument();
    });

    it('shows goals conceded for defender with goals conceded', async () => {
      const stat = {
        ...startingPlayer(),
        goalsConceded: 3,
        position: { ...fakePlayerMatchStat().position, defender: true },
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Goals conceded')).toBeInTheDocument();
    });

    it('shows minutes played for starting player', async () => {
      const stat = { ...startingPlayer(), goalsConceded: 1 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Minutes played')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });

    it('shows minutes played for active substitute', async () => {
      const stat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.SUBSTITUTE,
        substitutionOnTime: 65,
        substitutionOffTime: 0,
        redCardTime: 0,
        yellowCardTime: 0,
        goals: 0,
        goalAssists: 0,
        ownGoals: 0,
        manOfTheMatch: false,
        sharedManOfTheMatch: false,
        goalsConceded: 1,
      };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Minutes played')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('calculates minutes played for substituted-off starting player', async () => {
      const stat = { ...startingPlayer(), substitutionOffTime: 70, goalsConceded: 1 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Minutes played')).toBeInTheDocument();
      expect(screen.getByText('70')).toBeInTheDocument();
    });

    it('calculates minutes played for starting player sent off with red card', async () => {
      const stat = { ...startingPlayer(), redCardTime: 55, goalsConceded: 1 };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([])],
      });

      expect(screen.getByText('Minutes played')).toBeInTheDocument();
      expect(screen.getByText('55')).toBeInTheDocument();
    });
  });

  describe('player profile navigation', () => {
    it('navigates to player profile on button click', async () => {
      const stat = startingPlayer();
      const routerService = { navigateToPlayer: vi.fn() };

      await render(PlayerMatchStatsAccordionComponent, {
        inputs: { context: 'match', playerMatchStats: [stat] },
        providers: [provideRouter([]), { provide: RouterService, useValue: routerService }],
      });

      await userEvent.click(screen.getByText('Player profile'));

      expect(routerService.navigateToPlayer).toHaveBeenCalledWith(
        stat.player.id,
        stat.match.matchWeek.season.id,
      );
    });
  });
});
