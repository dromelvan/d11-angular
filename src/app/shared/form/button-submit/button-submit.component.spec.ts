import { signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import { waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ButtonSubmitComponent } from './button-submit.component';

const PROPERTY = 'property';
const LABEL = 'label';
const ICON = 'pi-icon';
const LABEL_NO_ICON = 'labelWorking';

const template = `
  <form [formGroup]="form">
    <input formControlName="${PROPERTY}" id="${PROPERTY}" />
    <app-button-submit [form]="form" label="${LABEL}" icon="${ICON}" [working]="working" />
    <app-button-submit [form]="form" label="${LABEL_NO_ICON}" />
  </form>
`;

describe('ButtonSubmitComponent', () => {
  let form: FormGroup;
  let working: WritableSignal<boolean>;
  let input: HTMLInputElement;
  let button: HTMLButtonElement;
  let buttonNoIcon: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    form = new FormGroup({
      [PROPERTY]: new FormControl('', Validators.required),
    });
    working = signal(false);

    await render(template, {
      imports: [ReactiveFormsModule, ButtonSubmitComponent],
      componentProperties: { form, working },
    });

    input = screen.getByRole('textbox');
    button = screen.getByRole('button', { name: `${ICON}${LABEL}` });
    buttonNoIcon = screen.getByRole('button', { name: LABEL_NO_ICON });
    user = userEvent.setup();
  });

  it('renders', () => {
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(LABEL);
  });

  it('renders icon when icon is provided', () => {
    expect(within(button).getByText(ICON)).toBeInTheDocument();
  });

  it('does not render icon when icon is not provided', () => {
    expect(within(buttonNoIcon).queryByText(ICON)).not.toBeInTheDocument();
  });

  it('renders spinner when working and working is provided', async () => {
    expect(within(button).queryByRole('progressbar')).not.toBeInTheDocument();

    working.set(true);

    await waitFor(() => {
      expect(within(button).getByRole('progressbar')).toBeInTheDocument();
    });

    working.set(false);

    await waitFor(() => {
      expect(within(button).queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('does not render label and icon when working and working is provided', async () => {
    expect(within(button).getByText(LABEL)).toBeInTheDocument();
    expect(within(button).getByText(ICON)).toBeInTheDocument();

    working.set(true);

    await waitFor(() => {
      expect(within(button).queryByText(LABEL)).not.toBeInTheDocument();
      expect(within(button).queryByText(ICON)).not.toBeInTheDocument();
    });

    working.set(false);

    await waitFor(() => {
      expect(within(button).getByText(LABEL)).toBeInTheDocument();
      expect(within(button).getByText(ICON)).toBeInTheDocument();
    });
  });

  it('disables when form is not dirty and valid', async () => {
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
    form.markAsPristine();

    await waitFor(() => {
      expect(buttonNoIcon).toBeDisabled();
    });
  });

  it('disables when working and working is provided', async () => {
    expect(button).toBeDisabled();

    await user.type(input, 'userInput');

    expect(button).toBeEnabled();

    working.set(true);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await user.type(input, 'moreInput');

    expect(button).toBeDisabled();

    working.set(false);

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });
});
