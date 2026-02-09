import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect } from 'vitest';
import { NavbarLinkComponent } from './navbar-link.component';

@Component({
  template: ` <app-navbar-link data-testid="navbar-link" /> `,
  standalone: true,
  imports: [NavbarLinkComponent],
})
class HostComponent {}

describe('NavbarLinkComponent', () => {
  let component: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    await render(HostComponent, {
      providers: [],
    });

    component = screen.getByTestId('navbar-link');
    user = userEvent.setup();
  });

  it('renders', async () => {
    expect(component).toBeInTheDocument();

    const nav = component.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('hidden lg:flex');
  });

  it('renders links', () => {
    const items = [
      { label: 'Matches', url: '#' },
      { label: 'Tables', url: '#' },
      { label: 'Players', url: '#' },
      { label: 'Transfers', url: '#' },
    ];

    for (const item of items) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.url);
    }
  });

  it('renders dropdown trigger', () => {
    const link = screen.getByRole('link', { name: /More/i });
    expect(link).toBeInTheDocument();
    expect(link.parentElement!.querySelector('.pi-chevron-down')).toBeInTheDocument();
  });

  it('renders dropdown items', async () => {
    const link = screen.getByRole('link', { name: /More/i });
    const items = [
      { label: 'D11 Teams', icon: '.pi-building' },
      { label: 'Rules', icon: '.pi-users' },
      { label: 'History', icon: '.pi-clock' },
      { label: 'Statistics', icon: '.pi-chart-bar' },
      { label: 'About', icon: '.pi-info-circle' },
    ];

    await user.click(link);

    for (const item of items) {
      const parent = screen.getByText(item.label).parentElement;

      expect(parent).toBeInTheDocument();
      expect(parent!.querySelector(item.icon)).toBeInTheDocument();
    }
  });
});
