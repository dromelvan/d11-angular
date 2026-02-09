import { Component, Input } from '@angular/core';
import { ImgComponent } from '@app/shared/img/img.component';

@Component({
  selector: 'app-d11-lion-dark-img',
  imports: [ImgComponent],
  templateUrl: './d11-lion-dark-img.component.html',
})
export class D11LionDarkImgComponent {
  @Input() size!: number;
}
