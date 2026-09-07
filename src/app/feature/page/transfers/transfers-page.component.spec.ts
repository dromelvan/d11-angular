import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NEVER, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  Status,
  TransferDay,
  TransferWindow,
  TransferWindowBase,
  TransferBidApiService,
} from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { TransferApiService } from '@app/core/api/transfer/transfer-api.service';
import { TransferListingApiService } from '@app/core/api/transfer-listing/transfer-listing-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeTransferDay, fakeTransferWindow } from '@app/test';
import { TransfersPageComponent } from './transfers-page.component';

let transferWindow: TransferWindow;
let transferWindowApi: {
  getTransferWindowById: ReturnType<typeof vi.fn>;
  getCurrentTransferWindow: ReturnType<typeof vi.fn>;
  getTransferWindowsBySeasonId: ReturnType<typeof vi.fn>;
};
let routerService: RouterService;

function makeProviders() {
  return [
    { provide: TransferWindowApiService, useValue: transferWindowApi },
    { provide: RouterService, useValue: routerService },
    {
      provide: CurrentService,
      useValue: {
        transferWindow: signal<TransferWindowBase | undefined>(undefined),
        season: signal(undefined),
        rxCurrent: { isLoading: signal(false) },
      },
    },
    { provide: PageContextService, useValue: { setContext: vi.fn() } },
    {
      provide: TransferApiService,
      useValue: { getTransfersByTransferDayId: vi.fn().mockReturnValue(of([])) },
    },
    {
      provide: TransferBidApiService,
      useValue: { getTransferBidsByTransferDayId: vi.fn().mockReturnValue(of([])) },
    },
    {
      provide: TransferListingApiService,
      useValue: { getTransferListingsByTransferDayId: vi.fn().mockReturnValue(of([])) },
    },
  ];
}

