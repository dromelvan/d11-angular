import { Component, computed, inject } from '@angular/core';
import { Lineup, PlayerMatchStat } from '@app/core/api';
import { minutesPlayed } from '@app/shared/util/player-match-stat.util';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ImgWidth } from '@app/shared/img';
import { D11TeamBaseComponent } from '@app/shared/resource';
import { IconComponent } from '@app/shared/icon/icon.component';
import { MatchHeaderComponent } from '@app/feature/component/match-header/match-header.component';

@Component({
  selector: 'app-player-match-stat-dialog',
  imports: [RatingPipe, D11TeamBaseComponent, IconComponent, MatchHeaderComponent],
  templateUrl: './player-match-stat.component.html',
})
export class PlayerMatchStatComponent {
  protected playerMatchStat = computed<PlayerMatchStat>(() => this.config.data.current());
  protected minutesPlayed = computed<number>(() => minutesPlayed(this.playerMatchStat()));
  protected readonly Lineup = Lineup;
  protected readonly ImgWidth = ImgWidth;

  private config = inject(DynamicDialogConfig);
}
