import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Transfer, TransferApiService, TransferBid, TransferBidApiService } from '@app/core/api';
import { fakeD11TeamBase, fakePlayerBase, fakeTransfer, fakeTransferDay } from '@app/test';
import { TransferDayTransfersSectionComponent } from './transfer-day-transfers-section.component';

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

describe('TransferDayTransfersSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([]));
    mockTransferBidApi.getTransferBidsByTransferDayId.mockReturnValue(of([]));
  });

  it('renders transfer day number in the section header', async () => {
    const transferDay = { ...fakeTransferDay(), transferDayNumber: 3 };

    await render(TransferDayTransfersSectionComponent, {
      inputs: { transferDay },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Transfer Day 3');
  });

  it('renders formatted date in the section header', async () => {
    const transferDay = { ...fakeTransferDay(), datetime: '2016-02-06T00:00:00' };

    await render(TransferDayTransfersSectionComponent, {
      inputs: { transferDay },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Feb 6, 2016');
  });

  it('passes transferDay id to the accordion', async () => {
    const transferDay = { ...fakeTransferDay(), id: 42 };

    await render(TransferDayTransfersSectionComponent, {
      inputs: { transferDay },
      providers,
    });
    TestBed.tick();

    expect(mockTransferApi.getTransfersByTransferDayId).toHaveBeenCalledWith(42);
  });

  it('passes draft to the accordion and sorts when draft is true', async () => {
    const transfer1 = {
      ...fakeTransfer(),
      player: { ...fakePlayerBase(), name: 'Player1' },
      d11Team: { ...fakeD11TeamBase(), name: 'Zebra FC' },
    };
    const transfer2 = {
      ...fakeTransfer(),
      player: { ...fakePlayerBase(), name: 'Player2' },
      d11Team: { ...fakeD11TeamBase(), name: 'Alpha FC' },
    };
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer1, transfer2]));

    const { container } = await render(TransferDayTransfersSectionComponent, {
      inputs: { transferDay: fakeTransferDay(), draft: true },
      providers,
    });
    TestBed.tick();

    const names = [...container.querySelectorAll('.app-text-base.truncate')].map((el) =>
      el.textContent?.trim(),
    );
    expect(names).toEqual(['Player2', 'Player1']);
  });

  it('renders player name from transfers', async () => {
    const transfer = { ...fakeTransfer(), player: { ...fakePlayerBase(), name: 'Player1' } };
    mockTransferApi.getTransfersByTransferDayId.mockReturnValue(of([transfer]));

    await render(TransferDayTransfersSectionComponent, {
      inputs: { transferDay: fakeTransferDay() },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Player1')).toBeInTheDocument();
  });
});
