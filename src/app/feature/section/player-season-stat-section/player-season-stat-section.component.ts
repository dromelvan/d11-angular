import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { SectionComponent } from '@app/shared/section/section.component';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';

@Component({
  selector: 'app-player-season-stat-section',
  templateUrl: './player-season-stat-section.component.html',
  imports: [SectionComponent, RatingPipe, FormMatchPointsComponent],
  host: { class: 'app-fill' },
})
export class PlayerSeasonStatSectionComponent {
  readonly playerSeasonStat = input.required<PlayerSeasonStat>();
}
