import { Component } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, vi } from 'vitest';
import { NavbarIconComponent } from './navbar-icon.component';

const mockRouterService = { navigateToCurrentMatchWeek: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

@Component({
  template: `<app-navbar-icon data-testid="navbar-icon" />`,
  standalone: true,
  imports: [NavbarIconComponent],
})
class HostComponent {}

describe('NavbarIconComponent', () => {
  let component: HTMLElement;

  beforeEach(async () => {
    vi.clearAllMocks();
    await render(HostComponent, { providers });
    component = screen.getByTestId('navbar-icon');
  });

  it('renders', () => {
    expect(component).toBeInTheDocument();
    expect(component.querySelector('nav')).toHaveClass('lg:hidden');
  });

  it('renders Matches link', () => {
    expect(screen.getByText('Matches')).toBeInTheDocument();
  });

  it('renders other nav links', () => {
    for (const label of ['Tables', 'Players', 'Transfers', 'More']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('calls navigateToCurrentMatchWeek on Matches click', async () => {
    await userEvent.click(screen.getByText('Matches'));

    expect(mockRouterService.navigateToCurrentMatchWeek).toHaveBeenCalledOnce();
  });
});
