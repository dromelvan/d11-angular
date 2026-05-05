import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import type { Team, TeamSeasonStat } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-header-card',
  imports: [Card, NgClass, TeamImgComponent],
  templateUrl: './team-header-card.component.html',
})
export class TeamHeaderCardComponent {
  team = input.required<Team | undefined>();
  teamSeasonStat = input.required<TeamSeasonStat | undefined>();

  protected backgroundColor = computed(() =>
    this.team() && !this.team()?.dummy ? this.team()?.colour : PRIMARY,
  );

  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));
}
