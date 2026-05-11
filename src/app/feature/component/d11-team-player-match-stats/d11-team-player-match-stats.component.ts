import { Component, input, output } from '@angular/core';
import { D11TeamBase, PlayerMatchStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamBaseComponent } from '@app/shared/resource';

@Component({
  selector: 'app-d11-team-player-match-stats',
  imports: [RatingPipe, IconComponent, D11TeamBaseComponent],
  templateUrl: './d11-team-player-match-stats.component.html',
})
export class D11TeamPlayerMatchStatsComponent {
  d11Team = input.required<D11TeamBase>();
  stats = input.required<PlayerMatchStat[]>();
  statClick = output<PlayerMatchStat>();

  protected readonly Lineup = Lineup;
}
