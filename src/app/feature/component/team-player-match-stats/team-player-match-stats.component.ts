import { Component, input, output } from '@angular/core';
import { PlayerMatchStat } from '@app/core/api';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { Lineup } from '@app/core/api/model/lineup.model';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamBaseComponent } from '@app/shared/resource';

@Component({
  selector: 'app-team-player-match-stats',
  imports: [RatingPipe, IconComponent, TeamBaseComponent],
  templateUrl: './team-player-match-stats.component.html',
})
export class TeamPlayerMatchStatsComponent {
  team = input.required<TeamBase>();
  stats = input.required<PlayerMatchStat[]>();
  substituteIndex = input.required<number>();

  statClick = output<PlayerMatchStat>();

  protected readonly Lineup = Lineup;
}
