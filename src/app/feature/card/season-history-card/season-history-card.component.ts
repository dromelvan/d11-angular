import { Component, input } from '@angular/core';
import { SeasonWinners } from '@app/core/api';
import { SeasonHistoryComponent } from '@app/feature/component/season-history/season-history.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-history-season-card',
  imports: [Card, SeasonHistoryComponent],
  templateUrl: './season-history-card.component.html',
})
export class SeasonHistoryCardComponent {
  seasonWinners = input.required<SeasonWinners>();
}
