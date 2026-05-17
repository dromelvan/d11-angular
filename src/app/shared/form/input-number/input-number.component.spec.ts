import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { InputNumberComponent } from './input-number.component';

const PROPERTY = 'property';
const LABEL = 'label';
const INITIAL_VALUE = 42;

describe('InputNumberComponent', () => {
  describe('basic', () => {
    let form: FormGroup;
    let input: HTMLInputElement;
    let detectChanges: () => void;

    beforeEach(async () => {
      form = new FormGroup({
        [PROPERTY]: new FormControl(INITIAL_VALUE),
      });

      const { fixture } = await render(
        `<form [formGroup]="form">
          <app-input-number property="${PROPERTY}" label="${LABEL}" />
        </form>`,
        { imports: [ReactiveFormsModule, InputNumberComponent], componentProperties: { form } },
      );
      detectChanges = () => fixture.detectChanges();

      input = screen.getByRole('spinbutton', { name: LABEL });
    });

    it('renders', () => {
      expect(screen.getByText(LABEL)).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(String(INITIAL_VALUE));
    });

    it('reflects form value changes', () => {
      form.get(PROPERTY)?.setValue(99);
      detectChanges();

      expect(input).toHaveValue('99');
    });
  });

  describe('when required', () => {
    let form: FormGroup;
    let input: HTMLInputElement;
    let user: ReturnType<typeof userEvent.setup>;
    let detectChanges: () => void;

    beforeEach(async () => {
      form = new FormGroup({
        [PROPERTY]: new FormControl<number | null>(null, Validators.required),
      });

      const { fixture } = await render(
        `<form [formGroup]="form">
          <app-input-number property="${PROPERTY}" label="${LABEL}" [required]="true" />
        </form>`,
        { imports: [ReactiveFormsModule, InputNumberComponent], componentProperties: { form } },
      );
      detectChanges = () => fixture.detectChanges();

      input = screen.getByRole('spinbutton', { name: LABEL });
      user = userEvent.setup();
    });

    it('does not show error message when untouched', () => {
      expect(screen.queryByText(`${LABEL} is required.`)).not.toBeInTheDocument();
    });

    it('shows error message when touched and empty', async () => {
      await user.click(input);
      await user.tab();

      expect(screen.getByText(`${LABEL} is required.`)).toBeInTheDocument();
    });

    it('does not show error message when touched and filled', async () => {
      await user.click(input);
      form.get(PROPERTY)?.setValue(10);
      detectChanges();

      expect(screen.queryByText(`${LABEL} is required.`)).not.toBeInTheDocument();
    });

    it('applies p-invalid class when touched and empty', async () => {
      await user.click(input);
      await user.tab();

      expect(input).toHaveClass('p-invalid');
    });
  });
});
