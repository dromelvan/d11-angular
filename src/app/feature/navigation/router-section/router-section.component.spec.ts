import { Component, signal } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { RouterSectionComponent } from './router-section.component';

@Component({
  template: `<app-router-section />`,
  standalone: true,
  imports: [RouterSectionComponent],
})
class HostComponent {}

describe('RouterSectionComponent', () => {
  it('renders', async () => {
    const mockRouterService = { section: signal<string | null | undefined>(undefined) };
    await render(HostComponent, {
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });

    expect(document.querySelector('app-router-section')).toBeInTheDocument();
  });

  it('renders D11 when section is undefined', async () => {
    const mockRouterService = { section: signal<string | null | undefined>(undefined) };
    await render(HostComponent, {
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });

    expect(screen.getByText('D11')).toBeInTheDocument();
  });

  it('renders D11 when section is null', async () => {
    const mockRouterService = { section: signal<string | null | undefined>(null) };
    await render(HostComponent, {
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });

    expect(screen.getByText('D11')).toBeInTheDocument();
  });

  it('renders section value', async () => {
    const mockRouterService = { section: signal<string | null | undefined>('Match Week') };
    await render(HostComponent, {
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });

    expect(screen.getByText('Match Week')).toBeInTheDocument();
  });
});
