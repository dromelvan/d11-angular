import { NgClass } from '@angular/common';
import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { MatchWeek, SeasonBase } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { MatchWeekD11MatchesComponent } from '@app/feature/page/match-week/match-week-d11-matches/match-week-d11-matches.component';
import { MatchWeekMatchesComponent } from '@app/feature/page/match-week/match-week-matches/match-week-matches.component';
import { MatchWeekPickerButtonComponent } from '@app/feature/page/matches/match-week-picker-button/match-week-picker-button.component';
import { MatchWeekScrollPickerComponent } from '@app/feature/page/matches/match-week-scroll-picker/match-week-scroll-picker.component';
import { SeasonPickerComponent } from '@app/shared/season-picker/season-picker.component';

@Component({
  selector: 'app-matches-page',
  imports: [
    SeasonPickerComponent,
    MatchWeekScrollPickerComponent,
    MatchWeekPickerButtonComponent,
    MatchWeekMatchesComponent,
    MatchWeekD11MatchesComponent,
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

  private routerService = inject(RouterService);

  protected onSeasonSelected(seasonBase: SeasonBase): void {
    this.season.set(seasonBase);
  }

  protected onMatchWeekSelected(matchWeek: MatchWeek): void {
    this.routerService.navigateToMatchWeekMatches(matchWeek.id);
    this.active.set(false);
  }
}
