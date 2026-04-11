import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { fakeTransferListing } from '@app/test';
import { TransferListing } from '@app/core/api';
import { TransferListingDialogHeaderComponent } from './transfer-listing-dialog-header.component';

function fakeConfig(initialIndex = 0) {
  const items: TransferListing[] = [
    fakeTransferListing(),
    fakeTransferListing(),
    fakeTransferListing(),
  ];
  const current = signal(items[initialIndex]);
  return { data: { current, list: items } };
}

describe('TransferListingDialogHeaderComponent', () => {
  async function setup(initialIndex = 0) {
    const config = fakeConfig(initialIndex);
    await render(TransferListingDialogHeaderComponent, {
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
    it('are disabled and enabled', async () => {
      await setup(0);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).toBeDisabled();
      expect(right).not.toBeDisabled();
    });

    it('are disabled and enabled', async () => {
      await setup(2);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).not.toBeDisabled();
      expect(right).toBeDisabled();
    });

    it('are enables', async () => {
      await setup(1);

      const [left, right] = document.querySelectorAll<HTMLButtonElement>(
        'app-button-icon-old button',
      );

      expect(left).not.toBeDisabled();
      expect(right).not.toBeDisabled();
    });
  });
});
