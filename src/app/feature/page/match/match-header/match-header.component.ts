import { Component, input } from '@angular/core';
import { Match, type Stadium, Status } from '@app/core/api';
import { DatePipe } from '@angular/common';
import { TeamImgComponent } from '@app/shared/img';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-match-header',
  imports: [TeamImgComponent, IconComponent, DatePipe],
  templateUrl: './match-header.component.html',
})
export class MatchHeaderComponent {
  match = input<Match | undefined>();
  stadium = input<Stadium | undefined>();
  links = input<boolean>(true);

  protected readonly Status = Status;
}
