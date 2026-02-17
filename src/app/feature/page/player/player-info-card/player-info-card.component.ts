import { Component, input } from '@angular/core';
import type { Player } from '@app/core/api';
import { CountryImgComponent } from '@app/shared/img';
import { AgePipe, SafeDatePipe } from '@app/shared/pipes';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-info-card',
  imports: [Card, CountryImgComponent, AgePipe, SafeDatePipe],
  templateUrl: './player-info-card.component.html',
})
export class PlayerInfoCardComponent {
  player = input.required<Player | undefined>();
}
