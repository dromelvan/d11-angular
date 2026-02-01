import { Component, computed, input } from '@angular/core';
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
  size = input<'large' | 'xlarge'>();

  protected imageUrl = computed(
    () => `${environment.imageHost}/images/${this.resource()}/${this.id()}.${this.extension()}`,
  );
}
