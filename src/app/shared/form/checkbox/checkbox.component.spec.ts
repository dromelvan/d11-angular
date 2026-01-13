import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CheckboxComponent } from './checkbox.component';

const PROPERTY = 'property';
const LABEL = 'label';

@Component({
  template: `
    <form [formGroup]="form">
      <app-checkbox property="${PROPERTY}" label="${LABEL}"></app-checkbox>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, CheckboxComponent],
})
class HostComponent {
  form = new FormGroup({
    [PROPERTY]: new FormControl(false),
  });
}

describe('CheckboxComponent', () => {
  let form: FormGroup;
  let checkbox: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    const { fixture } = await render(HostComponent);

    form = fixture.componentInstance.form;
    checkbox = screen.getByRole('checkbox', { name: LABEL });
    user = userEvent.setup();
  });

  it('renders', async () => {
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAccessibleName(LABEL);
    expect(checkbox).not.toBeChecked();
  });

  it('updates form value on checkbox click', async () => {
    expect(form.get(PROPERTY)?.value).toBe(false);

    await user.click(checkbox);

    expect(form.get(PROPERTY)?.value).toBe(true);
    expect(checkbox).toBeChecked();
  });

  it('updates form value on label click', async () => {
    const label = screen.getByText(LABEL);

    expect(form.get(PROPERTY)?.value).toBe(false);

    await user.click(label);

    expect(form.get(PROPERTY)?.value).toBe(true);
    expect(checkbox).toBeChecked();
  });
});
