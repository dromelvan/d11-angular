import { Component, input } from '@angular/core';
import { TeamSeasonStatsAccordionComponent } from '@app/feature/accordion/team-season-stats-accordion/team-season-stats-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-team-season-stats-section',
  templateUrl: './team-season-stats-section.component.html',
  imports: [SectionComponent, TeamSeasonStatsAccordionComponent],
  host: { class: 'app-fill' },
})
export class TeamSeasonStatsSectionComponent {
  readonly seasonId = input.required<number>();
}
