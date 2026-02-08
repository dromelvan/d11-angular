import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { beforeEach, expect } from 'vitest';
import { NavbarIconComponent } from './navbar-icon.component';

@Component({
  template: ` <app-navbar-icon data-testid="navbar-icon" /> `,
  standalone: true,
  imports: [NavbarIconComponent],
})
class HostComponent {}

describe('NavbarIconComponent', () => {
  let component: HTMLElement;

  beforeEach(async () => {
    await render(HostComponent, {
      providers: [],
    });

    component = screen.getByTestId('navbar-icon');
  });

  it('renders', async () => {
    expect(component).toBeInTheDocument();

    const nav = component.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('lg:hidden');
  });

  it('renders links', () => {
    const items = [
      { label: 'Matches', url: '#' },
      { label: 'Tables', url: '#' },
      { label: 'Players', url: '#' },
      { label: 'Transfers', url: '#' },
      { label: 'More', url: '#' },
    ];

    for (const item of items) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.url);
    }
  });
});
