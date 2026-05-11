import { inject, Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlayerMatchStat, PlayerSeasonStat, Transfer, TransferListing } from '@app/core/api';
import { PlayerMatchStatComponent } from '@app/feature/component/player-match-stat/player-match-stat.component';
import { PlayerSeasonStatComponent } from '@app/feature/component/player-season-stat/player-season-stat.component';
import { TransferBidsComponent } from '@app/feature/component/transfer-bids/transfer-bids.component';
import { TransferListingComponent } from '@app/feature/component/transfer-listing/transfer-listing.component';
import { PlayerDialogHeaderComponent } from '@app/shared/dialog/player-dialog-header/player-dialog-header.component';
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

    this.dialogRef = this.dialogService.open(PlayerMatchStatComponent, {
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

    this.dialogRef = this.dialogService.open(PlayerSeasonStatComponent, {
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

    this.dialogRef = this.dialogService.open(TransferBidsComponent, {
      modal: true,
      styleClass: this.styleClass,
      closable: true,
      templates: {
        header: PlayerDialogHeaderComponent,
        footer: DynamicDialogFooterComponent,
      },
      data: {
        current,
        list: transfers,
        action,
        teamSelector: (transfer: Transfer) => transfer.transferListing.team,
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

    this.dialogRef = this.dialogService.open(TransferListingComponent, {
      modal: true,
      styleClass: this.styleClass,
      closable: true,
      templates: {
        header: PlayerDialogHeaderComponent,
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
