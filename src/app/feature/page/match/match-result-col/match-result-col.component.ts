import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatchBase, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { SafeDatePipe } from '@app/shared/pipes';

@Component({
  selector: 'app-match-result-col',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TeamImgComponent, SafeDatePipe],
  templateUrl: './match-result-col.component.html',
  host: {
    class: 'col-span-4 grid grid-cols-subgrid grid-rows-2 cursor-pointer',
    '[class.app-grid-separator]': '!isLast()',
    '(click)': 'onClick()',
  },
})
export class MatchResultColComponent {
  match = input.required<MatchBase>();
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
    this.routerService.navigateToMatch(this.match().id);
  }
}
