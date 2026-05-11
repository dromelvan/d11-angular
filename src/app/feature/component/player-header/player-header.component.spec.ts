import type { Player, PlayerSeasonStat } from '@app/core/api';
import { fakePlayer, fakePlayerSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerHeaderComponent } from './player-header.component';

describe('PlayerHeaderComponent', () => {
  let player: Player;
  let playerSeasonStat: PlayerSeasonStat;

  beforeEach(async () => {
    player = { ...fakePlayer(), firstName: 'TestFirst' };
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.team.dummy = false;
    playerSeasonStat.d11Team.dummy = false;

    await render(PlayerHeaderComponent, { inputs: { player, playerSeasonStat } });
  });

  it('renders player image', () => {
    expect(screen.getByAltText(player.name)).toBeInTheDocument();
  });

  it('renders player last name', () => {
    expect(screen.getByText(player.lastName)).toBeInTheDocument();
  });

  it('renders player first name', () => {
    expect(screen.getByText('TestFirst')).toBeInTheDocument();
  });

  it('renders position', () => {
    expect(screen.getByText(playerSeasonStat.position.name)).toBeInTheDocument();
  });

  it('renders team', () => {
    expect(screen.getByText(playerSeasonStat.team.name)).toBeInTheDocument();
    expect(screen.getByAltText(playerSeasonStat.team.name)).toBeInTheDocument();
  });

  it('renders d11 team', () => {
    expect(screen.getByText(playerSeasonStat.d11Team.name)).toBeInTheDocument();
    expect(screen.getByAltText(playerSeasonStat.d11Team.name)).toBeInTheDocument();
  });

  it('renders context button', () => {
    expect(screen.getByRole('button', { name: /more_vert/i })).toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent with dummies', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.team.dummy = true;
    playerSeasonStat.d11Team.dummy = true;

    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat },
    });
  });

  it('does not render dummy team', () => {
    expect(document.querySelector('.team-base')).not.toBeInTheDocument();
  });

  it('does not render dummy d11 team', () => {
    expect(document.querySelector('.d11-team-base')).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent without first name', () => {
  it('does not render first name element', async () => {
    const player = { ...fakePlayer(), firstName: '' };

    await render(PlayerHeaderComponent, {
      inputs: { player, playerSeasonStat: fakePlayerSeasonStat() },
    });

    expect(document.querySelector('h1.text-2xl')).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent with undefined playerSeasonStat', () => {
  it('does not render player season stats', async () => {
    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat: undefined },
    });

    expect(document.querySelector('.position')).not.toBeInTheDocument();
    expect(document.querySelector('.team-base')).not.toBeInTheDocument();
    expect(document.querySelector('.d11-team-base')).not.toBeInTheDocument();
  });
});
