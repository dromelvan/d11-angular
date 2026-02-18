import { Component, computed, input, signal } from '@angular/core';
import { D11TeamBase } from '@app/core/api';
import { Image } from 'primeng/image';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-d11-team-img',
  imports: [Image],
  templateUrl: './d11-team-img.component.html',
})
export class D11TeamImgComponent {
  d11Team = input.required<D11TeamBase>();
  width = input<string | undefined>('32');

  protected imageUrl = computed(
    () =>
      `${environment.imageHost}/images/d11-team/${this.imageError() ? 'default' : this.d11Team().id}.png`,
  );

  private imageError = signal(false);

  protected onImageError() {
    this.imageError.set(true);
  }
}
