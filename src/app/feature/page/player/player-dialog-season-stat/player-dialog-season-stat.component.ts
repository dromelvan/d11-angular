import { Component, computed, inject } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlayerSeasonStatComponent } from '@app/feature/page/player/player-season-stat/player-season-stat.component';

@Component({
  selector: 'app-player-dialog-season-stat',
  imports: [PlayerSeasonStatComponent],
  templateUrl: './player-dialog-season-stat.component.html',
})
export class PlayerDialogSeasonStatComponent {
  protected playerSeasonStat = computed<PlayerSeasonStat>(() => this.config.data.current());

  private config = inject(DynamicDialogConfig);
}
