import { Component } from '@angular/core';
import { Status, TransferDay, TransferWindow } from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { TransferApiService } from '@app/core/api/transfer/transfer-api.service';
import { TransferListingApiService } from '@app/core/api/transfer-listing/transfer-listing-api.service';
import { fakeTransferDay, fakeTransferWindow } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { TransfersPageComponent } from './transfers-page.component';

let transferWindow: TransferWindow;
let transferWindowApi: TransferWindowApiService;
let loadingService: LoadingService;
let routerService: RouterService;

@Component({
  template: ` <app-transfers-page [transferWindowId]="transferWindowId" />`,
  standalone: true,
  imports: [TransfersPageComponent],
})
class HostComponent {
  transferWindowId: number | undefined = transferWindow.id;
}

@Component({
  template: ` <app-transfers-page />`,
  standalone: true,
  imports: [TransfersPageComponent],
})
class NoIdHostComponent {}

function makeProviders() {
  return [
    { provide: TransferWindowApiService, useValue: transferWindowApi },
    { provide: LoadingService, useValue: loadingService },
    { provide: RouterService, useValue: routerService },
    {
      provide: TransferApiService,
      useValue: { getTransfersByTransferDayId: vi.fn().mockReturnValue(of([])) },
    },
    {
      provide: TransferListingApiService,
      useValue: { getTransferListingsByTransferDayId: vi.fn().mockReturnValue(of([])) },
    },
  ];
}

describe('TransfersPageComponent', () => {
  beforeEach(() => {
    transferWindow = { ...fakeTransferWindow(), transferWindowNumber: 5 };

    transferWindowApi = {
      getTransferWindowById: vi.fn().mockReturnValue(of(transferWindow)),
      getCurrentTransferWindow: vi.fn().mockReturnValue(of(transferWindow)),
    } as unknown as TransferWindowApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;
    routerService = { navigateToTransferWindow: vi.fn() } as unknown as RouterService;
  });

  describe('with transferWindowId', () => {
    beforeEach(async () => {
      await render(HostComponent, { providers: makeProviders() });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-transfers-page')).toBeInTheDocument();
      });
    });

    it('renders transfer window number', async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Transfer Window ${transferWindow.transferWindowNumber}`, {
            exact: false,
          }),
        ).toBeInTheDocument();
      });
    });

    it('calls getTransferWindowById with transferWindowId', () => {
      expect(transferWindowApi.getTransferWindowById).toHaveBeenCalledWith(transferWindow.id);
    });

    it('always calls getCurrentTransferWindow', () => {
      expect(transferWindowApi.getCurrentTransferWindow).toHaveBeenCalled();
    });
  });

  describe('without transferWindowId', () => {
    beforeEach(async () => {
      await render(NoIdHostComponent, { providers: makeProviders() });
    });

    it('renders transfer window number', async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Transfer Window ${transferWindow.transferWindowNumber}`, {
            exact: false,
          }),
        ).toBeInTheDocument();
      });
    });

    it('calls getCurrentTransferWindow', () => {
      expect(transferWindowApi.getCurrentTransferWindow).toHaveBeenCalled();
      expect(transferWindowApi.getTransferWindowById).not.toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('navigates to previous', async () => {
      transferWindow = { ...transferWindow, id: 10 };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));
      transferWindowApi.getCurrentTransferWindow = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, id: 20 }));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() => screen.getByText(/Transfer Window/));
      await userEvent.click(screen.getByRole('button', { name: /chevron_left/i }));

      expect(routerService.navigateToTransferWindow).toHaveBeenCalledWith(9);
    });

    it('navigates to next', async () => {
      transferWindow = { ...transferWindow, id: 10 };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));
      transferWindowApi.getCurrentTransferWindow = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, id: 20 }));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() => screen.getByText(/Transfer Window/));
      await userEvent.click(screen.getByRole('button', { name: /chevron_right/i }));

      expect(routerService.navigateToTransferWindow).toHaveBeenCalledWith(11);
    });

    it('disables previous button', async () => {
      transferWindow = { ...transferWindow, id: 1 };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() => screen.getByText(/Transfer Window/));

      expect(screen.getByRole('button', { name: /chevron_left/i })).toBeDisabled();
    });

    it('disables next button', async () => {
      transferWindow = { ...transferWindow, id: 10 };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));
      transferWindowApi.getCurrentTransferWindow = vi.fn().mockReturnValue(of(transferWindow));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() => screen.getByText(/Transfer Window/));

      expect(screen.getByRole('button', { name: /chevron_right/i })).toBeDisabled();
    });
  });

  describe('tabs', () => {
    it('does not render tabs when pending', async () => {
      transferWindow = { ...fakeTransferWindow(), status: Status.PENDING };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() =>
        expect(document.querySelector('.app-transfers-page')).toBeInTheDocument(),
      );

      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('renders Transfer Listings tab when active', async () => {
      const transferDay: TransferDay = { ...fakeTransferDay(), status: Status.ACTIVE };
      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        transferDays: [transferDay],
      };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Transfer Listings/i })).toBeInTheDocument();
      });
    });

    it('renders Transfers tab when there is a finished transfer day', async () => {
      const transferDays: TransferDay[] = [{ ...fakeTransferDay(), status: Status.FINISHED }];
      transferWindow = { ...fakeTransferWindow(), status: Status.ACTIVE, transferDays };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Transfers/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Transfer Listings/i })).toBeInTheDocument();
      });
    });

    it('does not render Transfers tab when no transfer day is finished', async () => {
      const transferDays: TransferDay[] = [{ ...fakeTransferDay(), status: Status.ACTIVE }];
      transferWindow = { ...fakeTransferWindow(), status: Status.ACTIVE, transferDays };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(transferWindow));

      await render(HostComponent, { providers: makeProviders() });

      await waitFor(() =>
        expect(screen.getByRole('tab', { name: /Transfer Listings/i })).toBeInTheDocument(),
      );

      expect(screen.queryByRole('tab', { name: /^Transfers$/i })).not.toBeInTheDocument();
    });
  });
});
