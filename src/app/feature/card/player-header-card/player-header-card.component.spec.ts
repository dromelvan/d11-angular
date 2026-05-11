import type { Player, PlayerSeasonStat } from '@app/core/api';
import { fakePlayer, fakePlayerSeasonStat } from '@app/test';
import { render } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerHeaderCardComponent } from './player-header-card.component';

describe('PlayerHeaderCardComponent', () => {
  it('renders', async () => {
    const player = fakePlayer();
    const playerSeasonStat = fakePlayerSeasonStat();

    await render(PlayerHeaderCardComponent, { inputs: { player, playerSeasonStat } });

    expect(document.querySelector('.app-player-header-card')).toBeInTheDocument();
  });

  it('does not render when player is undefined', async () => {
    const playerSeasonStat: PlayerSeasonStat = fakePlayerSeasonStat();

    await render(PlayerHeaderCardComponent, {
      inputs: { player: undefined as unknown as Player, playerSeasonStat },
    });

    expect(document.querySelector('.app-player-header-card')).not.toBeInTheDocument();
  });
});
