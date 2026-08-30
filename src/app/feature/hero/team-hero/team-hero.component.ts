import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Team, TeamSeasonStat } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-team-hero',
  templateUrl: './team-hero.component.html',
  imports: [TeamImgComponent, DecimalPipe],
})
export class TeamHeroComponent {
  readonly team = input.required<Team>();
  readonly teamSeasonStat = input<TeamSeasonStat>();
}
