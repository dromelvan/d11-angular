import { Component, input } from '@angular/core';
import { D11TeamBase, D11TeamSeasonStat } from '@app/core/api';
import { D11TeamImgComponent } from '@app/shared/img';

@Component({
  selector: 'app-d11-team-hero',
  templateUrl: './d11-team-hero.component.html',
  imports: [D11TeamImgComponent],
})
export class D11TeamHeroComponent {
  readonly d11Team = input.required<D11TeamBase>();
  readonly d11TeamSeasonStat = input<D11TeamSeasonStat>();
}
