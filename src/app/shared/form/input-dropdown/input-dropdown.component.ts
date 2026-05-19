import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-input-dropdown',
  imports: [Select, ReactiveFormsModule, Message],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-dropdown.component.html',
})
export class InputDropdownComponent {
  readonly property = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input<unknown[]>([]);
  readonly optionLabel = input<string>();
  readonly required = input(false);

  private controlContainer = inject(ControlContainer);

  protected get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.property()) ?? null;
  }
}
