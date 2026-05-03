import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { D11MatchBase, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { SafeDatePipe } from '@app/shared/pipes';

@Component({
  selector: 'app-d11-match-result-col',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, D11TeamImgComponent, SafeDatePipe],
  templateUrl: './d11-match-result-col.component.html',
  host: {
    class: 'col-span-5 grid grid-cols-subgrid grid-rows-2 cursor-pointer',
    '[class.app-grid-separator]': '!isLast()',
    '(click)': 'onClick()',
  },
})
export class D11MatchResultColComponent {
  d11Match = input.required<D11MatchBase>();
  isLast = input<boolean>(false);

  protected readonly Status = Status;

  protected model = computed(() => {
    const d11Match = this.d11Match();
    const homeDiff = d11Match.homeTeamGoalsScored - d11Match.previousHomeTeamGoalsScored;
    const awayDiff = d11Match.awayTeamGoalsScored - d11Match.previousAwayTeamGoalsScored;
    return {
      d11Match: d11Match,
      homeDiff,
      awayDiff,
      showElapsed: [Status.ACTIVE, Status.FULL_TIME, Status.FINISHED].includes(d11Match.status),
      showGoals: d11Match.status !== Status.PENDING && d11Match.status !== Status.POSTPONED,
    };
  });

  private routerService = inject(RouterService);

  protected onClick(): void {
    this.routerService.navigateToD11Match(this.d11Match().id);
  }
}
