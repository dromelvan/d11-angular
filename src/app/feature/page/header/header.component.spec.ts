import { Component, signal } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { HeaderComponent } from './header.component';

@Component({
  template: ` <app-header data-testid="header" />`,
  standalone: true,
  imports: [HeaderComponent],
})
class HostComponent {}

function mockRouterService(hasStack: boolean) {
  return {
    hasStack: signal(hasStack),
    section: signal(null),
    navigateToPrevious: vi.fn().mockResolvedValue(true),
  };
}

describe('HeaderComponent', () => {
  describe('renders', () => {
    it('renders', async () => {
      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: mockRouterService(false) }],
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders router section', async () => {
      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: mockRouterService(false) }],
      });

      const routerSection = document.querySelector('app-router-section');
      expect(routerSection).toBeInTheDocument();
      expect(routerSection).toHaveClass('lg:hidden');
    });

    it('renders navbar link', async () => {
      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: mockRouterService(false) }],
      });

      const navbarLink = document.querySelector('app-navbar-link');
      expect(navbarLink).toBeInTheDocument();
      expect(navbarLink).toHaveClass('hidden lg:block');
    });

    it('renders utility bar', async () => {
      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: mockRouterService(false) }],
      });

      expect(document.querySelector('app-utility-bar')).toBeInTheDocument();
    });
  });

  // Stack -------------------------------------------------------------------------------

  describe('no stack', () => {
    let component: Element;

    beforeEach(async () => {
      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: mockRouterService(false) }],
      });
      component = document.querySelector('.flex.flex-1')!;
    });

    it('renders D11 lion image', () => {
      expect(component.querySelector('app-d11-lion-light-img')).toBeInTheDocument();
    });

    it('does not render chevron', () => {
      expect(component.querySelector('app-icon')).not.toBeInTheDocument();
    });
  });

  describe('has stack', () => {
    let component: Element;
    let routerService: ReturnType<typeof mockRouterService>;

    beforeEach(async () => {
      routerService = mockRouterService(true);
      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: routerService }],
      });
      component = document.querySelector('.flex.flex-1')!;
    });

    it('renders chevron', () => {
      expect(component.querySelector('app-icon')).toBeInTheDocument();
    });

    it('does not render D11 lion image', () => {
      expect(component.querySelector('app-d11-lion-light-img')).not.toBeInTheDocument();
    });

    it('calls navigateToPrevious on chevron click', async () => {
      await userEvent.click(document.querySelector('.flex.flex-1 app-icon')!);

      expect(routerService.navigateToPrevious).toHaveBeenCalledOnce();
    });
  });
});
