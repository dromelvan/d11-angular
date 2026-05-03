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
  match = input.required<D11MatchBase>();
  isLast = input<boolean>(false);

  protected readonly Status = Status;

  protected model = computed(() => {
    const match = this.match();
    const homeDiff = match.homeTeamGoalsScored - match.previousHomeTeamGoalsScored;
    const awayDiff = match.awayTeamGoalsScored - match.previousAwayTeamGoalsScored;
    return {
      match,
      homeDiff,
      awayDiff,
      showElapsed: [Status.ACTIVE, Status.FULL_TIME, Status.FINISHED].includes(match.status),
      showGoals: match.status !== Status.PENDING && match.status !== Status.POSTPONED,
    };
  });

  private routerService = inject(RouterService);

  protected onClick(): void {
    this.routerService.navigateToD11Match(this.match().id);
  }
}
