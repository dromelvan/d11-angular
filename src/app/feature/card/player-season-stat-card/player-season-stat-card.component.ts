import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { Card } from 'primeng/card';
import { PlayerStatSummaryComponent } from '@app/feature/component/player-stat-summary/player-stat-summary.component';

@Component({
  selector: 'app-player-season-stat-card',
  imports: [Card, PlayerStatSummaryComponent],
  templateUrl: './player-season-stat-card.component.html',
})
export class PlayerSeasonStatCardComponent {
  playerSeasonStat = input.required<PlayerSeasonStat>();
  showInfo = input(false);
}
