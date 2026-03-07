import { Component, input } from '@angular/core';
import { TeamBase } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-team-base',
  imports: [TeamImgComponent, NgClass],
  templateUrl: './team-base.component.html',
})
export class TeamBaseComponent {
  team = input.required<TeamBase>();
  justify = input<'start' | 'center' | 'end'>();
  imgWidth = input<string>();
}
