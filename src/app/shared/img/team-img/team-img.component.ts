import { Component, computed, input, signal } from '@angular/core';
import { TeamBase } from '@app/core/api';
import { Image } from 'primeng/image';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-team-img',
  imports: [Image],
  templateUrl: './team-img.component.html',
})
export class TeamImgComponent {
  team = input.required<TeamBase>();
  width = input<string | undefined>('32');

  protected imageUrl = computed(
    () =>
      `${environment.imageHost}/images/team/${this.imageError() ? 'default' : this.team().id}.png`,
  );

  private imageError = signal(false);

  protected onImageError() {
    this.imageError.set(true);
  }
}
