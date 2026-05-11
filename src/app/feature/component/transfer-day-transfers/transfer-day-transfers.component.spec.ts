import { Component } from '@angular/core';
import { Transfer, TransferApiService, TransferDay } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakePlayerBase, fakeTransfer, fakeTransferDay, fakeTransferListingBase } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransferDayTransfersComponent } from './transfer-day-transfers.component';

let transferDay: TransferDay;

@Component({
  template: ` <app-transfer-day-transfers [transferDay]="transferDay" />`,
  standalone: true,
  imports: [TransferDayTransfersComponent],
})
class HostComponent {
  transferDay = transferDay;
}

@Component({
  template: ` <app-transfer-day-transfers [transferDay]="transferDay" [draft]="true" />`,
  standalone: true,
  imports: [TransferDayTransfersComponent],
})
class DraftHostComponent {
  transferDay = transferDay;
}

describe('TransferDayTransfersComponent', () => {
  describe('with transfers', () => {
    let transfers: Transfer[];
    let transferApi: { getTransfersByTransferDayId: ReturnType<typeof vi.fn> };
    let dynamicDialogService: { openTransfer: ReturnType<typeof vi.fn> };
    let routerService: { navigateToPlayer: ReturnType<typeof vi.fn> };

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

      transferApi = { getTransfersByTransferDayId: vi.fn().mockReturnValue(of(transfers)) };
      dynamicDialogService = { openTransfer: vi.fn() };
      routerService = { navigateToPlayer: vi.fn() };

      await render(HostComponent, {
        providers: [
          { provide: TransferApiService, useValue: transferApi },
          { provide: LoadingService, useValue: { register: vi.fn() } },
          { provide: DynamicDialogService, useValue: dynamicDialogService },
          { provide: RouterService, useValue: routerService },
        ],
      });
    });

    it('renders column headers', async () => {
      await waitFor(() => {
        expect(screen.getByText('Player')).toBeInTheDocument();
        expect(screen.getByText('D11 Team / Fee')).toBeInTheDocument();
      });
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

    it('opens dialog when a row is clicked', async () => {
      await waitFor(() => screen.getByText('Player1'));

      await userEvent.click(screen.getByText('Player1'));

      expect(dynamicDialogService.openTransfer).toHaveBeenCalledWith(
        transfers[1],
        [transfers[0], transfers[1]],
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });

    it('action onClick navigates to the player', async () => {
      await waitFor(() => screen.getByText('Player1'));
      await userEvent.click(screen.getByText('Player1'));

      const { onClick } = dynamicDialogService.openTransfer.mock.calls[0][2];
      onClick(transfers[1]);

      expect(routerService.navigateToPlayer).toHaveBeenCalledWith(transfers[1].player.id);
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

    it('renders transfers in original order', async () => {
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

    it('renders no transfers message', () => {
      expect(screen.getByText('No transfers')).toBeInTheDocument();
    });

    it('renders no grid rows', () => {
      expect(document.querySelectorAll('.app-grid-cell')).toHaveLength(0);
    });
  });
});
