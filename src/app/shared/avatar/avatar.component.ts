import { Component, computed, input, signal } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-avatar',
  imports: [Avatar],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  resource = input.required<string>();
  id = input.required<number>();
  extension = input<string>('png');
  size = input<'normal' | 'large' | 'xlarge' | '2xlarge'>();

  protected imageUrl = computed(() =>
    this.imageError()
      ? `${environment.imageHost}/images/${this.resource()}/default.${this.extension()}`
      : `${environment.imageHost}/images/${this.resource()}/${this.id()}.${this.extension()}`,
  );

  private imageError = signal(false);

  protected onImageError() {
    this.imageError.set(true);
  }
}
