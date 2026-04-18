import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogService } from './dynamic-dialog.service';
import {
  fakePlayerMatchStat,
  fakePlayerSeasonStat,
  fakeTransfer,
  fakeTransferListing,
} from '@app/test';
import { PlayerDialogMatchStatComponent } from '@app/feature/page/player/player-dialog-match-stat/player-dialog-match-stat.component';
import { PlayerDialogSeasonStatComponent } from '@app/feature/page/player/player-dialog-season-stat/player-dialog-season-stat.component';
import { TransferBidsDialogComponent } from '@app/feature/page/transfers/transfer-bids-dialog/transfer-bids-dialog.component';
import { TransferListingDialogComponent } from '@app/feature/page/transfers/transfer-listing-dialog/transfer-listing-dialog.component';
import { DialogFooterAction } from '@app/shared/dialog/dynamic-dialog-footer/dynamic-dialog-footer.component';

function buildDialogService() {
  return { open: vi.fn().mockReturnValue({ close: vi.fn() }) };
}

function fakeAction(): DialogFooterAction {
  return {
    label: 'Test',
    icon: 'test' as const,
    onClick: vi.fn(),
  };
}

describe('DynamicDialogService', () => {
  let service: DynamicDialogService;
  let dialogService: ReturnType<typeof buildDialogService>;

  beforeEach(() => {
    dialogService = buildDialogService();
    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: dialogService }],
    });
    service = TestBed.inject(DynamicDialogService);
  });

  describe('openPlayerMatchStat', () => {
    it('opens the player match stat dialog component', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat], fakeAction());

      expect(dialogService.open).toHaveBeenCalledWith(
        PlayerDialogMatchStatComponent,
        expect.objectContaining({ modal: true }),
      );
    });

    it('sets data.current as a signal pointing to the passed stat', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat], fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.current()).toBe(stat);
    });

    it('sets data.list to the provided playerMatchStats array', () => {
      const stats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
      service.openPlayerMatchStat(stats[0], stats, fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.list).toBe(stats);
    });

    it('sets data.action to the provided action', () => {
      const stat = fakePlayerMatchStat();
      const action = fakeAction();
      service.openPlayerMatchStat(stat, [stat], action);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action).toBe(action);
    });

    it('closes the previous dialog before opening a new one', () => {
      const stats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
      service.openPlayerMatchStat(stats[0], stats, fakeAction());

      const firstRef = dialogService.open.mock.results[0].value;
      service.openPlayerMatchStat(stats[1], stats, fakeAction());

      expect(firstRef.close).toHaveBeenCalled();
      expect(dialogService.open).toHaveBeenCalledTimes(2);
    });
  });

  describe('openPlayerSeasonStat', () => {
    it('opens the player season stat dialog component', () => {
      const stat = fakePlayerSeasonStat();
      service.openPlayerSeasonStat(stat, [stat], fakeAction());

      expect(dialogService.open).toHaveBeenCalledWith(
        PlayerDialogSeasonStatComponent,
        expect.objectContaining({ modal: true }),
      );
    });

    it('sets data.current as a signal pointing to the passed stat', () => {
      const stat = fakePlayerSeasonStat();
      service.openPlayerSeasonStat(stat, [stat], fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.current()).toBe(stat);
    });

    it('sets data.list to the provided playerSeasonStats array', () => {
      const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
      service.openPlayerSeasonStat(stats[0], stats, fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.list).toBe(stats);
    });

    it('sets data.action to the provided action', () => {
      const stat = fakePlayerSeasonStat();
      const action = fakeAction();
      service.openPlayerSeasonStat(stat, [stat], action);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action).toBe(action);
    });

    it('closes the previous dialog before opening a new one', () => {
      const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
      service.openPlayerSeasonStat(stats[0], stats, fakeAction());

      const firstRef = dialogService.open.mock.results[0].value;
      service.openPlayerSeasonStat(stats[1], stats, fakeAction());

      expect(firstRef.close).toHaveBeenCalled();
      expect(dialogService.open).toHaveBeenCalledTimes(2);
    });
  });

  describe('openTransfer', () => {
    it('opens the transfer bids dialog component', () => {
      const transfer = fakeTransfer();
      service.openTransfer(transfer, [transfer], fakeAction());

      expect(dialogService.open).toHaveBeenCalledWith(
        TransferBidsDialogComponent,
        expect.objectContaining({ modal: true }),
      );
    });

    it('sets data.current as a signal pointing to the passed transfer', () => {
      const transfer = fakeTransfer();
      service.openTransfer(transfer, [transfer], fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.current()).toBe(transfer);
    });

    it('sets data.list to the provided transfers array', () => {
      const transfers = [fakeTransfer(), fakeTransfer()];
      service.openTransfer(transfers[0], transfers, fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.list).toBe(transfers);
    });

    it('sets data.action to the provided action', () => {
      const transfer = fakeTransfer();
      const action = fakeAction();
      service.openTransfer(transfer, [transfer], action);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action).toBe(action);
    });

    it('closes the previous dialog before opening a new one', () => {
      const transfers = [fakeTransfer(), fakeTransfer()];
      service.openTransfer(transfers[0], transfers, fakeAction());

      const firstRef = dialogService.open.mock.results[0].value;
      service.openTransfer(transfers[1], transfers, fakeAction());

      expect(firstRef.close).toHaveBeenCalled();
      expect(dialogService.open).toHaveBeenCalledTimes(2);
    });
  });

  describe('openTransferListing', () => {
    it('opens the transfer listing dialog component', () => {
      const transferListing = fakeTransferListing();
      service.openTransferListing(transferListing, [transferListing], fakeAction());

      expect(dialogService.open).toHaveBeenCalledWith(
        TransferListingDialogComponent,
        expect.objectContaining({ modal: true }),
      );
    });

    it('sets data.current as a signal pointing to the passed transfer listing', () => {
      const transferListing = fakeTransferListing();
      service.openTransferListing(transferListing, [transferListing], fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.current()).toBe(transferListing);
    });

    it('sets data.list to the provided transferListings array', () => {
      const transferListings = [fakeTransferListing(), fakeTransferListing()];
      service.openTransferListing(transferListings[0], transferListings, fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.list).toBe(transferListings);
    });

    it('sets data.action to the provided action', () => {
      const transferListing = fakeTransferListing();
      const action = fakeAction();
      service.openTransferListing(transferListing, [transferListing], action);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action).toBe(action);
    });

    it('closes the previous dialog before opening a new one', () => {
      const transferListings = [fakeTransferListing(), fakeTransferListing()];
      service.openTransferListing(transferListings[0], transferListings, fakeAction());

      const firstRef = dialogService.open.mock.results[0].value;
      service.openTransferListing(transferListings[1], transferListings, fakeAction());

      expect(firstRef.close).toHaveBeenCalled();
      expect(dialogService.open).toHaveBeenCalledTimes(2);
    });
  });
});
