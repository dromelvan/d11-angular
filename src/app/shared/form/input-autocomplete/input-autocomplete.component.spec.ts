import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { InputAutocompleteComponent } from './input-autocomplete.component';

const PROPERTY = 'property';
const LABEL = 'label';
const SUGGESTIONS = ['option1', 'option2', 'option3'];

describe('InputAutocompleteComponent', () => {
  describe('basic', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      const form = new FormGroup({
        [PROPERTY]: new FormControl(''),
      });

      await render(
        `<form [formGroup]="form">
          <app-input-autocomplete
            property="${PROPERTY}"
            label="${LABEL}"
            [suggestions]="suggestions"
          />
        </form>`,
        {
          imports: [ReactiveFormsModule, InputAutocompleteComponent],
          componentProperties: { form, suggestions: SUGGESTIONS },
        },
      );

      input = screen.getByRole('combobox', { name: LABEL });
    });

    it('renders', () => {
      expect(screen.getByText(LABEL)).toBeInTheDocument();
      expect(input).toBeInTheDocument();
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
          <app-input-autocomplete
            property="${PROPERTY}"
            label="${LABEL}"
            [suggestions]="[]"
            [required]="true"
          />
        </form>`,
        {
          imports: [ReactiveFormsModule, InputAutocompleteComponent],
          componentProperties: { form },
        },
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
      form.get(PROPERTY)?.setValue('value');
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
