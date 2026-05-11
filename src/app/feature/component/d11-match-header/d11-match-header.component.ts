import { Component, input } from '@angular/core';
import { D11MatchBase, Status } from '@app/core/api';
import { DatePipe, NgClass } from '@angular/common';
import { ImgWidth } from '@app/shared/img/img-width';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-d11-match-header',
  imports: [D11TeamImgComponent, IconComponent, DatePipe, NgClass],
  templateUrl: './d11-match-header.component.html',
})
export class D11MatchHeaderComponent {
  match = input<D11MatchBase | undefined>();
  emphasised = input<boolean>(true);
  links = input<boolean>(true);

  protected readonly Status = Status;
  protected readonly ImgWidth = ImgWidth;
}
