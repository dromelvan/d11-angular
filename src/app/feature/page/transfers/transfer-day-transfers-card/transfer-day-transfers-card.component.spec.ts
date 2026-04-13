import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Transfer, TransferApiService, TransferDay } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakePlayerBase, fakeTransfer, fakeTransferDay, fakeTransferListingBase } from '@app/test';
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

@Component({
  template: ` <app-transfer-day-transfers-card [transferDay]="transferDay" [draft]="true" />`,
  standalone: true,
  imports: [TransferDayTransfersCardComponent],
})
class DraftHostComponent {
  transferDay = transferDay;
}

describe('TransferDayTransfersCardComponent', () => {
  describe('with transfers', () => {
    let transfers: Transfer[];
    let transferApi: { getTransfersByTransferDayId: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      transferDay = fakeTransferDay();
      transfers = [
        {
          ...fakeTransfer(),
          player: { ...fakePlayerBase(), name: 'Player1' },
          transferListing: { ...fakeTransferListingBase(), ranking: 5 },
        },
        {
          ...fakeTransfer(),
          player: { ...fakePlayerBase(), name: 'Player2' },
          transferListing: { ...fakeTransferListingBase(), ranking: 2 },
        },
      ];

      transferApi = {
        getTransfersByTransferDayId: vi.fn().mockReturnValue(of(transfers)),
      };

      await render(HostComponent, {
        providers: [
          { provide: TransferApiService, useValue: transferApi },
          { provide: LoadingService, useValue: { register: vi.fn() } },
          { provide: DynamicDialogService, useValue: { openTransfer: vi.fn() } },
          { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
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

    it('renders ranking', async () => {
      await waitFor(() => {
        for (const transfer of transfers) {
          expect(
            screen.getByText(`#${transfer.transferListing.ranking}`, { exact: false }),
          ).toBeInTheDocument();
        }
      });
    });

    it('renders sorted transfers', async () => {
      await waitFor(() => {
        const names = screen.getAllByText(/Player\d/).map((el) => el.textContent?.trim());

        expect(names).toEqual(['Player2', 'Player1']);
      });
    });

    it('opens dialog', async () => {
      await waitFor(() => screen.getByText('Player1'));

      await userEvent.click(screen.getByText('Player1'));

      expect(TestBed.inject(DynamicDialogService).openTransfer).toHaveBeenCalledWith(
        transfers[1],
        [transfers[0], transfers[1]],
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });

    it('navigates to the player', async () => {
      await waitFor(() => screen.getByText('Player1'));
      await userEvent.click(screen.getByText('Player1'));

      const { onClick } = (
        TestBed.inject(DynamicDialogService).openTransfer as ReturnType<typeof vi.fn>
      ).mock.calls[0][2];
      onClick(transfers[1]);

      expect(TestBed.inject(RouterService).navigateToPlayer).toHaveBeenCalledWith(
        transfers[1].player.id,
      );
    });
  });

  describe('draft', () => {
    let transfers: Transfer[];

    beforeEach(async () => {
      transferDay = fakeTransferDay();
      transfers = [
        {
          ...fakeTransfer(),
          player: { ...fakePlayerBase(), name: 'Player1' },
          transferListing: { ...fakeTransferListingBase(), ranking: 5 },
        },
        {
          ...fakeTransfer(),
          player: { ...fakePlayerBase(), name: 'Player2' },
          transferListing: { ...fakeTransferListingBase(), ranking: 2 },
        },
      ];

      await render(DraftHostComponent, {
        providers: [
          {
            provide: TransferApiService,
            useValue: { getTransfersByTransferDayId: vi.fn().mockReturnValue(of(transfers)) },
          },
          { provide: LoadingService, useValue: { register: vi.fn() } },
          { provide: DynamicDialogService, useValue: { openTransfer: vi.fn() } },
          { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
        ],
      });
    });

    it('does not render ranking', async () => {
      await waitFor(() => screen.getByText('Player1'));

      for (const transfer of transfers) {
        expect(
          screen.queryByText(`#${transfer.transferListing.ranking}`, { exact: false }),
        ).not.toBeInTheDocument();
      }
    });

    it('renders transfers', async () => {
      await waitFor(() => {
        const names = screen.getAllByText(/Player\d/).map((el) => el.textContent?.trim());

        expect(names).toEqual(['Player1', 'Player2']);
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
          { provide: DynamicDialogService, useValue: { openTransfer: vi.fn() } },
          { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
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
