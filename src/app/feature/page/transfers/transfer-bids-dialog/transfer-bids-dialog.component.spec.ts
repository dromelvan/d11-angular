import { Component, signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Transfer, TransferBid, TransferBidApiService } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { fakeD11TeamBase, fakeTransfer, fakeTransferBid } from '@app/test';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransferBidsDialogComponent } from './transfer-bids-dialog.component';

@Component({
  template: ` <app-transfer-bids-dialog />`,
  standalone: true,
  imports: [TransferBidsDialogComponent],
})
class HostComponent {}

describe('TransferBidsDialogComponent', () => {
  describe('with transfer bids', () => {
    let transfer: Transfer;
    let transferBids: TransferBid[];
    let transferBidApi: { getTransferBidsByTransferDayIdAndPlayerId: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      transfer = fakeTransfer();
      transferBids = [
        {
          ...fakeTransferBid(),
          d11Team: { ...fakeD11TeamBase(), name: 'Team1' },
          fee: 10,
          activeFee: 30,
          successful: false,
        },
        {
          ...fakeTransferBid(),
          d11Team: { ...fakeD11TeamBase(), name: 'Team2' },
          fee: 20,
          activeFee: 40,
          successful: false,
        },
      ];

      transferBidApi = {
        getTransferBidsByTransferDayIdAndPlayerId: vi.fn().mockReturnValue(of(transferBids)),
      };

      await render(HostComponent, {
        providers: [
          {
            provide: DynamicDialogConfig,
            useValue: { data: { current: signal(transfer) } },
          },
          { provide: TransferBidApiService, useValue: transferBidApi },
          { provide: LoadingService, useValue: { register: vi.fn() } },
        ],
      });
    });

    it('renders', () => {
      expect(screen.getByText('D11 Team')).toBeInTheDocument();
      expect(screen.getByText('Bid')).toBeInTheDocument();
      expect(screen.getByText('Fee')).toBeInTheDocument();
    });

    it('fetches transfer bids', () => {
      expect(transferBidApi.getTransferBidsByTransferDayIdAndPlayerId).toHaveBeenCalledWith(
        transfer.transferDay.id,
        transfer.player.id,
      );
    });

    it('renders d11 team names', async () => {
      await waitFor(() => {
        for (const bid of transferBids) {
          expect(screen.getByText(bid.d11Team.name)).toBeInTheDocument();
        }
      });
    });

    it('renders fees', async () => {
      await waitFor(() => {
        for (const bid of transferBids) {
          expect(screen.getByText(`${(bid.fee / 10).toFixed(1)}m`)).toBeInTheDocument();
        }
      });
    });

    it('renders active fees', async () => {
      await waitFor(() => {
        for (const bid of transferBids) {
          expect(screen.getByText(`${(bid.activeFee / 10).toFixed(1)}m`)).toBeInTheDocument();
        }
      });
    });
  });

  describe('with no transfer bids', () => {
    beforeEach(async () => {
      await render(HostComponent, {
        providers: [
          {
            provide: DynamicDialogConfig,
            useValue: { data: { current: signal(fakeTransfer()) } },
          },
          {
            provide: TransferBidApiService,
            useValue: {
              getTransferBidsByTransferDayIdAndPlayerId: vi.fn().mockReturnValue(of([])),
            },
          },
          { provide: LoadingService, useValue: { register: vi.fn() } },
        ],
      });
    });

    it('renders', () => {
      expect(screen.getByText('D11 Team')).toBeInTheDocument();
      expect(screen.getByText('Bid')).toBeInTheDocument();
      expect(screen.getByText('Fee')).toBeInTheDocument();
    });

    it('renders no grid rows', async () => {
      await waitFor(() => {
        expect(document.querySelectorAll('.app-grid-cell')).toHaveLength(0);
      });
    });
  });
});
