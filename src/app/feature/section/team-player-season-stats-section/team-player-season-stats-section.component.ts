import { Component, input } from '@angular/core';
import { TeamPlayerSeasonStatsAccordionComponent } from '@app/feature/accordion/team-player-season-stats-accordion/team-player-season-stats-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-team-player-season-stats-section',
  templateUrl: './team-player-season-stats-section.component.html',
  imports: [SectionComponent, TeamPlayerSeasonStatsAccordionComponent],
  host: { class: 'app-fill' },
})
export class TeamPlayerSeasonStatsSectionComponent {
  readonly teamId = input.required<number>();
  readonly seasonId = input<number>();
}
