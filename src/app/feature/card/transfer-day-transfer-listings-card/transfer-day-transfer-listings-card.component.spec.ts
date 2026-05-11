import { TransferListingApiService } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeTransferDay } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransferDayTransferListingsCardComponent } from './transfer-day-transfer-listings-card.component';

const providers = [
  {
    provide: TransferListingApiService,
    useValue: { getTransferListingsByTransferDayId: vi.fn().mockReturnValue(of([])) },
  },
  { provide: LoadingService, useValue: { register: vi.fn() } },
  { provide: DynamicDialogService, useValue: { openTransferListing: vi.fn() } },
  { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
];

describe('TransferDayTransferListingsCardComponent', () => {
  it('renders "Transfer Day X" header', async () => {
    const transferDay = fakeTransferDay();

    await render(TransferDayTransferListingsCardComponent, {
      inputs: { transferDay },
      providers,
    });

    expect(screen.getByText(`Transfer Day ${transferDay.transferDayNumber}`)).toBeInTheDocument();
  });
});
