import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { render, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransferWindow, TransferWindowBase } from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { SafeDatePipe } from '@app/shared/pipes/safe-date.pipe';
import { fakeMatchWeekBase, fakeTransferWindow } from '@app/test';
import { TransferWindowScrollPickerComponent } from './transfer-window-scroll-picker.component';

let transferWindow: TransferWindow;
let currentTransferWindow: TransferWindow;
let transferWindowApi: { getTransferWindowsBySeasonId: ReturnType<typeof vi.fn> };
let mockCurrentService: {
  transferWindow: ReturnType<typeof signal<TransferWindowBase | undefined>>;
  rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
};

function makeProviders() {
  return [
    { provide: TransferWindowApiService, useValue: transferWindowApi },
    { provide: CurrentService, useValue: mockCurrentService },
    { provide: LoadingService, useValue: { register: vi.fn() } },
  ];
}

describe('TransferWindowScrollPickerComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    transferWindow = fakeTransferWindow();
    currentTransferWindow = fakeTransferWindow();

    transferWindowApi = {
      getTransferWindowsBySeasonId: vi
        .fn()
        .mockReturnValue(of([transferWindow, currentTransferWindow])),
    };

    mockCurrentService = {
      transferWindow: signal<TransferWindowBase | undefined>(currentTransferWindow),
      rxCurrent: { isLoading: signal(false) },
    };
  });

  describe('API calls', () => {
    it('calls getTransferWindowsBySeasonId with the season id', async () => {
      await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(transferWindowApi.getTransferWindowsBySeasonId).toHaveBeenCalledWith(
        transferWindow.season.id,
      );
    });

    it('calls getTransferWindowsBySeasonId again when seasonId input changes', async () => {
      const { fixture } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      const newSeasonId = transferWindow.season.id + 1;
      fixture.componentRef.setInput('seasonId', newSeasonId);
      TestBed.tick();

      expect(transferWindowApi.getTransferWindowsBySeasonId).toHaveBeenCalledWith(newSeasonId);
    });
  });

  describe('rendering', () => {
    let container: HTMLElement;

    beforeEach(async () => {
      transferWindow = { ...transferWindow, draft: false };
      transferWindowApi.getTransferWindowsBySeasonId.mockReturnValue(
        of([transferWindow, currentTransferWindow]),
      );
      ({ container } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      }));
      TestBed.tick();
    });

    it('renders a scroll picker item for each transfer window', () => {
      expect(container.querySelector(`[data-id="${transferWindow.id}"]`)).toBeInTheDocument();
    });

    it('renders the transfer window number label in the scroll picker', () => {
      expect(container.textContent).toContain(`TW ${transferWindow.transferWindowNumber}`);
    });

    it('renders the transfer window date in the scroll picker', () => {
      const expected = new SafeDatePipe().transform(transferWindow.datetime, 'd MMM');
      expect(container.textContent).toContain(expected);
    });

    it('applies border-white to the current transfer window button', () => {
      const button = container.querySelector(`[data-id="${currentTransferWindow.id}"]`);
      expect(button?.classList).toContain('border-white');
    });

    it('defaults to the current transfer window as selected when transferWindowId is not provided', () => {
      const currentButton = container.querySelector(`[data-id="${currentTransferWindow.id}"]`);
      const otherButton = container.querySelector(`[data-id="${transferWindow.id}"]`);
      // The live/current window shows border-white; bg-primary-300 applies only when selected && !current
      expect(currentButton?.classList).toContain('border-white');
      expect(otherButton?.classList).not.toContain('bg-primary-300');
    });
  });

  describe('with no transfer windows', () => {
    it('does not render the scroll picker', async () => {
      transferWindowApi.getTransferWindowsBySeasonId.mockReturnValue(of([]));

      const { container } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(container.querySelector('app-scroll-picker')).not.toBeInTheDocument();
    });
  });

  describe('with draft transfer window', () => {
    it('renders Draft label', async () => {
      const draftTransferWindow = { ...transferWindow, draft: true };
      transferWindowApi.getTransferWindowsBySeasonId.mockReturnValue(of([draftTransferWindow]));

      const { container } = await render(TransferWindowScrollPickerComponent, {
        inputs: {
          seasonId: draftTransferWindow.season.id,
          transferWindowId: draftTransferWindow.id,
        },
        providers: makeProviders(),
      });
      TestBed.tick();

      expect(container.textContent).toContain('Draft');
    });
  });

  describe('with transferWindowId provided', () => {
    it('selects the transfer window matching transferWindowId', async () => {
      const { container } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id, transferWindowId: transferWindow.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      const selectedButton = container.querySelector(`[data-id="${transferWindow.id}"]`);
      const otherButton = container.querySelector(`[data-id="${currentTransferWindow.id}"]`);
      expect(selectedButton?.classList).toContain('bg-primary-300');
      expect(otherButton?.classList).not.toContain('bg-primary-300');
    });
  });

  describe('when current transfer window is outside the season', () => {
    it('defaults to the first transfer window', async () => {
      const outsideTransferWindow = { ...fakeTransferWindow(), id: 99999 };
      mockCurrentService.transferWindow.set(outsideTransferWindow);

      const { container, fixture } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      fixture.componentInstance.transferWindowSelected.subscribe(() => {});
      TestBed.tick();

      const firstButton = container.querySelector(`[data-id="${transferWindow.id}"]`);
      expect(firstButton?.classList).toContain('bg-primary-300');
    });
  });

  describe('click emission', () => {
    it('emits the full transfer window when a scroll picker item is clicked', async () => {
      const { fixture, container } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      const emitted: TransferWindow[] = [];
      fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

      (container.querySelector(`[data-id="${transferWindow.id}"]`) as HTMLElement).click();

      expect(emitted).toEqual([transferWindow]);
    });
  });

  describe('initial load emission', () => {
    it('emits the current transfer window on initial load', async () => {
      const { fixture } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });

      const emitted: TransferWindow[] = [];
      fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));
      TestBed.tick();

      expect(emitted).toEqual([currentTransferWindow]);
    });

    it('re-emits the default transfer window when seasonId changes', async () => {
      const { fixture } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      const newSeasonId = transferWindow.season.id + 1;
      const newSeason = { ...transferWindow.season, id: newSeasonId };
      const newTransferWindow = {
        ...fakeTransferWindow(),
        season: newSeason,
        matchWeek: { ...fakeMatchWeekBase(), season: newSeason },
      };
      const currentTransferWindowInNewSeason = {
        ...currentTransferWindow,
        season: newSeason,
        matchWeek: { ...currentTransferWindow.matchWeek, season: newSeason },
      };
      transferWindowApi.getTransferWindowsBySeasonId.mockReturnValue(
        of([newTransferWindow, currentTransferWindowInNewSeason]),
      );

      const emitted: TransferWindow[] = [];
      fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

      fixture.componentRef.setInput('seasonId', newSeasonId);

      await waitFor(() => {
        TestBed.tick();
        expect(emitted.length).toBe(1);
      });
      expect(emitted[0].id).toBe(currentTransferWindow.id);
    });

    it('does not emit when loaded transfer windows belong to a different season', async () => {
      const { fixture } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      const emitted: TransferWindow[] = [];
      fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

      fixture.componentRef.setInput('seasonId', transferWindow.season.id + 99);
      TestBed.tick();

      expect(emitted).toEqual([]);
    });

    it('does not emit when transferWindowId is set but not found in the current season', async () => {
      const { fixture } = await render(TransferWindowScrollPickerComponent, {
        inputs: { seasonId: transferWindow.season.id },
        providers: makeProviders(),
      });
      TestBed.tick();

      const newSeasonId = transferWindow.season.id + 1;
      const newSeason = { ...transferWindow.season, id: newSeasonId };
      const newTransferWindow = {
        ...fakeTransferWindow(),
        season: newSeason,
        matchWeek: { ...fakeMatchWeekBase(), season: newSeason },
      };
      const currentTransferWindowInNewSeason = {
        ...currentTransferWindow,
        season: newSeason,
        matchWeek: { ...currentTransferWindow.matchWeek, season: newSeason },
      };
      transferWindowApi.getTransferWindowsBySeasonId.mockReturnValue(
        of([newTransferWindow, currentTransferWindowInNewSeason]),
      );

      const emitted: TransferWindow[] = [];
      fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

      fixture.componentRef.setInput('transferWindowId', transferWindow.id);
      fixture.componentRef.setInput('seasonId', newSeasonId);
      TestBed.tick();

      expect(emitted).toEqual([]);
    });
  });
});
