import { Component, input } from '@angular/core';
import { D11TeamBase } from '@app/core/api';
import { D11TeamImgComponent } from '@app/shared/img';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-d11-team-base',
  imports: [D11TeamImgComponent, NgClass],
  templateUrl: './d11-team-base.component.html',
})
export class D11TeamBaseComponent {
  d11Team = input.required<D11TeamBase>();
  justify = input<'start' | 'center' | 'end'>();
  imgWidth = input<string>();
}
