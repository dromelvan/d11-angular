import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Transfer, TransferApiService, TransferBid, TransferBidApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import {
  fakeD11TeamBase,
  fakePlayerBase,
  fakePosition,
  fakeTeamBase,
  fakeTransfer,
  fakeTransferBid,
  fakeTransferListingBase,
} from '@app/test';
import { provideRouter } from '@angular/router';
import { TransferDayTransfersAccordionComponent } from './transfer-day-transfers-accordion.component';

const fakeTransferFixture = (overrides: Partial<Transfer> = {}): Transfer => ({
  ...fakeTransfer(),
  ...overrides,
});

const fakeBidFixture = (overrides: Partial<TransferBid> = {}): TransferBid => ({
  ...fakeTransferBid(),
  successful: false,
  activeFee: 10,
  ...overrides,
});

const mockTransferApi = {
  getTransfersByTransferDayId: vi.fn<(id: number) => Observable<Transfer[]>>(),
};

const mockTransferBidApi = {
  getTransferBidsByTransferDayId: vi.fn<(id: number) => Observable<TransferBid[]>>(),
};

const providers = [
  { provide: TransferApiService, useValue: mockTransferApi },
  { provide: TransferBidApiService, useValue: mockTransferBidApi },
];

describe('TransferDayTransfersAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([]));
    mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([]));
  });

  it('calls the transfers API with the provided transferDayId', async () => {
    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 5 },
      providers,
    });
    TestBed.tick();

    expect(mockTransferApi.getTransfersByTransferDayId).toHaveBeenCalledWith(5);
  });

  it('calls the transfer bids API with the provided transferDayId', async () => {
    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 5 },
      providers,
    });
    TestBed.tick();

    expect(mockTransferBidApi.getTransferBidsByTransferDayId).toHaveBeenCalledWith(5);
  });

  it('shows spinner while transfers are loading', async () => {
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(NEVER);

    const { container } = await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
  });

  it('shows spinner while transfer bids are loading', async () => {
    mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(NEVER);

    const { container } = await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
  });

  it('hides spinner when both resources have loaded', async () => {
    const { container } = await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
  });

  it('shows "No transfers" message when transfers list is empty', async () => {
    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('No transfers')).toBeInTheDocument();
  });

  it('does not show "No transfers" message when transfers are present', async () => {
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([fakeTransferFixture()]));

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.queryByText('No transfers')).not.toBeInTheDocument();
  });

  it('does not show "No transfers" message while loading', async () => {
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(NEVER);

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.queryByText('No transfers')).not.toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('D11 Team / Fee')).toBeInTheDocument();
  });

  it('renders player names in accordion header', async () => {
    const transfer1 = fakeTransferFixture({ player: { ...fakePlayerBase(), name: 'Player1' } });
    const transfer2 = fakeTransferFixture({ player: { ...fakePlayerBase(), name: 'Player2' } });
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer1, transfer2]));

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
  });

  it('renders ranking in accordion header subtitle', async () => {
    const transfer = fakeTransferFixture({
      transferListing: { ...fakeTransferListingBase(), ranking: 7 },
    });
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText(/#7/)).toBeInTheDocument();
  });

  it('renders position and team short name in accordion header', async () => {
    const transfer = fakeTransferFixture({
      transferListing: {
        ...fakeTransferListingBase(),
        position: { ...fakePosition(), name: 'Midfielder' },
        team: { ...fakeTeamBase(), shortName: 'MCI' },
      },
    });
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText(/Midfielder - MCI/)).toBeInTheDocument();
  });

  it('renders D11 team name in accordion header', async () => {
    const transfer = fakeTransferFixture({
      d11Team: { ...fakeD11TeamBase(), name: 'Team1' },
    });
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Team1')).toBeInTheDocument();
  });

  it('renders fee in accordion header', async () => {
    const transfer = fakeTransferFixture({ fee: 25 });
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));

    await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('2.5m')).toBeInTheDocument();
  });

  it('renders separators between transfers', async () => {
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(
      of([fakeTransferFixture(), fakeTransferFixture(), fakeTransferFixture()]),
    );

    const { container } = await render(TransferDayTransfersAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelectorAll('.app-separator').length).toBe(2);
  });

  describe('sorting', () => {
    it('does not sort transfers when draft is false', async () => {
      const transfer1 = fakeTransferFixture({
        player: { ...fakePlayerBase(), name: 'Player1' },
        d11Team: { ...fakeD11TeamBase(), name: 'Zebra FC' },
      });
      const transfer2 = fakeTransferFixture({
        player: { ...fakePlayerBase(), name: 'Player2' },
        d11Team: { ...fakeD11TeamBase(), name: 'Alpha FC' },
      });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer1, transfer2]));

      const { container } = await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1, draft: false },
        providers,
      });
      TestBed.tick();

      const names = [...container.querySelectorAll('.app-text-base.truncate')].map((el) =>
        el.textContent?.trim(),
      );
      expect(names).toEqual(['Player1', 'Player2']);
    });

    it('sorts transfers by D11 team name when draft is true', async () => {
      const transfer1 = fakeTransferFixture({
        player: { ...fakePlayerBase(), name: 'Player1' },
        d11Team: { ...fakeD11TeamBase(), name: 'Zebra FC' },
      });
      const transfer2 = fakeTransferFixture({
        player: { ...fakePlayerBase(), name: 'Player2' },
        d11Team: { ...fakeD11TeamBase(), name: 'Alpha FC' },
      });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer1, transfer2]));

      const { container } = await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1, draft: true },
        providers,
      });
      TestBed.tick();

      const names = [...container.querySelectorAll('.app-text-base.truncate')].map((el) =>
        el.textContent?.trim(),
      );
      expect(names).toEqual(['Player2', 'Player1']);
    });

    it('sorts transfers by position sortOrder as secondary sort when draft is true', async () => {
      const d11Team = fakeD11TeamBase();
      const transfer1 = fakeTransferFixture({
        player: { ...fakePlayerBase(), name: 'Player1' },
        d11Team,
        transferListing: {
          ...fakeTransferListingBase(),
          position: { ...fakePosition(), sortOrder: 2 },
        },
      });
      const transfer2 = fakeTransferFixture({
        player: { ...fakePlayerBase(), name: 'Player2' },
        d11Team,
        transferListing: {
          ...fakeTransferListingBase(),
          position: { ...fakePosition(), sortOrder: 1 },
        },
      });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer1, transfer2]));

      const { container } = await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1, draft: true },
        providers,
      });
      TestBed.tick();

      const names = [...container.querySelectorAll('.app-text-base.truncate')].map((el) =>
        el.textContent?.trim(),
      );
      expect(names).toEqual(['Player2', 'Player1']);
    });
  });

  describe('accordion content', () => {
    it('renders bid grid headers', async () => {
      const player = fakePlayerBase();
      const transfer = fakeTransferFixture({ player });
      const bid = fakeBidFixture({ player });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('D11 Team')).toBeInTheDocument();
      expect(screen.getByText('Bid')).toBeInTheDocument();
      expect(screen.getByText('Fee')).toBeInTheDocument();
    });

    it('renders bids for the matching player', async () => {
      const player = fakePlayerBase();
      const transfer = fakeTransferFixture({ player });
      const bid = fakeBidFixture({ player, fee: 30, activeFee: 25 });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getAllByText('3.0m').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2.5m').length).toBeGreaterThan(0);
    });

    it('does not render bids for a different player', async () => {
      const transfer = fakeTransferFixture({ player: { ...fakePlayerBase(), id: 1 } });
      const bid = fakeBidFixture({
        player: { ...fakePlayerBase(), id: 2 },
        fee: 40,
        activeFee: 40,
      });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('4.0m')).not.toBeInTheDocument();
    });

    it('renders D11 team name in bid row', async () => {
      const player = fakePlayerBase();
      const transfer = fakeTransferFixture({ player });
      const bid = fakeBidFixture({ player, d11Team: { ...fakeD11TeamBase(), name: 'Team1' } });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getAllByText('Team1').length).toBeGreaterThan(0);
    });

    it('renders check icon for successful bid', async () => {
      const player = fakePlayerBase();
      const transfer = fakeTransferFixture({ player });
      const bid = fakeBidFixture({ player, successful: true });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      const { container } = await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('app-icon')).toBeInTheDocument();
    });

    it('applies line-through when activeFee is 0', async () => {
      const player = fakePlayerBase();
      const transfer = fakeTransferFixture({ player });
      const bid = fakeBidFixture({ player, activeFee: 0 });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      const { container } = await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('.line-through')).toBeInTheDocument();
    });

    it('renders Player profile button', async () => {
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([fakeTransferFixture()]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers: [...providers, provideRouter([])],
      });
      TestBed.tick();

      expect(screen.getByText('Player profile')).toBeInTheDocument();
    });

    it('applies mt-4 to Player profile button when draft is false', async () => {
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([fakeTransferFixture()]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1, draft: false },
        providers: [...providers, provideRouter([])],
      });
      TestBed.tick();

      const button = screen.getByText('Player profile').closest('button');
      expect(button?.classList).toContain('mt-4');
    });

    it('applies mt-1 not mt-4 to Player profile button when draft is true', async () => {
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([fakeTransferFixture()]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1, draft: true },
        providers: [...providers, provideRouter([])],
      });
      TestBed.tick();

      const button = screen.getByText('Player profile').closest('button');
      expect(button?.classList).not.toContain('mt-4');
    });

    it('navigates to player when Player profile button is clicked', async () => {
      const routerService = { navigateToPlayer: vi.fn() };
      const transfer = fakeTransferFixture();
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers: [
          ...providers,
          provideRouter([]),
          { provide: RouterService, useValue: routerService },
        ],
      });
      TestBed.tick();

      await userEvent.click(screen.getByText('Player profile'));

      expect(routerService.navigateToPlayer).toHaveBeenCalledWith(transfer.player.id);
    });

    it('hides the bid grid when draft is true', async () => {
      const player = fakePlayerBase();
      const transfer = fakeTransferFixture({ player });
      const bid = fakeBidFixture({ player });
      mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));
      mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([bid]));

      await render(TransferDayTransfersAccordionComponent, {
        inputs: { transferDayId: 1, draft: true },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('D11 Team')).not.toBeInTheDocument();
      expect(screen.queryByText('Bid')).not.toBeInTheDocument();
      expect(screen.queryByText('Fee')).not.toBeInTheDocument();
    });
  });
});
