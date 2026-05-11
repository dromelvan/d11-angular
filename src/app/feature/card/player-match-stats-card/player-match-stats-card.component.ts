import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { PlayerMatchStatsComponent } from '@app/feature/component/player-match-stats/player-match-stats.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-match-stats-card',
  imports: [Card, PlayerMatchStatsComponent],
  templateUrl: './player-match-stats-card.component.html',
})
export class PlayerMatchStatsCardComponent {
  playerSeasonStat = input.required<PlayerSeasonStat>();
}
