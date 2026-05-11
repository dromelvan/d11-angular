import { Component, input, output } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';

@Component({
  selector: 'app-d11-team-season-history',
  imports: [],
  templateUrl: './d11-team-season-history.component.html',
})
export class D11TeamSeasonHistoryComponent {
  d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();
  currentSeasonId = input<number | undefined>();

  seasonSelected = output<D11TeamSeasonStat>();
}
