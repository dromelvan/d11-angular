import { Component, Input } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [Checkbox, FormsModule, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent {
  @Input() property!: string;
  @Input() label!: string;
}
