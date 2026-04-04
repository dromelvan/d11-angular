import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { Card } from 'primeng/card';
import { PlayerSeasonStatComponent } from '../player-season-stat/player-season-stat.component';

@Component({
  selector: 'app-player-season-stat-card',
  imports: [Card, PlayerSeasonStatComponent],
  templateUrl: './player-season-stat-card.component.html',
})
export class PlayerSeasonStatCardComponent {
  playerSeasonStat = input.required<PlayerSeasonStat>();
  showInfo = input(false);
}
