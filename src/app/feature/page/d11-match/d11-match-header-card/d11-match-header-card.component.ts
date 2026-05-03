import { Component, input } from '@angular/core';
import { D11Match } from '@app/core/api';
import { Card } from 'primeng/card';
import { D11MatchHeaderComponent } from '@app/feature/page/d11-match/d11-match-header/d11-match-header.component';

@Component({
  selector: 'app-d11-match-header-card',
  imports: [Card, D11MatchHeaderComponent],
  templateUrl: './d11-match-header-card.component.html',
})
export class D11MatchHeaderCardComponent {
  match = input<D11Match | undefined>();
}
