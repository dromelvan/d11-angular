import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { FeePipe } from '@app/shared/pipes';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-season-stat-card',
  imports: [Card, FeePipe],
  templateUrl: './player-season-stat-card.component.html',
})
export class PlayerSeasonStatCardComponent {
  playerSeasonStat = input.required<PlayerSeasonStat | undefined>();
}
