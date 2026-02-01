import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon-user-circle',
  imports: [],
  templateUrl: './icon-user-circle.component.html',
})
export class IconUserCircleComponent {
  public readonly size = input<number>(6);

  protected sizeClass = computed(() => {
    return `size-${this.size()}`;
  });
}
