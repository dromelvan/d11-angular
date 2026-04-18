import { inject, Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlayerMatchStat, PlayerSeasonStat, Transfer, TransferListing } from '@app/core/api';
import { PlayerDialogMatchStatComponent } from '@app/feature/page/player/player-dialog-match-stat/player-dialog-match-stat.component';
import { PlayerDialogSeasonStatComponent } from '@app/feature/page/player/player-dialog-season-stat/player-dialog-season-stat.component';
import { PlayerDialogHeaderComponent } from '@app/feature/page/player/player-dialog-header/player-dialog-header.component';
import { TransferBidsDialogComponent } from '@app/feature/page/transfers/transfer-bids-dialog/transfer-bids-dialog.component';
import { TransferBidsDialogHeaderComponent } from '@app/feature/page/transfers/transfer-bids-dialog/transfer-bids-dialog-header/transfer-bids-dialog-header.component';
import { TransferListingDialogComponent } from '@app/feature/page/transfers/transfer-listing-dialog/transfer-listing-dialog.component';
import { TransferListingDialogHeaderComponent } from '@app/feature/page/transfers/transfer-listing-dialog/transfer-listing-dialog-header/transfer-listing-dialog-header.component';
import {
  DialogFooterAction,
  DynamicDialogFooterComponent,
} from '@app/shared/dialog/dynamic-dialog-footer/dynamic-dialog-footer.component';

@Injectable({
  providedIn: 'root',
})
export class DynamicDialogService {
  private dialogService = inject(DialogService);
  private dialogRef: DynamicDialogRef | null = null;

  private styleClass = 'w-full sm:w-[25rem] sm:max-h-[50rem]! mx-4! border-0! overflow-hidden';

  openPlayerMatchStat(
    playerMatchStat: PlayerMatchStat,
    playerMatchStats: PlayerMatchStat[],
    action: DialogFooterAction<PlayerMatchStat>,
  ): void {
    this.dialogRef?.close();
    const current = signal<PlayerMatchStat>(playerMatchStat);

    this.dialogRef = this.dialogService.open(PlayerDialogMatchStatComponent, {
      modal: true,
      styleClass: this.styleClass,
      closable: true,
      templates: {
        header: PlayerDialogHeaderComponent,
        footer: DynamicDialogFooterComponent,
      },
      data: {
        player: playerMatchStat.player,
        current: current,
        list: playerMatchStats,
        action,
      },
    });
  }

  openPlayerSeasonStat(
    playerSeasonStat: PlayerSeasonStat,
    playerSeasonStats: PlayerSeasonStat[],
    action: DialogFooterAction<PlayerSeasonStat>,
  ): void {
    this.dialogRef?.close();
    const current = signal<PlayerSeasonStat>(playerSeasonStat);

    this.dialogRef = this.dialogService.open(PlayerDialogSeasonStatComponent, {
      modal: true,
      styleClass: this.styleClass,
      closable: true,
      templates: {
        header: PlayerDialogHeaderComponent,
        footer: DynamicDialogFooterComponent,
      },
      data: {
        player: playerSeasonStat.player,
        current: current,
        list: playerSeasonStats,
        action,
      },
    });
  }

  openTransfer(
    transfer: Transfer,
    transfers: Transfer[],
    action: DialogFooterAction<Transfer>,
  ): void {
    this.dialogRef?.close();
    const current = signal<Transfer>(transfer);

    this.dialogRef = this.dialogService.open(TransferBidsDialogComponent, {
      modal: true,
      styleClass: this.styleClass,
      closable: true,
      templates: {
        header: TransferBidsDialogHeaderComponent,
        footer: DynamicDialogFooterComponent,
      },
      data: {
        current,
        list: transfers,
        action,
      },
    });
  }

  openTransferListing(
    transferListing: TransferListing,
    transferListings: TransferListing[],
    action: DialogFooterAction<TransferListing>,
  ): void {
    this.dialogRef?.close();
    const current = signal<TransferListing>(transferListing);

    this.dialogRef = this.dialogService.open(TransferListingDialogComponent, {
      modal: true,
      styleClass: this.styleClass,
      closable: true,
      templates: {
        header: TransferListingDialogHeaderComponent,
        footer: DynamicDialogFooterComponent,
      },
      data: {
        current,
        list: transferListings,
        action,
      },
    });
  }
}
