import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { InputTextComponent } from './input-text.component';

const PROPERTY = 'property';
const LABEL = 'label';
const INITIAL_INPUT = 'initialInput';
const ICON_PROPERTY = 'iconProperty';
const ICON_LABEL = 'iconLabel';
const ICON = 'pi-icon';

describe('InputTextComponent', () => {
  describe('basic', () => {
    let form: FormGroup;
    let input: HTMLInputElement;

    beforeEach(async () => {
      form = new FormGroup({
        [PROPERTY]: new FormControl(INITIAL_INPUT),
        [ICON_PROPERTY]: new FormControl(''),
      });

      await render(
        `<form [formGroup]="form">
          <app-input-text property="${PROPERTY}" label="${LABEL}" />
          <app-input-text property="${ICON_PROPERTY}" label="${ICON_LABEL}" icon="${ICON}" />
        </form>`,
        { imports: [ReactiveFormsModule, InputTextComponent], componentProperties: { form } },
      );

      input = screen.getByRole('textbox', { name: LABEL });
    });

    it('renders', () => {
      expect(screen.getByText(LABEL)).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(INITIAL_INPUT);
    });

    it('does not render icon when icon is not provided', () => {
      expect(input.parentElement?.querySelector('.' + ICON)).not.toBeInTheDocument();
    });

    it('renders icon when icon is provided', () => {
      const iconInput = screen.getByRole('textbox', { name: ICON_LABEL });

      expect(iconInput.parentElement?.querySelector('.' + ICON)).toBeInTheDocument();
    });

    it('updates form value', async () => {
      const user = userEvent.setup();
      await user.type(input, 'userInput');

      expect(input).toHaveValue(INITIAL_INPUT + 'userInput');
      expect(form.get(PROPERTY)?.value).toBe(INITIAL_INPUT + 'userInput');
    });
  });

  describe('when required', () => {
    let input: HTMLInputElement;
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(async () => {
      const form = new FormGroup({
        [PROPERTY]: new FormControl('', Validators.required),
      });

      await render(
        `<form [formGroup]="form">
          <app-input-text property="${PROPERTY}" label="${LABEL}" [required]="true" />
        </form>`,
        { imports: [ReactiveFormsModule, InputTextComponent], componentProperties: { form } },
      );

      input = screen.getByRole('textbox', { name: LABEL });
      user = userEvent.setup();
    });

    it('shows error message when touched and empty', async () => {
      await user.click(input);
      await user.tab();

      expect(screen.getByText(`${LABEL} is required.`)).toBeInTheDocument();
    });

    it('does not show error message when untouched', () => {
      expect(screen.queryByText(`${LABEL} is required.`)).not.toBeInTheDocument();
    });

    it('does not show error message when touched and filled', async () => {
      await user.type(input, 'value');

      expect(screen.queryByText(`${LABEL} is required.`)).not.toBeInTheDocument();
    });

    it('applies p-invalid class when touched and empty', async () => {
      await user.click(input);
      await user.tab();

      expect(input).toHaveClass('p-invalid');
    });
  });
});
