import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { ButtonIconOldComponent } from './button-icon-old.component';

const ICON = 'user';

@Component({
  template: ` <app-button-icon-old data-testid="button-icon" icon="${ICON}" /> `,
  standalone: true,
  imports: [ButtonIconOldComponent],
})
class HostComponent {}

@Component({
  template: ` <app-button-icon-old data-testid="button-icon" icon="${ICON}" size="lg" /> `,
  standalone: true,
  imports: [ButtonIconOldComponent],
})
class HostWithSizeComponent {}

@Component({
  template: ` <app-button-icon-old data-testid="button-icon" icon="${ICON}" [disabled]="true" /> `,
  standalone: true,
  imports: [ButtonIconOldComponent],
})
class HostWithDisabledComponent {}

@Component({
  template: `
    <app-button-icon-old data-testid="button-icon" icon="${ICON}" [transparent]="true" />
  `,
  standalone: true,
  imports: [ButtonIconOldComponent],
})
class HostWithTransparentComponent {}

describe('ButtonIconComponent', () => {
  it('renders', async () => {
    await render(HostComponent);

    const component = screen.getByTestId('button-icon');

    expect(component).toBeInTheDocument();

    const span = component.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(`pi-${ICON}`);
  });

  describe('size', () => {
    it('defaults to xl', async () => {
      await render(HostComponent);

      const span = screen.getByTestId('button-icon').querySelector('span');

      expect(span).toHaveClass('text-xl!');
    });

    it('applies custom size', async () => {
      await render(HostWithSizeComponent);

      const span = screen.getByTestId('button-icon').querySelector('span');

      expect(span).toHaveClass('text-lg!');
      expect(span).not.toHaveClass('text-xl!');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      await render(HostComponent);

      const button = screen.getByTestId('button-icon').querySelector('button');

      expect(button).not.toBeDisabled();
    });

    it('disables the button when true', async () => {
      await render(HostWithDisabledComponent);

      const button = screen.getByTestId('button-icon').querySelector('button');

      expect(button).toBeDisabled();
    });
  });

  describe('transparent', () => {
    it('uses semi-transparent bg classes by default', async () => {
      await render(HostComponent);

      const button = screen.getByTestId('button-icon').querySelector('button');

      expect(button).not.toHaveClass('bg-transparent!');
      expect(button).toHaveClass('bg-black/20!');
    });

    it('uses transparent bg classes when true', async () => {
      await render(HostWithTransparentComponent);

      const button = screen.getByTestId('button-icon').querySelector('button');

      expect(button).toHaveClass('bg-transparent!');
      expect(button).not.toHaveClass('bg-black/20!');
    });
  });
});
