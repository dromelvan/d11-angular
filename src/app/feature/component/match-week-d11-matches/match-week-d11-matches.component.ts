import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { D11MatchBase, Status } from '@app/core/api';
import { D11MatchResultColComponent } from '@app/feature/component/d11-match-result-col/d11-match-result-col.component';
import { SafeDatePipe } from '@app/shared/pipes';

@Component({
  selector: 'app-match-week-d11-matches',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [D11MatchResultColComponent, SafeDatePipe, TitleCasePipe],
  templateUrl: './match-week-d11-matches.component.html',
})
export class MatchWeekD11MatchesComponent {
  readonly groups = input.required<{ date: string; matches: D11MatchBase[] }[]>();

  protected readonly Status = Status;
}
