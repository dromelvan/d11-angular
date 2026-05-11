import { Component, input } from '@angular/core';
import { D11MatchBase } from '@app/core/api';
import { D11MatchResultColComponent } from '@app/feature/component/d11-match-result-col/d11-match-result-col.component';

@Component({
  selector: 'app-d11-team-matches',
  imports: [D11MatchResultColComponent],
  templateUrl: './d11-team-matches.component.html',
})
export class D11TeamMatchesComponent {
  d11Matches = input.required<D11MatchBase[]>();
}
