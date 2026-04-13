import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { MorePageComponent } from './more-page.component';

@Component({
  template: ` <app-more-page />`,
  standalone: true,
  imports: [MorePageComponent],
})
class HostComponent {}

describe('MorePageComponent', () => {
  beforeEach(async () => {
    await render(HostComponent);
  });

  it('renders', () => {
    expect(document.querySelector('app-more-page')).toBeInTheDocument();
  });

  it('renders the page header', () => {
    expect(screen.getByText('More')).toBeInTheDocument();
  });
});
