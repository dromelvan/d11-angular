import { Component } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { TransferDay, TransferListing, TransferListingApiService } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakePlayerBase, fakeTransferDay, fakeTransferListing } from '@app/test';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransferDayTransferListingsCardComponent } from './transfer-day-transfer-listings-card.component';

let transferDay: TransferDay;

@Component({
  template: ` <app-transfer-day-transfer-listings-card [transferDay]="transferDay" />`,
  standalone: true,
  imports: [TransferDayTransferListingsCardComponent],
})
class HostComponent {
  transferDay = transferDay;
}

describe('TransferDayTransferListingsCardComponent', () => {
  describe('with transfer listings', () => {
    let transferListings: TransferListing[];
    let transferListingApi: { getTransferListingsByTransferDayId: ReturnType<typeof vi.fn> };
    let dynamicDialogService: { openTransferListing: ReturnType<typeof vi.fn> };
    let routerService: { navigateToPlayer: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      transferDay = fakeTransferDay();
      transferListings = [
        { ...fakeTransferListing(), player: { ...fakePlayerBase(), name: 'Player1' } },
        { ...fakeTransferListing(), player: { ...fakePlayerBase(), name: 'Player2' } },
      ];

      transferListingApi = {
        getTransferListingsByTransferDayId: vi.fn().mockReturnValue(of(transferListings)),
      };
      dynamicDialogService = { openTransferListing: vi.fn() };
      routerService = { navigateToPlayer: vi.fn() };

      await render(HostComponent, {
        providers: [
          { provide: TransferListingApiService, useValue: transferListingApi },
          { provide: LoadingService, useValue: { register: vi.fn() } },
          { provide: DynamicDialogService, useValue: dynamicDialogService },
          { provide: RouterService, useValue: routerService },
        ],
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-transfer-day-transfer-listings-card')).toBeInTheDocument();
    });

    it('renders the card header', () => {
      expect(screen.getByText(`Transfer Day ${transferDay.transferDayNumber}`)).toBeInTheDocument();
    });

    it('fetches transfer listings', () => {
      expect(transferListingApi.getTransferListingsByTransferDayId).toHaveBeenCalledWith(
        transferDay.id,
        undefined,
        false,
      );
    });

    it('renders player names', async () => {
      await waitFor(() => {
        for (const transferListing of transferListings) {
          expect(screen.getByText(transferListing.player.name)).toBeInTheDocument();
        }
      });
    });

    it('renders d11 team names', async () => {
      await waitFor(() => {
        for (const transferListing of transferListings) {
          expect(screen.getByText(transferListing.d11Team.name)).toBeInTheDocument();
        }
      });
    });

    it('renders position and team', async () => {
      await waitFor(() => {
        for (const transferListing of transferListings) {
          expect(
            screen.getByText(
              `${transferListing.position.name} - ${transferListing.team.shortName}`,
            ),
          ).toBeInTheDocument();
        }
      });
    });

    it('renders ranking and points', async () => {
      await waitFor(() => {
        for (const transferListing of transferListings) {
          expect(
            screen.getByText(`#${transferListing.ranking} / ${transferListing.points} pts`),
          ).toBeInTheDocument();
        }
      });
    });

    it('opens dialog when a row is clicked', async () => {
      await waitFor(() => screen.getByText('Player1'));

      await userEvent.click(screen.getByText('Player1'));

      expect(dynamicDialogService.openTransferListing).toHaveBeenCalledWith(
        transferListings[0],
        transferListings,
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });

    it('action onClick navigates to the player', async () => {
      await waitFor(() => screen.getByText('Player1'));
      await userEvent.click(screen.getByText('Player1'));

      const { onClick } = dynamicDialogService.openTransferListing.mock.calls[0][2];
      onClick(transferListings[0]);

      expect(routerService.navigateToPlayer).toHaveBeenCalledWith(transferListings[0].player.id);
    });
  });

  describe('with no transfer listings', () => {
    beforeEach(async () => {
      transferDay = fakeTransferDay();

      await render(HostComponent, {
        providers: [
          {
            provide: TransferListingApiService,
            useValue: {
              getTransferListingsByTransferDayId: vi.fn().mockReturnValue(of([])),
            },
          },
          { provide: LoadingService, useValue: { register: vi.fn() } },
          { provide: DynamicDialogService, useValue: { openTransferListing: vi.fn() } },
          { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
        ],
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-transfer-day-transfer-listings-card')).toBeInTheDocument();
    });

    it('renders the card header', () => {
      expect(screen.getByText(`Transfer Day ${transferDay.transferDayNumber}`)).toBeInTheDocument();
    });

    it('does not render grid', () => {
      expect(document.querySelectorAll('.app-grid-cell')).toHaveLength(0);
    });

    it('renders no transfer listings message', () => {
      expect(screen.getByText('No transfer listings')).toBeInTheDocument();
    });
  });
});
