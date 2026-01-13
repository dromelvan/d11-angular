import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ButtonSubmitComponent } from './button-submit.component';
import { expect } from 'vitest';
import { waitFor, within } from '@testing-library/dom';

const PROPERTY = 'property';
const LABEL = 'label';
const ICON = 'pi-icon';
const LABEL_NO_ICON = 'labelWorking';

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="${PROPERTY}" id="${PROPERTY}" />
      <app-button-submit
        [form]="form"
        label="${LABEL}"
        icon="${ICON}"
        [working]="working"
        (click)="onSubmitWork()"
      />
      <app-button-submit [form]="form" label="${LABEL_NO_ICON}" (click)="onSubmit()" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ButtonSubmitComponent],
})
class HostComponent {
  working = signal(false);

  form = new FormGroup({
    [PROPERTY]: new FormControl('', Validators.required),
  });

  onSubmitWork() {
    this.working.set(true);
    this.onSubmit();
  }

  onSubmit() {
    this.form.reset(this.form.getRawValue());
  }
}

describe('ButtonSubmitComponent', () => {
  let component: HostComponent;
  let input: HTMLInputElement;
  let button: HTMLButtonElement;
  let buttonNoIcon: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    const { fixture } = await render(HostComponent);

    component = fixture.componentInstance;
    input = screen.getByRole('textbox');
    button = screen.getByRole('button', { name: ICON + LABEL });
    buttonNoIcon = screen.getByRole('button', { name: LABEL_NO_ICON });
    user = userEvent.setup();
  });

  it('renders', async () => {
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(LABEL);
  });

  it('renders icon when icon is provided', async () => {
    expect(within(button).getByText(ICON)).toBeInTheDocument();
  });

  it('does not render icon when icon is not provided', async () => {
    expect(within(buttonNoIcon).queryByText(ICON)).not.toBeInTheDocument();
  });

  it('renders spinner when working and working is provided', async () => {
    expect(within(button).queryByRole('progressbar')).not.toBeInTheDocument();

    await user.type(input, 'userInput');
    await user.click(button);

    expect(within(button).getByRole('progressbar')).toBeInTheDocument();

    component.working.set(false);

    await waitFor(() => {
      expect(within(button).queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('does not render label and icon when working and working is provided', async () => {
    expect(within(button).getByText(LABEL)).toBeInTheDocument();
    expect(within(button).getByText(ICON)).toBeInTheDocument();

    await user.type(input, 'userInput');
    await user.click(button);

    expect(within(button).queryByText(LABEL)).not.toBeInTheDocument();
    expect(within(button).queryByText(ICON)).not.toBeInTheDocument();

    component.working.set(false);

    await waitFor(() => {
      expect(within(button).getByText(LABEL)).toBeInTheDocument();
      expect(within(button).getByText(ICON)).toBeInTheDocument();
    });
  });

  it('disables when form is not dirty and valid', async () => {
    const form = component.form;

    expect(form.valid).toBe(false);
    expect(form.dirty).toBe(false);
    expect(buttonNoIcon).toBeDisabled();

    await user.type(input, 'userInput');

    expect(form.valid).toBe(true);
    expect(form.dirty).toBe(true);
    expect(buttonNoIcon).toBeEnabled();

    await user.clear(input);

    expect(form.valid).toBe(false);
    expect(form.dirty).toBe(true);
    expect(buttonNoIcon).toBeDisabled();

    await user.type(input, 'userInput');
    await user.click(buttonNoIcon);

    expect(form.valid).toBe(true);
    expect(form.dirty).toBe(false);
    expect(buttonNoIcon).toBeDisabled();
  });

  it('disables when working and working is provided', async () => {
    expect(button).toBeDisabled();

    await user.type(input, 'userInput');
    expect(button).toBeEnabled();

    await user.click(button);
    expect(button).toBeDisabled();

    await user.type(input, 'userInput');
    expect(button).toBeDisabled();

    component.working.set(false);

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });
});
