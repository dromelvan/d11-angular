import { Component } from '@angular/core';
import { PlayerApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { UtilityBarComponent } from './utility-bar.component';

@Component({
  template: ` <app-utility-bar data-testid="utility-bar" /> `,
  standalone: true,
  imports: [UtilityBarComponent],
})
class HostComponent {}

const providers = [
  { provide: PlayerApiService, useValue: { search: vi.fn() } },
  { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
];

describe('UtilityBarComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, { providers });
  });

  it('renders', () => {
    expect(screen.getByTestId('utility-bar')).toBeInTheDocument();
  });

  it('renders search button for mobile', () => {
    const buttonIcon = document.querySelector('app-button-icon');
    expect(buttonIcon).toBeInTheDocument();
    expect(buttonIcon).toHaveTextContent('search');
    expect(buttonIcon).toHaveClass('sm:hidden!');
  });

  it('renders search autocomplete for desktop', () => {
    const autocomplete = document.querySelector('app-search-autocomplete');
    expect(autocomplete).toBeInTheDocument();
    expect(autocomplete).toHaveClass('hidden sm:block');
  });

  it('renders search drawer for mobile', () => {
    const drawer = document.querySelector('app-search-drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass('sm:hidden!');
  });

  it('opens search drawer when search button is clicked', async () => {
    const drawer = document.querySelector('.app-search-drawer');
    expect(drawer).not.toHaveClass('translate-y-0');

    await userEvent.click(document.querySelector('app-button-icon')!);

    expect(drawer).toHaveClass('translate-y-0');
  });

  it('renders user session', () => {
    expect(document.querySelector('app-user-session')).toBeInTheDocument();
  });
});
