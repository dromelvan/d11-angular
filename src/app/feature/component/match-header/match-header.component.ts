import { Component, input } from '@angular/core';
import { MatchBase, Status } from '@app/core/api';
import { DatePipe, NgClass } from '@angular/common';
import { ImgWidth, TeamImgComponent } from '@app/shared/img';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-match-header',
  imports: [TeamImgComponent, IconComponent, DatePipe, NgClass],
  templateUrl: './match-header.component.html',
})
export class MatchHeaderComponent {
  match = input<MatchBase | undefined>();
  emphasised = input<boolean>(true);
  links = input<boolean>(true);

  protected readonly Status = Status;
  protected readonly ImgWidth = ImgWidth;
}
