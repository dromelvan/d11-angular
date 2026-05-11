import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { PlayerSeasonStatsComponent } from '@app/feature/component/player-season-stats/player-season-stats.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-career-card',
  imports: [Card, PlayerSeasonStatsComponent],
  templateUrl: './player-career-card.component.html',
})
export class PlayerCareerCardComponent {
  playerSeasonStats = input.required<PlayerSeasonStat[]>();
}
