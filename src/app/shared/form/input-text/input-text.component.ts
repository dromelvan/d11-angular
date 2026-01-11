import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text',
  imports: [FormsModule, InputGroup, InputGroupAddon, InputText, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './input-text.component.html',
})
export class InputTextComponent {
  @Input() property!: string;
  @Input() label!: string;
  @Input() icon?: string;
}
