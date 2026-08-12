import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatchBase, Status } from '@app/core/api';
import { SafeDatePipe } from '@app/shared/pipes';
import { MatchResultColComponent } from '@app/feature/component/match-result-col/match-result-col.component';

@Component({
  selector: 'app-match-week-matches',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchResultColComponent, SafeDatePipe, TitleCasePipe],
  templateUrl: './match-week-matches.component.html',
})
export class MatchWeekMatchesComponent {
  readonly groups = input.required<{ date: string; matches: MatchBase[] }[]>();

  protected readonly Status = Status;
}
