import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Match, Status } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';

@Component({
  selector: 'app-match-hero',
  templateUrl: './match-hero.component.html',
  imports: [DatePipe, TeamImgComponent],
  host: { style: 'display: block' },
})
export class MatchHeroComponent {
  readonly match = input.required<Match>();

  protected readonly Status = Status;
}
