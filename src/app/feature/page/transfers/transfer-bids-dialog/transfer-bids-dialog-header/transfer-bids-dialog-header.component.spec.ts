import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { fakeTransfer } from '@app/test';
import { Transfer } from '@app/core/api';
import { expect } from 'vitest';
import { TransferBidsDialogHeaderComponent } from './transfer-bids-dialog-header.component';

function fakeConfig(initialIndex = 0) {
  const items: Transfer[] = [fakeTransfer(), fakeTransfer(), fakeTransfer()];
  const current = signal(items[initialIndex]);
  return { data: { current, list: items } };
}

describe('TransferBidsDialogHeaderComponent', () => {
  async function setup(initialIndex = 0) {
    const config = fakeConfig(initialIndex);
    await render(TransferBidsDialogHeaderComponent, {
      providers: [{ provide: DynamicDialogConfig, useValue: config }],
    });
    return config;
  }

  it('renders avatar', async () => {
    await setup();

    expect(document.querySelector('app-avatar')).toBeInTheDocument();
  });

  it('renders player name', async () => {
    const config = await setup();

    expect(screen.getByText(config.data.list[0].player.name)).toBeInTheDocument();
  });

  describe('navigation buttons', () => {
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

    it('enables both buttons at middle item', async () => {
      await setup(1);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).not.toBeDisabled();
      expect(right).not.toBeDisabled();
    });
  });
});
