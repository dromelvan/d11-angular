import { Component, input } from '@angular/core';
import { MatchBase, Season } from '@app/core/api';
import { TeamMatchesComponent } from '@app/feature/component/team-matches/team-matches.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-matches-card',
  imports: [Card, TeamMatchesComponent],
  templateUrl: './team-matches-card.component.html',
})
export class TeamMatchesCardComponent {
  matches = input.required<MatchBase[]>();
  season = input<Season | undefined>();
}
