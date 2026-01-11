import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-input-password',
  imports: [FormsModule, ReactiveFormsModule, InputGroup, InputGroupAddon, Password],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-password.component.html',
})
export class InputPasswordComponent {
  @Input() property!: string;
  @Input() label!: string;
  @Input() icon?: string;
  @Input() feedback = false;
}
