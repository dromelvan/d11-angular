import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { UtilityBarComponent } from './utility-bar.component';

@Component({
  template: ` <app-utility-bar data-testid="utility-bar" /> `,
  standalone: true,
  imports: [UtilityBarComponent],
})
class HostComponent {}

describe('UtilityBarComponent', () => {
  it('renders', async () => {
    await render(HostComponent, {
      providers: [],
    });

    const component = screen.getByTestId('utility-bar');

    expect(component).toBeInTheDocument();

    const buttonIcon = component.querySelector('app-button-icon');
    expect(buttonIcon).toBeInTheDocument();
    expect(buttonIcon).toHaveClass('sm:!hidden');

    const span = buttonIcon?.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(`pi-search`);

    const autocomplete = component.querySelector('app-search-autocomplete');
    expect(autocomplete).toBeInTheDocument();
    expect(autocomplete).toHaveClass('hidden sm:block');

    const userSession = component.querySelector('app-user-session');
    expect(userSession).toBeInTheDocument();
  });
});
