import { Component, computed, inject, input } from '@angular/core';
import { MatchBase, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { SafeDatePipe } from '@app/shared/pipes';
import { MatchBaseComponent } from '@app/shared/resource/match-base/match-base.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-match-week-matches-card',
  imports: [Card, MatchBaseComponent, SafeDatePipe],
  templateUrl: './match-week-matches-card.component.html',
})
export class MatchWeekMatchesCardComponent {
  matches = input.required<MatchBase[]>();

  protected readonly Status = Status;

  protected groupedMatches = computed(() => {
    const sorted = [...this.matches()].sort((a, b) => {
      const compare = a.datetime.localeCompare(b.datetime);
      return compare !== 0 ? compare : a.id - b.id;
    });
    const groups: { date: string; matches: MatchBase[] }[] = [];
    const postponed: MatchBase[] = [];

    for (const match of sorted) {
      if (match.status === Status.POSTPONED) {
        postponed.push(match);
        continue;
      }
      const date = match.datetime.slice(0, 10);
      let group = groups.at(-1);
      if (group?.date !== date) {
        group = { date, matches: [] };
        groups.push(group);
      }
      group.matches.push(match);
    }

    if (postponed.length > 0) {
      groups.push({ date: 'Postponed', matches: postponed });
    }

    return groups;
  });

  private routerService = inject(RouterService);

  protected onClick(matchId: number): void {
    this.routerService.navigateToMatch(matchId);
  }
}
