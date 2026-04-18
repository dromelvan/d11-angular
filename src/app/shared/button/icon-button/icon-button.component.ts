import { Component, computed, input } from '@angular/core';
import { Button } from 'primeng/button';
import { IconComponent, IconPreset } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-material-icon-button',
  imports: [Button, IconComponent],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  icon = input.required<IconPreset>();
  severity = input<'primary' | 'secondary' | 'contrast'>('primary');
  variant = input<'outlined' | 'text' | undefined>();
  disabled = input<boolean>(false);
  iconClass = input<string | undefined>();

  // PrimeNG requires the slot to be named `#icon`, which shadows the `icon` input signal inside the template.
  protected iconPreset = computed(() => this.icon());
}
