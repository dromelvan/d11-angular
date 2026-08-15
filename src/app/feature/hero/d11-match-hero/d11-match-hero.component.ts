import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { D11Match, Status } from '@app/core/api';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';

@Component({
  selector: 'app-d11-match-hero',
  templateUrl: './d11-match-hero.component.html',
  imports: [DatePipe, D11TeamImgComponent],
  host: { style: 'display: block' },
})
export class D11MatchHeroComponent {
  readonly match = input.required<D11Match>();

  protected readonly Status = Status;
}
