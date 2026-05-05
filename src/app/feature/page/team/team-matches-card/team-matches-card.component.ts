import { Component, input } from '@angular/core';
import { MatchBase, Season } from '@app/core/api';
import { MatchResultColComponent } from '@app/feature/page/match/match-result-col/match-result-col.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-matches-card',
  imports: [Card, MatchResultColComponent],
  templateUrl: './team-matches-card.component.html',
})
export class TeamMatchesCardComponent {
  matches = input.required<MatchBase[]>();
  season = input<Season | undefined>();
}
