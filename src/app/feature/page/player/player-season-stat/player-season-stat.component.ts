import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PlayerStatSummary } from '@app/shared/model';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { FeePipe } from '@app/shared/pipes';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { D11TeamBaseComponent, TeamBaseComponent } from '@app/shared/resource';

@Component({
  selector: 'app-player-season-stat',
  imports: [
    FeePipe,
    RatingPipe,
    DecimalPipe,
    TeamBaseComponent,
    D11TeamBaseComponent,
    FormMatchPointsComponent,
  ],
  templateUrl: './player-season-stat.component.html',
})
export class PlayerSeasonStatComponent {
  playerSeasonStat = input.required<PlayerStatSummary>();
  showInfo = input(false);
}
