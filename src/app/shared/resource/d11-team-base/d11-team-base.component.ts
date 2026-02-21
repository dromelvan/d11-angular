import { Component, input } from '@angular/core';
import { D11TeamBase } from '@app/core/api';
import { D11TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-d11-team',
  imports: [D11TeamImgComponent],
  templateUrl: './d11-team-base.component.html',
})
export class D11TeamBaseComponent {
  d11Team = input.required<D11TeamBase>();
}
