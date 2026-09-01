import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11MatchBase, D11TeamApiService } from '@app/core/api';
import { D11MatchResultColComponent } from '@app/feature/component/d11-match-result-col/d11-match-result-col.component';
import { SectionComponent } from '@app/shared/section/section.component';
import { of } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-d11-team-season-matches-section',
  templateUrl: './d11-team-season-matches-section.component.html',
  imports: [SectionComponent, D11MatchResultColComponent, ProgressSpinner],
  host: { class: 'app-fill' },
})
export class D11TeamSeasonMatchesSectionComponent {
  readonly d11TeamId = input.required<number>();
  readonly seasonId = input<number>();

  protected readonly rxD11Matches = rxResource<
    D11MatchBase[],
    { d11TeamId: number; seasonId: number } | undefined
  >({
    params: () => {
      const seasonId = this.seasonId();
      const d11TeamId = this.d11TeamId();
      if (seasonId == null) return undefined;
      return { d11TeamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.d11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId(
        params.d11TeamId,
        params.seasonId,
      );
    },
  });

  protected readonly isLoading = computed(() => this.rxD11Matches.isLoading());
  protected readonly d11Matches = computed(() => this.rxD11Matches.value() ?? []);

  private readonly d11TeamApiService = inject(D11TeamApiService);
}
