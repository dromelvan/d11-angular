import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { ButtonIconComponent } from './button-icon.component';

const ICON = 'user';

@Component({
  template: ` <app-button-icon data-testid="button-icon" icon="${ICON}" /> `,
  standalone: true,
  imports: [ButtonIconComponent],
})
class HostComponent {}

@Component({
  template: ` <app-button-icon data-testid="button-icon" icon="${ICON}" size="lg" /> `,
  standalone: true,
  imports: [ButtonIconComponent],
})
class HostWithSizeComponent {}

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

      expect(span).toHaveClass('!text-xl');
    });

    it('applies custom size', async () => {
      await render(HostWithSizeComponent);

      const span = screen.getByTestId('button-icon').querySelector('span');

      expect(span).toHaveClass('!text-lg');
      expect(span).not.toHaveClass('!text-xl');
    });
  });
});
