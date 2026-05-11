import { Component, input, output } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonHistoryComponent } from '@app/feature/component/team-season-history/team-season-history.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-season-history-card',
  imports: [Card, TeamSeasonHistoryComponent],
  templateUrl: './team-season-history-card.component.html',
})
export class TeamSeasonHistoryCardComponent {
  teamSeasonStats = input.required<TeamSeasonStat[]>();
  currentSeasonId = input<number | undefined>();

  seasonSelected = output<TeamSeasonStat>();
}
