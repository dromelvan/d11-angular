import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-input-date',
  imports: [DatePicker, ReactiveFormsModule, Message],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-date.component.html',
})
export class InputDateComponent {
  readonly property = input.required<string>();
  readonly label = input.required<string>();
  readonly required = input(false);

  private controlContainer = inject(ControlContainer);

  protected get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.property()) ?? null;
  }
}
