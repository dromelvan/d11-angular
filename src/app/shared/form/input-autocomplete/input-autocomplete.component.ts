import { Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-input-autocomplete',
  imports: [AutoComplete, ReactiveFormsModule, Message],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-autocomplete.component.html',
})
export class InputAutocompleteComponent {
  readonly property = input.required<string>();
  readonly label = input.required<string>();
  readonly suggestions = input<unknown[]>([]);
  readonly optionLabel = input<string>();
  readonly placeholder = input<string>();
  readonly required = input(false);

  readonly completeMethod = output<{ query: string }>();

  private controlContainer = inject(ControlContainer);

  protected get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.property()) ?? null;
  }
}
