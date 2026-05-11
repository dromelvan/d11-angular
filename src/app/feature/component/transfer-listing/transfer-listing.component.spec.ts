import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { fakeTransferListing } from '@app/test';
import { TransferListingComponent } from './transfer-listing.component';

describe('TransferListingDialogComponent', () => {
  async function setup() {
    const transferListing = fakeTransferListing();
    const current = signal(transferListing);
    await render(TransferListingComponent, {
      providers: [{ provide: DynamicDialogConfig, useValue: { data: { current } } }],
    });
    return transferListing;
  }

  it('renders player stat summary', async () => {
    await setup();

    expect(document.querySelector('app-player-stat-summary')).toBeInTheDocument();
  });

  it('renders position name', async () => {
    const transferListing = await setup();

    expect(screen.getByText(transferListing.position.name)).toBeInTheDocument();
  });
});
