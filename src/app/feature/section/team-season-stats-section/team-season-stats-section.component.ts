import { Component, input } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonStatsAccordionComponent } from '@app/feature/component/team-season-stats-accordion/team-season-stats-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-team-season-stats-section',
  templateUrl: './team-season-stats-section.component.html',
  imports: [SectionComponent, TeamSeasonStatsAccordionComponent],
  host: { style: 'display: block' },
})
export class TeamSeasonStatsSectionComponent {
  readonly teamSeasonStats = input.required<TeamSeasonStat[]>();
}
