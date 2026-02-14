import { Component, computed, signal } from '@angular/core';
import { LoadingService } from '@app/core/loading/loading.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoadingComponent } from './loading.component';

@Component({
  template: ` <app-loading data-testid="loading-component" /> `,
  standalone: true,
  imports: [LoadingComponent],
})
class HostComponent {}

describe('LoadingComponent', () => {
  let mockLoadingService: {
    isLoading: ReturnType<typeof computed<boolean>>;
  };
  let isLoading: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    isLoading = signal(false);
    mockLoadingService = {
      isLoading: computed(() => isLoading()),
    };

    await render(HostComponent, {
      providers: [{ provide: LoadingService, useValue: mockLoadingService }],
    });
  });

  it('renders', () => {
    const component = screen.getByTestId('loading-component');
    expect(component).toBeInTheDocument();
  });

  it('does not show progress bar when not loading', () => {
    isLoading.set(false);

    const component = screen.getByTestId('loading-component');
    const progressBar = component.querySelector('p-progressbar');

    expect(progressBar).not.toBeInTheDocument();
  });

  it('shows progress bar when loading', async () => {
    isLoading.set(true);

    const component = screen.getByTestId('loading-component');

    await waitFor(() => {
      const progressBar = component.querySelector('p-progressbar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  it('toggles progress bar visibility when loading state changes', async () => {
    const component = screen.getByTestId('loading-component');

    isLoading.set(false);
    expect(component.querySelector('p-progressbar')).not.toBeInTheDocument();

    isLoading.set(true);
    await waitFor(() => {
      expect(component.querySelector('p-progressbar')).toBeInTheDocument();
    });

    isLoading.set(false);
    await waitFor(() => {
      expect(component.querySelector('p-progressbar')).not.toBeInTheDocument();
    });
  });
});
