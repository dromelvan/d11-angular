import { inject, Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlayerMatchStat, PlayerSeasonStat } from '@app/core/api';
import { PlayerDialogMatchStatComponent } from '@app/feature/page/player/player-dialog-match-stat/player-dialog-match-stat.component';
import { PlayerDialogSeasonStatComponent } from '@app/feature/page/player/player-dialog-season-stat/player-dialog-season-stat.component';
import { PlayerDialogHeaderComponent } from '@app/feature/page/player/player-dialog-header/player-dialog-header.component';
import {
  DialogFooterAction,
  DynamicDialogFooterComponent,
} from '@app/shared/dialog/dynamic-dialog-footer/dynamic-dialog-footer.component';

@Injectable({
  providedIn: 'root',
})
export class DynamicDialogService {
  private dialogService = inject(DialogService);
  private dialogRef: DynamicDialogRef | null | undefined;

  private styleClass = 'w-full sm:w-[25rem] sm:max-h-[50rem]! mx-4! border-0! overflow-hidden';

  openPlayerMatchStat(
    playerMatchStat: PlayerMatchStat,
    playerMatchStats: PlayerMatchStat[],
    action: DialogFooterAction,
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
    action: DialogFooterAction,
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
}
