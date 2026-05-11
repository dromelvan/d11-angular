import { Component, computed, inject } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlayerStatSummaryComponent } from '@app/feature/component/player-stat-summary/player-stat-summary.component';

@Component({
  selector: 'app-player-dialog-season-stat',
  imports: [PlayerStatSummaryComponent],
  templateUrl: './player-season-stat.component.html',
})
export class PlayerSeasonStatComponent {
  protected playerSeasonStat = computed<PlayerSeasonStat>(() => this.config.data.current());

  private config = inject(DynamicDialogConfig);
}
