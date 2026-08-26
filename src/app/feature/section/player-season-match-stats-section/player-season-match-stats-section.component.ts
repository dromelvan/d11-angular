import { Component, input } from '@angular/core';
import { PlayerSeasonMatchStatsAccordionComponent } from '@app/feature/accordion/player-season-match-stats-accordion/player-season-match-stats-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-player-season-match-stats-section',
  templateUrl: './player-season-match-stats-section.component.html',
  imports: [SectionComponent, PlayerSeasonMatchStatsAccordionComponent],
  host: { class: 'app-fill' },
})
export class PlayerSeasonMatchStatsSectionComponent {
  readonly playerId = input.required<number>();
  readonly seasonId = input.required<number>();
}
