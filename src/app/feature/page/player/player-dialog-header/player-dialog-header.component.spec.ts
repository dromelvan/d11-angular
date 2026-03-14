import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlayerDialogHeaderComponent } from './player-dialog-header.component';
import { fakePlayer, fakePlayerMatchStat } from '@app/core/api/test/faker-util';
import { type PlayerMatchStat } from '@app/core/api';

function fakeItem(): PlayerMatchStat {
  return fakePlayerMatchStat();
}

function fakeConfig(initialIndex = 0) {
  const items = [fakeItem(), fakeItem(), fakeItem()];
  const current = signal(items[initialIndex]);
  return { data: { player: fakePlayer(), current, list: items } };
}

describe('PlayerDialogHeaderComponent', () => {
  async function setup(initialIndex = 0) {
    const config = fakeConfig(initialIndex);
    await render(PlayerDialogHeaderComponent, {
      providers: [{ provide: DynamicDialogConfig, useValue: config }],
    });
    return config;
  }

  it('renders player name', async () => {
    const config = await setup();

    expect(screen.getByText(config.data.list[0].player.name)).toBeInTheDocument();
  });

  it('renders avatar', async () => {
    await setup();

    expect(document.querySelector('app-avatar')).toBeInTheDocument();
  });

  describe('chevron buttons', () => {
    it('disables left and enables right at first item', async () => {
      await setup(0);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).toBeDisabled();
      expect(right).not.toBeDisabled();
    });

    it('enables left and disables right at last item', async () => {
      await setup(2);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).not.toBeDisabled();
      expect(right).toBeDisabled();
    });

    it('enables both when in the middle', async () => {
      await setup(1);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).not.toBeDisabled();
      expect(right).not.toBeDisabled();
    });
  });
});
