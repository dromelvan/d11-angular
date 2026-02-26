import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { FeePipe } from '@app/shared/pipes';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-season-summary-card',
  imports: [Card, FeePipe],
  templateUrl: './player-season-summary-card.component.html',
})
export class PlayerSeasonSummaryCardComponent {
  playerSeasonStat = input.required<PlayerSeasonStat | undefined>();
}
