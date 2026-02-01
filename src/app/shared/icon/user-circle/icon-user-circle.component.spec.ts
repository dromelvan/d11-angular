import { IconUserCircleComponent } from './icon-user-circle.component';
import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

const size = 12;

@Component({
  template: `
    <app-icon-user-circle data-testid="default-size" />
    <app-icon-user-circle data-testid="set-size" [size]="size" />
  `,
  standalone: true,
  imports: [IconUserCircleComponent],
})
class HostComponent {
  size = size;
}

describe('IconUserCircleComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, {});
  });

  it('renders default size', async () => {
    const icon = screen.getByTestId('default-size');

    expect(icon).toBeInTheDocument();

    const svg = icon.querySelector('svg');
    expect(svg).toHaveClass('size-6');

    const path = icon.querySelector('svg path');
    expect(path).toBeInTheDocument();
  });

  it('renders set size', async () => {
    const icon = screen.getByTestId('set-size');

    expect(icon).toBeInTheDocument();

    const svg = icon.querySelector('svg');
    expect(svg).toHaveClass(`size-${size}`);
  });
});
