import { Component } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { MorePageComponent } from './more-page.component';

const mockRouterService = {
  navigateToRules: vi.fn(),
};

@Component({
  template: ` <app-more-page />`,
  standalone: true,
  imports: [MorePageComponent],
})
class HostComponent {}

describe('MorePageComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await render(HostComponent, {
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });
  });

  it('renders', () => {
    expect(document.querySelector('app-more-page')).toBeInTheDocument();
  });

  it('renders Rules button', () => {
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  it('calls navigateToRules on Rules click', async () => {
    await userEvent.click(screen.getByText('Rules'));

    expect(mockRouterService.navigateToRules).toHaveBeenCalledOnce();
  });
});
