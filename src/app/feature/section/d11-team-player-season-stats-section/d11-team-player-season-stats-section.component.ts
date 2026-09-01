import { Component, input } from '@angular/core';
import { D11TeamPlayerSeasonStatsAccordionComponent } from '@app/feature/accordion/d11-team-player-season-stats-accordion/d11-team-player-season-stats-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-d11-team-player-season-stats-section',
  templateUrl: './d11-team-player-season-stats-section.component.html',
  imports: [SectionComponent, D11TeamPlayerSeasonStatsAccordionComponent],
  host: { class: 'app-fill' },
})
export class D11TeamPlayerSeasonStatsSectionComponent {
  readonly d11TeamId = input.required<number>();
  readonly seasonId = input<number>();
}
