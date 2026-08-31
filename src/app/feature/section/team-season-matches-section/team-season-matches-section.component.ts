import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchBase } from '@app/core/api';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import { MatchResultColComponent } from '@app/feature/component/match-result-col/match-result-col.component';
import { SectionComponent } from '@app/shared/section/section.component';
import { of } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-team-season-matches-section',
  templateUrl: './team-season-matches-section.component.html',
  imports: [SectionComponent, MatchResultColComponent, ProgressSpinner],
  host: { class: 'app-fill' },
})
export class TeamSeasonMatchesSectionComponent {
  readonly teamId = input.required<number>();
  readonly seasonId = input<number>();

  protected readonly rxMatches = rxResource<
    MatchBase[],
    { teamId: number; seasonId: number } | undefined
  >({
    params: () => {
      const seasonId = this.seasonId();
      const teamId = this.teamId();
      if (seasonId == null) return undefined;
      return { teamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.teamApiService.getMatchesByTeamIdAndSeasonId(params.teamId, params.seasonId);
    },
  });

  protected readonly isLoading = computed(() => this.rxMatches.isLoading());
  protected readonly matches = computed(() => this.rxMatches.value() ?? []);

  private readonly teamApiService = inject(TeamApiService);
}
