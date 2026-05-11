import { TransferApiService } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeTransferDay } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransferDayTransfersCardComponent } from './transfer-day-transfers-card.component';

const providers = [
  {
    provide: TransferApiService,
    useValue: { getTransfersByTransferDayId: vi.fn().mockReturnValue(of([])) },
  },
  { provide: LoadingService, useValue: { register: vi.fn() } },
  { provide: DynamicDialogService, useValue: { openTransfer: vi.fn() } },
  { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
];

describe('TransferDayTransfersCardComponent', () => {
  it('renders transfer day number in header', async () => {
    const transferDay = fakeTransferDay();

    await render(TransferDayTransfersCardComponent, {
      inputs: { transferDay },
      providers,
    });

    expect(screen.getByText(`Transfer Day ${transferDay.transferDayNumber}`)).toBeInTheDocument();
  });

  it('renders date in header', async () => {
    const transferDay = { ...fakeTransferDay(), datetime: '2025-06-15T14:30:00.000Z' };

    await render(TransferDayTransfersCardComponent, {
      inputs: { transferDay },
      providers,
    });

    expect(screen.getByText('Jun 15, 2025')).toBeInTheDocument();
  });
});
