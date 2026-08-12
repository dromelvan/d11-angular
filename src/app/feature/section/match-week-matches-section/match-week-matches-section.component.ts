import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchBase, Status } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { SectionComponent } from '@app/shared/section/section.component';
import { MatchWeekMatchesComponent } from '@app/feature/component/match-week-matches/match-week-matches.component';

@Component({
  selector: 'app-match-week-matches-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, MatchWeekMatchesComponent],
  templateUrl: './match-week-matches-section.component.html',
  host: { style: 'display: block' },
})
export class MatchWeekMatchesSectionComponent {
  matchWeekId = input<number>();

  protected groupedMatches = computed(() => {
    const sorted = [...(this.rxMatches.value() ?? [])].sort((a, b) => {
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
      groups.push({ date: Status.POSTPONED, matches: postponed });
    }

    return groups;
  });

  private rxMatches = rxResource<MatchBase[], { matchWeekId: number | undefined }>({
    params: () => ({ matchWeekId: this.matchWeekId() }),
    stream: ({ params }) =>
      params.matchWeekId !== undefined
        ? this.matchApiService.getMatchesByMatchWeekId(params.matchWeekId)
        : this.matchApiService.getActiveMatches(),
  });

  private matchApiService = inject(MatchApiService);
}
