import { Component, input } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-button-icon',
  imports: [Button],
  templateUrl: './button-icon.component.html',
})
export class ButtonIconComponent {
  icon = input<string>();
}
