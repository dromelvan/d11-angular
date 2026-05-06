import { Component, input, output } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-season-history-card',
  imports: [Card],
  templateUrl: './d11-team-season-history-card.component.html',
})
export class D11TeamSeasonHistoryCardComponent {
  d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();
  currentSeasonId = input<number | undefined>();

  seasonSelected = output<D11TeamSeasonStat>();
}
