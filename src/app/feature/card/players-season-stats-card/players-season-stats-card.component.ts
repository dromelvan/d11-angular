import { Component, input } from '@angular/core';
import { PlayersSeasonStatsComponent } from '@app/feature/component/players-season-stats/players-season-stats.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-players-season-stats-card',
  imports: [Card, PlayersSeasonStatsComponent],
  templateUrl: './players-season-stats-card.component.html',
})
export class PlayersSeasonStatsCardComponent {
  seasonId = input.required<number>();
}
