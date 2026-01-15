import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { InputPasswordComponent } from '@app/shared/form';

const PROPERTY = 'password';
const LABEL = 'label';
const ICON_PROPERTY = 'iconPassword';
const ICON_LABEL = 'iconLabel';
const ICON = 'pi-icon';

@Component({
  template: `
    <form [formGroup]="form">
      <app-input-password property="${PROPERTY}" label="${LABEL}" />
      <app-input-password property="${ICON_PROPERTY}" label="${ICON_LABEL}" icon="${ICON}" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, InputPasswordComponent],
})
class HostComponent {
  form = new FormGroup({
    [PROPERTY]: new FormControl(''),
    [ICON_PROPERTY]: new FormControl(''),
  });
}

describe('InputPasswordComponent', () => {
  let form: FormGroup;
  let input: HTMLInputElement;
  let user: ReturnType<typeof userEvent.setup>;

  const getIcon = (input: HTMLElement) =>
    input.closest('app-input-password')?.querySelector('.' + ICON);

  beforeEach(async () => {
    const { fixture } = await render(HostComponent);

    form = fixture.componentInstance.form;
    input = screen.getByLabelText(LABEL);
    user = userEvent.setup();
  });

  it('renders', async () => {
    expect(screen.getByText(LABEL)).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
    expect(input).toHaveValue('');
  });

  it('does not render icon when icon is not provided', async () => {
    expect(getIcon(input)).not.toBeInTheDocument();
  });

  it('renders icon when icon is provided', async () => {
    const iconInput = screen.getByLabelText(ICON_LABEL);

    expect(getIcon(iconInput)).toBeInTheDocument();
  });

  it('updates form value', async () => {
    await user.type(input, 'userInput');

    expect(input).toHaveValue('userInput');
    expect(form.get(PROPERTY)?.value).toBe('userInput');
  });
});
