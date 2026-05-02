import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatchWeekMatchesComponent } from '@app/feature/page/match-week/match-week-matches/match-week-matches.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-match-week-matches-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, MatchWeekMatchesComponent],
  templateUrl: './match-week-matches-card.component.html',
})
export class MatchWeekMatchesCardComponent {
  matchWeekId = input.required<number>();
}
