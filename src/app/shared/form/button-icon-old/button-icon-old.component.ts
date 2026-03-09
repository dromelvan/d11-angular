import { Component, computed, input } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-button-icon-old',
  imports: [Button],
  templateUrl: './button-icon-old.component.html',
})
export class ButtonIconOldComponent {
  icon = input<string>();
  size = input<string>('xl');
  disabled = input<boolean>(false);
  transparent = input<boolean>(false);

  protected iconClass = computed(() => `pi pi-${this.icon()} text-${this.size()}!`);
  protected styleClass = computed(() =>
    this.transparent()
      ? 'bg-transparent! hover:bg-transparent! active:bg-transparent! border-transparent!'
      : 'bg-black/20! hover:bg-black/30! active:bg-black/40! border-transparent!',
  );
}
