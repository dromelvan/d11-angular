import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import { InputDropdownComponent } from './input-dropdown.component';

const PROPERTY = 'property';
const LABEL = 'label';
const OPTIONS = [
  { id: 1, name: 'Option1' },
  { id: 2, name: 'Option2' },
];

describe('InputDropdownComponent', () => {
  describe('basic', () => {
    beforeEach(async () => {
      const form = new FormGroup({
        [PROPERTY]: new FormControl(null),
      });

      await render(
        `<form [formGroup]="form">
          <app-input-dropdown
            property="${PROPERTY}"
            label="${LABEL}"
            optionLabel="name"
            [options]="options"
          />
        </form>`,
        {
          imports: [ReactiveFormsModule, InputDropdownComponent],
          componentProperties: { form, options: OPTIONS },
        },
      );
    });

    it('renders', () => {
      expect(screen.getByText(LABEL)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('when required', () => {
    let form: FormGroup;
    let detectChanges: () => void;

    beforeEach(async () => {
      form = new FormGroup({
        [PROPERTY]: new FormControl<{ id: number; name: string } | null>(null, Validators.required),
      });

      const { fixture } = await render(
        `<form [formGroup]="form">
          <app-input-dropdown
            property="${PROPERTY}"
            label="${LABEL}"
            optionLabel="name"
            [options]="options"
            [required]="true"
          />
        </form>`,
        {
          imports: [ReactiveFormsModule, InputDropdownComponent],
          componentProperties: { form, options: OPTIONS },
        },
      );
      detectChanges = () => fixture.detectChanges();
    });

    it('does not show error message when untouched', () => {
      expect(screen.queryByText(`${LABEL} is required.`)).not.toBeInTheDocument();
    });

    it('shows error message when touched and empty', () => {
      form.get(PROPERTY)?.markAsTouched();
      detectChanges();

      expect(screen.getByText(`${LABEL} is required.`)).toBeInTheDocument();
    });

    it('does not show error message when touched and filled', () => {
      form.get(PROPERTY)?.setValue(OPTIONS[0]);
      form.get(PROPERTY)?.markAsTouched();
      detectChanges();

      expect(screen.queryByText(`${LABEL} is required.`)).not.toBeInTheDocument();
    });

    it('applies p-invalid class when touched and empty', () => {
      form.get(PROPERTY)?.markAsTouched();
      detectChanges();

      expect(screen.getByRole('combobox').closest('.p-select')).toHaveClass('p-invalid');
    });
  });
});
