import { Component, input } from '@angular/core';
import { D11TeamBase, PlayerMatchStat } from '@app/core/api';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { SectionComponent } from '@app/shared/section/section.component';
import { PlayerMatchStatsAccordionComponent } from '@app/feature/component/player-match-stats-accordion/player-match-stats-accordion.component';

@Component({
  selector: 'app-d11-team-player-match-stats-section',
  templateUrl: './d11-team-player-match-stats-section.component.html',
  imports: [SectionComponent, D11TeamImgComponent, PlayerMatchStatsAccordionComponent],
  host: { style: 'display: block' },
})
export class D11TeamPlayerMatchStatsSectionComponent {
  readonly d11Team = input.required<D11TeamBase>();
  readonly playerMatchStats = input.required<PlayerMatchStat[]>();
}
