import { Component, input } from '@angular/core';
import { TeamBase } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-team',
  imports: [TeamImgComponent],
  templateUrl: './team-base.component.html',
})
export class TeamBaseComponent {
  team = input.required<TeamBase>();
}
