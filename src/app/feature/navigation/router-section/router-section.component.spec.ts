import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { RouterSectionComponent } from './router-section.component';

@Component({
  template: ` <app-router-section data-testid="navbar-link" /> `,
  standalone: true,
  imports: [RouterSectionComponent],
})
class HostComponent {}

describe('RouterSectionComponent', () => {
  it('renders', async () => {
    await render(HostComponent, {});

    const component = screen.getByTestId('navbar-link');

    expect(component).toBeInTheDocument();
  });
});
