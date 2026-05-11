import { Component, input } from '@angular/core';
import type { Team, TeamSeasonStat } from '@app/core/api';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-team-header',
  imports: [TeamImgComponent, FormMatchPointsComponent],
  templateUrl: './team-header.component.html',
})
export class TeamHeaderComponent {
  team = input.required<Team>();
  teamSeasonStat = input.required<TeamSeasonStat | undefined>();
}
