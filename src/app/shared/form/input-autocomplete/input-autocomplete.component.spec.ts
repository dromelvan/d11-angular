import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { AutoComplete } from 'primeng/autocomplete';
import { InputAutocompleteComponent } from './input-autocomplete.component';

const PROPERTY = 'property';
const LABEL = 'label';
const SUGGESTIONS = ['option1', 'option2', 'option3'];

describe('InputAutocompleteComponent', () => {
  describe('basic', () => {
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
    });

    it('renders label and input', () => {
      expect(screen.getByText(LABEL)).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: LABEL })).toBeInTheDocument();
    });
  });

  // placeholder -----------------------------------------------------------------------------------

  describe('placeholder', () => {
    const PLACEHOLDER = 'Search...';

    beforeEach(async () => {
      const form = new FormGroup({ [PROPERTY]: new FormControl('') });

      await render(
        `<form [formGroup]="form">
          <app-input-autocomplete
            property="${PROPERTY}"
            label="${LABEL}"
            [suggestions]="[]"
            placeholder="${PLACEHOLDER}"
          />
        </form>`,
        {
          imports: [ReactiveFormsModule, InputAutocompleteComponent],
          componentProperties: { form },
        },
      );
    });

    it('sets placeholder on the input', () => {
      expect(screen.getByRole('combobox', { name: LABEL })).toHaveAttribute(
        'placeholder',
        PLACEHOLDER,
      );
    });
  });

  // completeMethod --------------------------------------------------------------------------------

  describe('completeMethod', () => {
    let onComplete: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      const form = new FormGroup({ [PROPERTY]: new FormControl('') });
      onComplete = vi.fn();

      const { fixture } = await render(
        `<form [formGroup]="form">
          <app-input-autocomplete
            property="${PROPERTY}"
            label="${LABEL}"
            [suggestions]="suggestions"
            (completeMethod)="onComplete($event)"
          />
        </form>`,
        {
          imports: [ReactiveFormsModule, InputAutocompleteComponent],
          componentProperties: { form, suggestions: SUGGESTIONS, onComplete },
        },
      );

      fixture.debugElement
        .query(By.directive(AutoComplete))
        .componentInstance.completeMethod.emit({ query: 'opt' });
    });

    it('emits completeMethod with the query', () => {
      expect(onComplete).toHaveBeenCalledWith({ query: 'opt' });
    });
  });

  // when required ---------------------------------------------------------------------------------

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
