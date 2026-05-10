import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { fakeTransferListing } from '@app/test';
import { TransferListingDialogComponent } from './transfer-listing-dialog.component';

describe('TransferListingDialogComponent', () => {
  async function setup() {
    const transferListing = fakeTransferListing();
    const current = signal(transferListing);
    await render(TransferListingDialogComponent, {
      providers: [{ provide: DynamicDialogConfig, useValue: { data: { current } } }],
    });
    return transferListing;
  }

  it('renders player season stat', async () => {
    await setup();

    expect(document.querySelector('app-player-season-stat')).toBeInTheDocument();
  });

  it('renders position name', async () => {
    const transferListing = await setup();

    expect(screen.getByText(transferListing.position.name)).toBeInTheDocument();
  });
});
