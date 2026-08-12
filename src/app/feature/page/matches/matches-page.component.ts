import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchWeek, SeasonBase } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { MatchWeekD11MatchesSectionComponent } from '@app/feature/section/match-week-d11-matches-section/match-week-d11-matches-section.component';
import { MatchWeekMatchesSectionComponent } from '@app/feature/section/match-week-matches-section/match-week-matches-section.component';
import { MatchWeekPickerButtonComponent } from '@app/feature/component/match-week-picker-button/match-week-picker-button.component';
import { MatchWeekScrollPickerComponent } from '@app/feature/component/match-week-scroll-picker/match-week-scroll-picker.component';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-matches-page',
  imports: [
    MatchWeekScrollPickerComponent,
    MatchWeekPickerButtonComponent,
    MatchWeekMatchesSectionComponent,
    MatchWeekD11MatchesSectionComponent,
    NgClass,
  ],
  templateUrl: './matches-page.component.html',
})
export class MatchesPageComponent {
  readonly matchWeekId = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  });

  protected season = signal<SeasonBase | undefined>(undefined);
  protected active = signal(false);

  private rxMatchWeek = rxResource<MatchWeek, number | undefined>({
    params: () => this.matchWeekId(),
    stream: ({ params }) => (params != null ? this.matchWeekApiService.getById(params) : EMPTY),
  });

  private lastMatchWeek = signal<MatchWeek | undefined>(undefined);

  private currentService = inject(CurrentService);
  private matchWeekApiService = inject(MatchWeekApiService);
  private pageContextService = inject(PageContextService);
  private routerService = inject(RouterService);

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => {
      const matchWeek = this.rxMatchWeek.value();
      if (matchWeek) {
        this.lastMatchWeek.set(matchWeek);
        this.season.set(matchWeek.season);
      } else if (!this.season()) {
        const currentSeason = this.currentService.season();
        if (currentSeason) this.season.set(currentSeason);
      }
    });

    this.pageContextService.register(destroyRef, {
      title: computed(() => {
        if (this.active()) return 'Live Matches';
        const number =
          this.lastMatchWeek()?.matchWeekNumber ?? this.currentService.matchWeek()?.matchWeekNumber;
        return number !== undefined ? `Match Week ${number}` : undefined;
      }),
      subtitle: computed(() => {
        const name =
          this.lastMatchWeek()?.season.name ?? this.currentService.matchWeek()?.season.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }

  protected onSeasonSelected(seasonBase: SeasonBase): void {
    this.season.set(seasonBase);
  }

  protected onMatchWeekSelected(matchWeek: MatchWeek): void {
    this.routerService.navigateToMatchWeekMatches(matchWeek.id);
    this.active.set(false);
  }
}
