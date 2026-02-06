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

describe('ButtonIconComponent', () => {
  it('renders', async () => {
    await render(HostComponent, {
      providers: [],
    });

    const component = screen.getByTestId('button-icon');

    expect(component).toBeInTheDocument();

    const span = component.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(`pi-${ICON}`);
  });
});
