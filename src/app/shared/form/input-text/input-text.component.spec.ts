import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { InputTextComponent } from './input-text.component';

const PROPERTY = 'property';
const LABEL = 'label';
const INITIAL_INPUT = 'initialInput';
const ICON_PROPERTY = 'iconProperty';
const ICON_LABEL = 'iconLabel';
const ICON = 'pi-icon';

@Component({
  template: `
    <form [formGroup]="form">
      <app-input-text property="${PROPERTY}" label="${LABEL}" />
      <app-input-text property="${ICON_PROPERTY}" label="${ICON_LABEL}" icon="${ICON}" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
})
class HostComponent {
  form = new FormGroup({
    [PROPERTY]: new FormControl(INITIAL_INPUT),
    [ICON_PROPERTY]: new FormControl(''),
  });
}

describe('InputTextComponent', () => {
  let form: FormGroup;
  let input: HTMLInputElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    const { fixture } = await render(HostComponent);

    form = fixture.componentInstance.form;
    input = screen.getByRole('textbox', { name: LABEL });
    user = userEvent.setup();
  });

  it('renders', async () => {
    expect(screen.getByText(LABEL)).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(INITIAL_INPUT);
  });

  it('does not render icon when icon is not provided', async () => {
    expect(input.parentElement?.querySelector('.' + ICON)).not.toBeInTheDocument();
  });

  it('renders icon when icon is provided', async () => {
    const iconInput = screen.getByRole('textbox', { name: ICON_LABEL });

    expect(iconInput.parentElement?.querySelector('.' + ICON)).toBeInTheDocument();
  });

  it('updates form value', async () => {
    await user.type(input, 'userInput');

    expect(input).toHaveValue(INITIAL_INPUT + 'userInput');
    expect(form.get(PROPERTY)?.value).toBe(INITIAL_INPUT + 'userInput');
  });
});
