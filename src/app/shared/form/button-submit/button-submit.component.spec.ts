import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ButtonSubmitComponent } from './button-submit.component';

const PROPERTY = 'property';
const SUBMIT = 'Submit';
const ICON_SUBMIT = 'iconSubmit';
const ICON = 'pi-icon';

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="${PROPERTY}" id="${PROPERTY}" />
      <app-button-submit [form]="form" label="${SUBMIT}" (click)="onSubmit()" />
      <app-button-submit [form]="form" label="${ICON_SUBMIT}" icon="${ICON}" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ButtonSubmitComponent],
})
class HostComponent {
  form = new FormGroup({
    [PROPERTY]: new FormControl('', Validators.required),
  });

  onSubmit() {
    this.form.reset(this.form.getRawValue());
  }
}

describe('ButtonSubmitComponent', () => {
  let form: FormGroup;
  let input: HTMLInputElement;
  let button: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    const { fixture } = await render(HostComponent);

    form = fixture.componentInstance.form;
    input = screen.getByRole('textbox');
    button = screen.getByRole('button', { name: SUBMIT });
    user = userEvent.setup();
  });

  it('renders', async () => {
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(SUBMIT);
  });

  it('does not render icon when icon is not provided', async () => {
    expect(button.querySelector('.' + ICON)).not.toBeInTheDocument();
  });

  it('renders icon when icon is provided', async () => {
    const iconButton = screen.getByRole('button', { name: ICON_SUBMIT });

    expect(iconButton.querySelector('.' + ICON)).toBeInTheDocument();
  });

  it('updates button state on form state change', async () => {
    expect(form.valid).toBe(false);
    expect(form.dirty).toBe(false);
    expect(button).toBeDisabled();

    await user.type(input, 'userInput');

    expect(form.valid).toBe(true);
    expect(form.dirty).toBe(true);
    expect(button).toBeEnabled();

    await user.clear(input);

    expect(form.valid).toBe(false);
    expect(form.dirty).toBe(true);
    expect(button).toBeDisabled();

    await user.type(input, 'userInput');
    await user.click(button);

    expect(form.valid).toBe(true);
    expect(form.dirty).toBe(false);
    expect(button).toBeDisabled();
  });
});
