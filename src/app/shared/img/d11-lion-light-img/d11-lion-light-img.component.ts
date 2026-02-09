import { Component, Input } from '@angular/core';
import { ImgComponent } from '@app/shared/img/img.component';

@Component({
  selector: 'app-d11-lion-light-img',
  imports: [ImgComponent],
  templateUrl: './d11-lion-light-img.component.html',
})
export class D11LionLightImgComponent {
  @Input() size!: number;
}