describe('TransfersPageComponent', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    transferWindow = {
      ...fakeTransferWindow(),
      transferWindowNumber: 5,
      status: Status.ACTIVE,
      transferDays: [],
    };

    transferWindowApi = {
      getTransferWindowById: vi.fn().mockReturnValue(of(transferWindow)),
      getCurrentTransferWindow: vi.fn().mockReturnValue(of(transferWindow)),
      getTransferWindowsBySeasonId: vi.fn().mockReturnValue(of([transferWindow])),
    };

    routerService = { navigateToTransferWindow: vi.fn() } as unknown as RouterService;
  });

  describe('API calls', () => {
    it('calls getTransferWindowById with the transferWindowId', async () => {
      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(transferWindowApi.getTransferWindowById).toHaveBeenCalledWith(transferWindow.id);
    });

    it('always calls getCurrentTransferWindow', async () => {
      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(transferWindowApi.getCurrentTransferWindow).toHaveBeenCalled();
    });

    it('calls getCurrentTransferWindow when no transferWindowId is provided', async () => {
      await render(TransfersPageComponent, { providers: makeProviders() });
      TestBed.tick();

      expect(transferWindowApi.getCurrentTransferWindow).toHaveBeenCalled();
    });

    it('does not call getTransferWindowById when no transferWindowId is provided', async () => {
      await render(TransfersPageComponent, { providers: makeProviders() });
      TestBed.tick();

      expect(transferWindowApi.getTransferWindowById).not.toHaveBeenCalled();
    });
  });

  describe('content', () => {
    it('renders deadlines section when transfer window is loaded', async () => {
      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(document.querySelector('app-deadlines-section')).toBeInTheDocument();
    });

    it('does not render deadlines section before transfer window loads', async () => {
      transferWindowApi.getCurrentTransferWindow = vi.fn().mockReturnValue(NEVER);
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(NEVER);

      await render(TransfersPageComponent, { providers: makeProviders() });
      TestBed.tick();

      expect(document.querySelector('app-deadlines-section')).not.toBeInTheDocument();
    });

    it('renders position count section when transfer window is not pending', async () => {
      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(document.querySelector('app-position-count-section')).toBeInTheDocument();
    });

    it('does not render position count section when transfer window is pending', async () => {
      transferWindowApi.getTransferWindowById = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, status: Status.PENDING }));

      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(document.querySelector('app-position-count-section')).not.toBeInTheDocument();
    });

    it('retains previous content while loading a new transfer window', async () => {
      const { fixture } = await render(TransfersPageComponent, {
        inputs: { transferWindowId: 1 },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(document.querySelector('app-deadlines-section')).toBeInTheDocument();

      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(NEVER);
      fixture.componentRef.setInput('transferWindowId', 2);
      TestBed.tick();

      expect(document.querySelector('app-deadlines-section')).toBeInTheDocument();
    });
  });

  describe('picker bar', () => {
    beforeEach(async () => {
      await render(TransfersPageComponent, { providers: makeProviders() });
      TestBed.tick();
    });

    it('renders a Live button', () => {
      expect(screen.getByRole('button', { name: /Live/i })).toBeInTheDocument();
    });

    it('renders the scroll picker when season is loaded', () => {
      expect(document.querySelector('app-transfer-window-scroll-picker')).toBeInTheDocument();
    });

    it('renders the picker button when season is loaded', () => {
      expect(document.querySelector('app-transfer-window-picker-button')).toBeInTheDocument();
    });
  });

  it('navigates to the current transfer window when Live button is clicked', async () => {
    const currentTransferWindowId = 99;
    const providers = [
      ...makeProviders().filter((p) => p.provide !== CurrentService),
      {
        provide: CurrentService,
        useValue: {
          transferWindow: signal<TransferWindowBase | undefined>({
            ...transferWindow,
            id: currentTransferWindowId,
          }),
          season: signal(undefined),
          rxCurrent: { isLoading: signal(false) },
        },
      },
    ];

    await render(TransfersPageComponent, { providers });
    TestBed.tick();

    await userEvent.click(screen.getByRole('button', { name: /Live/i }));

    expect(routerService.navigateToTransferWindow).toHaveBeenCalledWith(currentTransferWindowId);
  });

  it('navigates to a transfer window when one is selected from the scroll picker', async () => {
    await render(TransfersPageComponent, { providers: makeProviders() });
    TestBed.tick();

    await waitFor(() => {
      expect(document.querySelector(`[data-id="${transferWindow.id}"]`)).toBeInTheDocument();
    });

    (document.querySelector(`[data-id="${transferWindow.id}"]`) as HTMLElement).click();

    expect(routerService.navigateToTransferWindow).toHaveBeenCalledWith(transferWindow.id);
  });

  describe('with FINISHED transfer days', () => {
    let finishedTransferDay: TransferDay;

    beforeEach(async () => {
      finishedTransferDay = { ...fakeTransferDay(), id: 1, status: Status.FINISHED };
      const windowWithDays = {
        ...transferWindow,
        draft: false,
        transferDays: [finishedTransferDay],
      };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(windowWithDays));
      transferWindowApi.getCurrentTransferWindow = vi.fn().mockReturnValue(of(windowWithDays));

      await render(TransfersPageComponent, {
        inputs: { transferWindowId: windowWithDays.id },
        providers: makeProviders(),
      });
      TestBed.tick();
    });

    it('renders transfer day transfers section', () => {
      expect(document.querySelector('app-transfer-day-transfers-section')).toBeInTheDocument();
    });

    it('renders transfer day transfer listings section', () => {
      expect(
        document.querySelector('app-transfer-day-transfer-listings-section'),
      ).toBeInTheDocument();
    });
  });

  describe('with non-FINISHED transfer days', () => {
    beforeEach(async () => {
      const pendingDay = { ...fakeTransferDay(), id: 1, status: Status.PENDING };
      const windowWithPendingDay = { ...transferWindow, draft: false, transferDays: [pendingDay] };
      transferWindowApi.getTransferWindowById = vi.fn().mockReturnValue(of(windowWithPendingDay));
      transferWindowApi.getCurrentTransferWindow = vi
        .fn()
        .mockReturnValue(of(windowWithPendingDay));

      await render(TransfersPageComponent, {
        inputs: { transferWindowId: windowWithPendingDay.id },
        providers: makeProviders(),
      });
      TestBed.tick();
    });

    it('does not render transfer day transfers section', () => {
      expect(document.querySelector('app-transfer-day-transfers-section')).not.toBeInTheDocument();
    });
  });

  describe('page context', () => {
    it('registers title as transfer window number when not draft', async () => {
      transferWindowApi.getTransferWindowById = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, transferWindowNumber: 3, draft: false }));
      transferWindowApi.getCurrentTransferWindow = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, transferWindowNumber: 3, draft: false }));

      const providers = makeProviders();
      const pageContextService = providers.find((p) => p.provide === PageContextService)!
        .useValue as { setContext: ReturnType<typeof vi.fn> };

      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers,
      });
      TestBed.tick();

      const context = pageContextService.setContext.mock.calls[0][0];
      expect(context.title()).toBe('Transfer Window 3');
    });

    it('registers title as Draft when transfer window is a draft', async () => {
      transferWindowApi.getTransferWindowById = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, transferWindowNumber: 3, draft: true }));
      transferWindowApi.getCurrentTransferWindow = vi
        .fn()
        .mockReturnValue(of({ ...transferWindow, transferWindowNumber: 3, draft: true }));

      const providers = makeProviders();
      const pageContextService = providers.find((p) => p.provide === PageContextService)!
        .useValue as { setContext: ReturnType<typeof vi.fn> };

      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers,
      });
      TestBed.tick();

      const context = pageContextService.setContext.mock.calls[0][0];
      expect(context.title()).toBe('Draft');
    });

    it('registers subtitle as season name', async () => {
      const providers = makeProviders();
      const pageContextService = providers.find((p) => p.provide === PageContextService)!
        .useValue as { setContext: ReturnType<typeof vi.fn> };

      await render(TransfersPageComponent, {
        inputs: { transferWindowId: transferWindow.id },
        providers,
      });
      TestBed.tick();

      const context = pageContextService.setContext.mock.calls[0][0];
      expect(context.subtitle()).toBe(`Season ${transferWindow.matchWeek.season.name}`);
    });
  });
});
