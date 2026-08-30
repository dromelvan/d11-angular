import { Component, input } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-team-season-stat-section',
  templateUrl: './team-season-stat-section.component.html',
  imports: [SectionComponent, FormMatchPointsComponent],
})
export class TeamSeasonStatSectionComponent {
  readonly teamSeasonStat = input.required<TeamSeasonStat>();
}
