import { Component, computed, inject } from '@angular/core';
import { Lineup, PlayerMatchStat } from '@app/core/api';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ImgWidth, TeamImgComponent } from '@app/shared/img';
import { DatePipe } from '@angular/common';
import { D11TeamBaseComponent } from '@app/shared/resource';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-player-match-stat-dialog',
  imports: [RatingPipe, TeamImgComponent, DatePipe, D11TeamBaseComponent, IconComponent],
  templateUrl: './player-dialog-match-stat.component.html',
})
export class PlayerDialogMatchStatComponent {
  protected playerMatchStat = computed<PlayerMatchStat>(() => this.config.data.current());
  protected minutesPlayed = computed<number>(() => {
    const playerMatchStat = this.playerMatchStat();
    const started = playerMatchStat.lineup === Lineup.STARTING_LINEUP;
    const played = started || playerMatchStat.substitutionOnTime > 0;

    if (!played) {
      return 0;
    }

    const startTime = started ? 0 : playerMatchStat.substitutionOnTime;
    const endTime =
      playerMatchStat.substitutionOffTime > 0 ? playerMatchStat.substitutionOffTime : 90;

    return endTime - startTime;
  });
  protected readonly Lineup = Lineup;
  protected readonly ImgWidth = ImgWidth;

  private config = inject(DynamicDialogConfig);
}
