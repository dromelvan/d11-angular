import { Component, input } from '@angular/core';
import { MatchBase } from '@app/core/api';
import { MatchResultColComponent } from '@app/feature/component/match-result-col/match-result-col.component';

@Component({
  selector: 'app-team-matches',
  imports: [MatchResultColComponent],
  templateUrl: './team-matches.component.html',
})
export class TeamMatchesComponent {
  matches = input.required<MatchBase[]>();
}
