import { Component, Input, WritableSignal } from '@angular/core';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { FormGroup } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-button-submit',
  imports: [ButtonDirective, ButtonIcon, ButtonLabel, ProgressSpinner],
  templateUrl: './button-submit.component.html',
  styleUrl: './button-submit.component.css',
})
export class ButtonSubmitComponent {
  @Input() form!: FormGroup;
  @Input() label!: string;
  @Input() icon?: string;
  @Input() working?: WritableSignal<boolean>;
}
