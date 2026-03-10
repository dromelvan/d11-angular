import { inject, Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlayerMatchStat } from '@app/core/api';
import { PlayerDialogMatchStatComponent } from '@app/feature/page/player/player-dialog-match-stat/player-dialog-match-stat.component';
import { PlayerDialogHeaderComponent } from '@app/feature/page/player/player-dialog-header/player-dialog-header.component';
import { DynamicDialogFooterComponent } from '@app/shared/dialog/dynamic-dialog-footer/dynamic-dialog-footer.component';

@Injectable({
  providedIn: 'root',
})
export class DynamicDialogService {
  private dialogService = inject(DialogService);
  private dialogRef: DynamicDialogRef | null | undefined;

  openPlayerMatchStat(playerMatchStat: PlayerMatchStat, playerMatchStats: PlayerMatchStat[]): void {
    this.dialogRef?.close();
    const current = signal<PlayerMatchStat>(playerMatchStat);

    this.dialogRef = this.dialogService.open(PlayerDialogMatchStatComponent, {
      modal: true,
      styleClass: 'w-full sm:w-[25rem] sm:max-h-[50rem]! mx-4! border-0! overflow-hidden',
      closable: true,
      templates: {
        header: PlayerDialogHeaderComponent,
        footer: DynamicDialogFooterComponent,
      },
      data: {
        player: playerMatchStat.player,
        current: current,
        list: playerMatchStats,
        action: {
          label: 'Match Details',
          icon: 'calendar',
          onClick: () => console.log(`TODO: Match ${playerMatchStat.match.id}`),
        },
      },
    });
  }
}
