import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from '@app/core/loading/loading.service';
import { waitFor } from '@testing-library/angular';
import { computed, signal } from '@angular/core';
import { expect } from 'vitest';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let isLoading: ReturnType<typeof signal<boolean>>;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    isLoading = signal(false);
    const mockLoadingService = { isLoading: computed(() => isLoading()) };

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [{ provide: LoadingService, useValue: mockLoadingService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    fixture.detectChanges();
  });

  it('renders', () => {
    expect(fixture.nativeElement).toBeInTheDocument();
  });

  it('does not show progress bar when not loading', () => {
    isLoading.set(false);

    expect(fixture.nativeElement.querySelector('p-progressbar')).not.toBeInTheDocument();
  });

  it('shows progress bar when loading', async () => {
    isLoading.set(true);

    await waitFor(() => {
      expect(fixture.nativeElement.querySelector('p-progressbar')).toBeInTheDocument();
    });
  });

  it('toggles progress bar visibility when loading state changes', async () => {
    isLoading.set(false);
    expect(fixture.nativeElement.querySelector('p-progressbar')).not.toBeInTheDocument();

    isLoading.set(true);
    await waitFor(() => {
      expect(fixture.nativeElement.querySelector('p-progressbar')).toBeInTheDocument();
    });

    isLoading.set(false);
    await waitFor(() => {
      expect(fixture.nativeElement.querySelector('p-progressbar')).not.toBeInTheDocument();
    });
  });
});
