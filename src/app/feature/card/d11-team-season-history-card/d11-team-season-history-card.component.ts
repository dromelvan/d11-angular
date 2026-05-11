import { Component, input, output } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonHistoryComponent } from '@app/feature/component/d11-team-season-history/d11-team-season-history.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-season-history-card',
  imports: [Card, D11TeamSeasonHistoryComponent],
  templateUrl: './d11-team-season-history-card.component.html',
})
export class D11TeamSeasonHistoryCardComponent {
  d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();
  currentSeasonId = input<number | undefined>();

  seasonSelected = output<D11TeamSeasonStat>();
}
