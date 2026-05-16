import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-input-text',
  imports: [FormsModule, InputGroup, InputGroupAddon, InputText, ReactiveFormsModule, Message],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-text.component.html',
})
export class InputTextComponent {
  readonly property = input.required<string>();
  readonly label = input.required<string>();
  readonly icon = input<string>();
  readonly required = input(false);

  private controlContainer = inject(ControlContainer);

  protected get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.property()) ?? null;
  }
}
