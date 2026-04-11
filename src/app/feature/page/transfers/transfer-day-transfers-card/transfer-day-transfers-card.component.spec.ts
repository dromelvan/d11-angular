import { Component } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { Transfer, TransferApiService, TransferDay } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { fakePlayerBase, fakeTransfer, fakeTransferDay } from '@app/test';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransferDayTransfersCardComponent } from './transfer-day-transfers-card.component';

let transferDay: TransferDay;

@Component({
  template: ` <app-transfer-day-transfers-card [transferDay]="transferDay" />`,
  standalone: true,
  imports: [TransferDayTransfersCardComponent],
})
class HostComponent {
  transferDay = transferDay;
}

describe('TransferDayTransfersCardComponent', () => {
  describe('with transfers', () => {
    let transfers: Transfer[];
    let transferApi: { getTransfersByTransferDayId: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      transferDay = fakeTransferDay();
      transfers = [
        { ...fakeTransfer(), player: { ...fakePlayerBase(), name: 'Player1' } },
        { ...fakeTransfer(), player: { ...fakePlayerBase(), name: 'Player2' } },
      ];

      transferApi = {
        getTransfersByTransferDayId: vi.fn().mockReturnValue(of(transfers)),
      };

      await render(HostComponent, {
        providers: [
          { provide: TransferApiService, useValue: transferApi },
          { provide: LoadingService, useValue: { register: vi.fn() } },
        ],
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-transfer-day-transfers-card')).toBeInTheDocument();
    });

    it('renders the card header', () => {
      expect(screen.getByText(`Transfer Day ${transferDay.transferDayNumber}`)).toBeInTheDocument();
    });

    it('fetches transfers', () => {
      expect(transferApi.getTransfersByTransferDayId).toHaveBeenCalledWith(transferDay.id);
    });

    it('renders player names', async () => {
      await waitFor(() => {
        for (const transfer of transfers) {
          expect(screen.getByText(transfer.player.name)).toBeInTheDocument();
        }
      });
    });

    it('renders d11 team names', async () => {
      await waitFor(() => {
        for (const transfer of transfers) {
          expect(screen.getByText(transfer.d11Team.name)).toBeInTheDocument();
        }
      });
    });

    it('renders position and team short name', async () => {
      await waitFor(() => {
        for (const transfer of transfers) {
          expect(
            screen.getByText(
              `${transfer.transferListing.position.name} - ${transfer.transferListing.team.shortName}`,
              { exact: false },
            ),
          ).toBeInTheDocument();
        }
      });
    });

    it('renders fee', async () => {
      await waitFor(() => {
        for (const transfer of transfers) {
          expect(screen.getByText(`${(transfer.fee / 10).toFixed(1)}m`)).toBeInTheDocument();
        }
      });
    });
  });

  describe('with no transfers', () => {
    beforeEach(async () => {
      transferDay = fakeTransferDay();
      await render(HostComponent, {
        providers: [
          {
            provide: TransferApiService,
            useValue: { getTransfersByTransferDayId: vi.fn().mockReturnValue(of([])) },
          },
          { provide: LoadingService, useValue: { register: vi.fn() } },
        ],
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-transfer-day-transfers-card')).toBeInTheDocument();
    });

    it('renders the card header with transfer day number', () => {
      expect(screen.getByText(`Transfer Day ${transferDay.transferDayNumber}`)).toBeInTheDocument();
    });

    it('renders no transfers message', () => {
      expect(screen.getByText('No transfers')).toBeInTheDocument();
    });

    it('renders no grid rows', () => {
      expect(document.querySelectorAll('.app-grid-cell')).toHaveLength(0);
    });
  });
});
