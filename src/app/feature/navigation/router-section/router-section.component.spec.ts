import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { render, screen, waitFor } from '@testing-library/angular';
import { expect } from 'vitest';
import { RouterSectionComponent } from './router-section.component';

@Component({ template: '', standalone: true })
class BlankComponent {}

@Component({
  template: ` <app-router-section />`,
  standalone: true,
  imports: [RouterSectionComponent],
})
class HostComponent {}

const routes = [
  { path: '', component: BlankComponent },
  { path: 'match-week', component: BlankComponent, data: { section: 'Match Week' } },
  { path: 'players', component: BlankComponent, data: { section: 'Players' } },
];

describe('RouterSectionComponent', () => {
  it('renders', async () => {
    await render(HostComponent, { providers: [provideRouter(routes)] });

    expect(document.querySelector('app-router-section')).toBeInTheDocument();
  });

  it('renders D11', async () => {
    await render(HostComponent, { providers: [provideRouter(routes)] });

    expect(screen.getByText('D11')).toBeInTheDocument();
  });

  it('renders route data section', async () => {
    await render(HostComponent, { providers: [provideRouter(routes)] });

    await TestBed.inject(Router).navigate(['/match-week']);

    await waitFor(() => expect(screen.getByText('Match Week')).toBeInTheDocument());
  });

  it('updates route data section', async () => {
    await render(HostComponent, { providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);

    await router.navigate(['/match-week']);
    await router.navigate(['/players']);

    await waitFor(() => expect(screen.getByText('Players')).toBeInTheDocument());
  });

  it('renders undefined route data section', async () => {
    await render(HostComponent, { providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);

    await router.navigate(['/match-week']);
    await router.navigate(['/']);

    await waitFor(() => expect(screen.getByText('D11')).toBeInTheDocument());
  });
});
