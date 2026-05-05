import { Component, input, output } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-season-history-card',
  imports: [Card],
  templateUrl: './team-season-history-card.component.html',
})
export class TeamSeasonHistoryCardComponent {
  teamSeasonStats = input.required<TeamSeasonStat[]>();
  currentSeasonId = input<number | undefined>();

  seasonSelected = output<TeamSeasonStat>();
}
