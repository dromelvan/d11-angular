import { Component, input, output } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';

@Component({
  selector: 'app-team-season-history',
  imports: [],
  templateUrl: './team-season-history.component.html',
})
export class TeamSeasonHistoryComponent {
  teamSeasonStats = input.required<TeamSeasonStat[]>();
  currentSeasonId = input<number | undefined>();

  seasonSelected = output<TeamSeasonStat>();
}
