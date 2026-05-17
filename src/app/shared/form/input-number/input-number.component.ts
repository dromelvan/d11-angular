import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-input-number',
  imports: [InputNumber, ReactiveFormsModule, Message],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-number.component.html',
})
export class InputNumberComponent {
  readonly property = input.required<string>();
  readonly label = input.required<string>();
  readonly useGrouping = input(false);
  readonly required = input(false);

  private controlContainer = inject(ControlContainer);

  protected get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.property()) ?? null;
  }
}
