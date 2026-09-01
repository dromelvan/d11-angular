import { Component, input } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-d11-team-season-stat-section',
  templateUrl: './d11-team-season-stat-section.component.html',
  imports: [SectionComponent, FormMatchPointsComponent],
})
export class D11TeamSeasonStatSectionComponent {
  readonly d11TeamSeasonStat = input.required<D11TeamSeasonStat>();
}
