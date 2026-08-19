import { Component, input } from '@angular/core';
import { D11TeamSeasonStatsAccordionComponent } from '@app/feature/component/d11-team-season-stats-accordion/d11-team-season-stats-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-d11-team-season-stats-section',
  templateUrl: './d11-team-season-stats-section.component.html',
  imports: [SectionComponent, D11TeamSeasonStatsAccordionComponent],
  host: { class: 'app-fill' },
})
export class D11TeamSeasonStatsSectionComponent {
  readonly seasonId = input.required<number>();
}
