import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { InputDateComponent } from './input-date.component';

const PROPERTY = 'property';
const LABEL = 'label';
const INITIAL_VALUE = '2000-06-15';

describe('InputDateComponent', () => {
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
          <app-input-date property="${PROPERTY}" label="${LABEL}" />
        </form>`,
        { imports: [ReactiveFormsModule, InputDateComponent], componentProperties: { form } },
      );
      detectChanges = () => fixture.detectChanges();

      input = screen.getByRole('combobox', { name: LABEL });
    });

    it('renders', () => {
      expect(screen.getByText(LABEL)).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(INITIAL_VALUE);
    });

    it('reflects form value changes', () => {
      form.get(PROPERTY)?.setValue('1990-01-01');
      detectChanges();

      expect(input).toHaveValue('1990-01-01');
    });
  });

  describe('when required', () => {
    let form: FormGroup;
    let input: HTMLInputElement;
    let user: ReturnType<typeof userEvent.setup>;
    let detectChanges: () => void;

    beforeEach(async () => {
      form = new FormGroup({
        [PROPERTY]: new FormControl<string | null>(null, Validators.required),
      });

      const { fixture } = await render(
        `<form [formGroup]="form">
          <app-input-date property="${PROPERTY}" label="${LABEL}" [required]="true" />
        </form>`,
        { imports: [ReactiveFormsModule, InputDateComponent], componentProperties: { form } },
      );
      detectChanges = () => fixture.detectChanges();

      input = screen.getByRole('combobox', { name: LABEL });
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
      form.get(PROPERTY)?.setValue('2000-06-15');
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
