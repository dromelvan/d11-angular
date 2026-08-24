import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TransferListing, TransferListingApiService } from '@app/core/api';
import { fakePlayerBase, fakeTransferListing } from '@app/test';
import { TransferDayTransferListingsSectionComponent } from './transfer-day-transfer-listings-section.component';

const mockTransferListingApi = {
  getTransferListingsByTransferDayId:
    vi.fn<(id: number, page?: number, dummy?: boolean) => Observable<TransferListing[]>>(),
};

const providers = [{ provide: TransferListingApiService, useValue: mockTransferListingApi }];

describe('TransferDayTransferListingsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([]));
  });

  it('renders "Transfer Listings" in the section header', async () => {
    await render(TransferDayTransferListingsSectionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Transfer Listings');
  });

  it('renders player name from listings', async () => {
    const listing = { ...fakeTransferListing(), player: { ...fakePlayerBase(), name: 'Player1' } };
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

    await render(TransferDayTransferListingsSectionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Player1')).toBeInTheDocument();
  });
});
