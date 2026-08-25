import { Component, input } from '@angular/core';
import { PlayerMatchStat, TeamBase } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { SectionComponent } from '@app/shared/section/section.component';
import { PlayerMatchStatsAccordionComponent } from '@app/feature/accordion/player-match-stats-accordion/player-match-stats-accordion.component';

@Component({
  selector: 'app-team-player-match-stats-section',
  templateUrl: './team-player-match-stats-section.component.html',
  imports: [SectionComponent, TeamImgComponent, PlayerMatchStatsAccordionComponent],
  host: { style: 'display: block' },
})
export class TeamPlayerMatchStatsSectionComponent {
  readonly team = input.required<TeamBase>();
  readonly playerMatchStats = input.required<PlayerMatchStat[]>();
}
