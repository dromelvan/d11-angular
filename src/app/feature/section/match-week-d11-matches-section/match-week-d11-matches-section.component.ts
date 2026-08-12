import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11MatchBase, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { MatchWeekD11MatchesComponent } from '@app/feature/component/match-week-d11-matches/match-week-d11-matches.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-match-week-d11-matches-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, MatchWeekD11MatchesComponent],
  templateUrl: './match-week-d11-matches-section.component.html',
  host: { style: 'display: block' },
})
export class MatchWeekD11MatchesSectionComponent {
  matchWeekId = input<number>();

  protected groupedMatches = computed(() => {
    const sorted = [...(this.rxMatches.value() ?? [])].sort((a, b) => {
      const compare = a.datetime.localeCompare(b.datetime);
      return compare !== 0 ? compare : a.id - b.id;
    });
    const groups: { date: string; matches: D11MatchBase[] }[] = [];
    const postponed: D11MatchBase[] = [];

    for (const d11Match of sorted) {
      if (d11Match.status === Status.POSTPONED) {
        postponed.push(d11Match);
        continue;
      }
      const date = d11Match.datetime.slice(0, 10);
      let group = groups.at(-1);
      if (group?.date !== date) {
        group = { date, matches: [] };
        groups.push(group);
      }
      group.matches.push(d11Match);
    }

    if (postponed.length > 0) {
      groups.push({ date: Status.POSTPONED, matches: postponed });
    }

    return groups;
  });

  private rxMatches = rxResource<D11MatchBase[], { matchWeekId: number | undefined }>({
    params: () => ({ matchWeekId: this.matchWeekId() }),
    stream: ({ params }) =>
      params.matchWeekId !== undefined
        ? this.d11MatchApiService.getD11MatchesByMatchWeekId(params.matchWeekId)
        : this.d11MatchApiService.getActiveD11Matches(),
  });

  private d11MatchApiService = inject(D11MatchApiService);
}
