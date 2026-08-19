import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatchWeekMatchesComponent } from '@app/feature/component/match-week-matches/match-week-matches.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-match-week-matches-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, MatchWeekMatchesComponent],
  templateUrl: './match-week-matches-section.component.html',
  host: { class: 'app-fill' },
})
export class MatchWeekMatchesSectionComponent {
  matchWeekId = input<number>();
}
