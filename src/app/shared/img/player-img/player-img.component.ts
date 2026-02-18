import { Component, computed, input, signal } from '@angular/core';
import { Player } from '@app/core/api';
import { Image } from 'primeng/image';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-player-img',
  imports: [Image],
  templateUrl: './player-img.component.html',
})
export class PlayerImgComponent {
  player = input.required<Player>();
  width = input<string | undefined>('32');

  protected imageUrl = computed(
    () =>
      `${environment.imageHost}/images/player/${this.imageError() ? 'default' : this.player().id}.png`,
  );

  private imageError = signal(false);

  protected onImageError() {
    this.imageError.set(true);
  }
}
