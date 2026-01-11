import { Component, Input } from '@angular/core';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-button-submit',
  imports: [ButtonDirective, ButtonIcon, ButtonLabel],
  templateUrl: './button-submit.component.html',
})
export class ButtonSubmitComponent {
  @Input() form!: FormGroup;
  @Input() label!: string;
  @Input() icon?: string;
}
