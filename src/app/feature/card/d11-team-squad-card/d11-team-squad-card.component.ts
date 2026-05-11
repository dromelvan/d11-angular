import { Component, input } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { Position } from '@app/core/api/model/position.model';
import { D11TeamSquadComponent } from '@app/feature/component/d11-team-squad/d11-team-squad.component';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-squad-card',
  imports: [Card, D11TeamImgComponent, D11TeamSquadComponent],
  templateUrl: './d11-team-squad-card.component.html',
})
export class D11TeamSquadCardComponent {
  d11TeamSeasonStat = input.required<D11TeamSeasonStat>();
  positions = input.required<Position[]>();
}
