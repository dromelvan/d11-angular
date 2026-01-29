import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { D11LionLightImgComponent } from './d11-lion-light-img.component';

const size = 42;

@Component({
  template: ` <app-d11-lion-light-img [size]="size" /> `,
  standalone: true,
  imports: [D11LionLightImgComponent],
})
class HostComponent {
  size = size;
}

describe('D11LionLightImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'D11');
    expect(img).toHaveAttribute('src', '/images/d11-lion-light.png');
    expect(img).toHaveAttribute('width', `${size}`);
    expect(img).toHaveAttribute('height', `${size}`);
    expect(img).toHaveStyle({ height: `${size}px` });
  });
});
