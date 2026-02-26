import { Component, input } from '@angular/core';
import { MatchBase, TeamBase } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-match-base',
  imports: [TeamImgComponent],
  templateUrl: './match-base.component.html',
})
export class MatchBaseComponent {
  match = input.required<MatchBase>();
  team = input<TeamBase | undefined>();
}
