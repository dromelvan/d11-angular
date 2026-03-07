import { Component, computed, input } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-button-icon',
  imports: [Button],
  templateUrl: './button-icon.component.html',
})
export class ButtonIconComponent {
  icon = input<string>();
  size = input<string>('xl');
  disabled = input<boolean>(false);

  protected iconClass = computed(() => `pi pi-${this.icon()} text-${this.size()}!`);
}
