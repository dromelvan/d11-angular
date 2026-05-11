import { Component, input } from '@angular/core';
import { D11MatchBase, Season } from '@app/core/api';
import { D11TeamMatchesComponent } from '@app/feature/component/d11-team-matches/d11-team-matches.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-matches-card',
  imports: [Card, D11TeamMatchesComponent],
  templateUrl: './d11-team-matches-card.component.html',
})
export class D11TeamMatchesCardComponent {
  d11Matches = input.required<D11MatchBase[]>();
  season = input<Season | undefined>();
}
