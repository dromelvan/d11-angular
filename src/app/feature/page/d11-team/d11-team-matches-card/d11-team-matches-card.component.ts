import { Component, input } from '@angular/core';
import { D11MatchBase, Season } from '@app/core/api';
import { D11MatchResultColComponent } from '@app/feature/page/match/d11-match-result-col/d11-match-result-col.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-matches-card',
  imports: [Card, D11MatchResultColComponent],
  templateUrl: './d11-team-matches-card.component.html',
})
export class D11TeamMatchesCardComponent {
  d11Matches = input.required<D11MatchBase[]>();
  season = input<Season | undefined>();
}
