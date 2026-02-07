import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { HeaderComponent } from '@app/feature/page/header/header.component';

@Component({
  template: ` <app-header data-testid="header" /> `,
  standalone: true,
  imports: [HeaderComponent, HeaderComponent],
})
class HostComponent {}

describe('HeaderComponent', () => {
  it('renders', async () => {
    await render(HostComponent, {});

    const component = screen.getByTestId('header');

    expect(component).toBeInTheDocument();

    const icon = component.querySelector('app-d11-lion-light-img');
    expect(icon).toBeInTheDocument();

    const routerSection = component.querySelector('app-router-section');
    expect(routerSection).toBeInTheDocument();
    expect(routerSection).toHaveClass('lg:hidden');

    const navbarLink = component.querySelector('app-navbar-link');
    expect(navbarLink).toBeInTheDocument();
    expect(navbarLink).toHaveClass('hidden lg:block');

    const utilityBar = component.querySelector('app-utility-bar');
    expect(utilityBar).toBeInTheDocument();
  });
});
