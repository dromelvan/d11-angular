import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatchWeekD11MatchesComponent } from '@app/feature/component/match-week-d11-matches/match-week-d11-matches.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-match-week-d11-matches-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, MatchWeekD11MatchesComponent],
  templateUrl: './match-week-d11-matches-section.component.html',
  host: { class: 'app-fill' },
})
export class MatchWeekD11MatchesSectionComponent {
  matchWeekId = input<number>();
}
