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
  redCardTime: 0,
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

describe('PlayerMatchStatsAccordionComponent', () => {
  it('renders player names', async () => {
    const player1 = startingPlayer();
    const player2 = startingPlayer();

    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [player1, player2] },
      providers: [provideRouter([])],
    });

    expect(screen.getByText(player1.player.name)).toBeInTheDocument();
    expect(screen.getByText(player2.player.name)).toBeInTheDocument();
  });

  it('renders position code', async () => {
    const stat = startingPlayer();

    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [stat] },
      providers: [provideRouter([])],
    });

    expect(screen.getByText(stat.position.code)).toBeInTheDocument();
  });

  it('renders Substitutes header at substitute boundary', async () => {
    const stats = [startingPlayer(), unusedSub()];

    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: stats },
      providers: [provideRouter([])],
    });

    expect(screen.getByText('Substitutes')).toBeInTheDocument();
  });

  it('does not render Substitutes header when all players are starters', async () => {
    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [startingPlayer(), startingPlayer()] },
      providers: [provideRouter([])],
    });

    expect(screen.queryByText('Substitutes')).not.toBeInTheDocument();
  });

  it('renders SUB label for unused substitute', async () => {
    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [unusedSub()] },
      providers: [provideRouter([])],
    });

    expect(screen.getByText('SUB')).toBeInTheDocument();
  });

  it('renders man of the match icon', async () => {
    const stat = {
      ...fakePlayerMatchStat(),
      lineup: Lineup.STARTING_LINEUP,
      manOfTheMatch: true,
      sharedManOfTheMatch: false,
    };

    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [stat] },
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
      inputs: { playerMatchStats: [stat] },
      providers: [provideRouter([])],
    });

    expect(screen.getByText('star_half')).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [startingPlayer()] },
      providers: [provideRouter([])],
    });

    expect(screen.getByText('Pos')).toBeInTheDocument();
    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('Rtg')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('navigates to player profile on button click', async () => {
    const stat = startingPlayer();
    const routerService = { navigateToPlayer: vi.fn() };

    await render(PlayerMatchStatsAccordionComponent, {
      inputs: { playerMatchStats: [stat] },
      providers: [provideRouter([]), { provide: RouterService, useValue: routerService }],
    });

    await userEvent.click(screen.getByText('Player profile'));

    expect(routerService.navigateToPlayer).toHaveBeenCalledWith(stat.player.id);
  });
});
