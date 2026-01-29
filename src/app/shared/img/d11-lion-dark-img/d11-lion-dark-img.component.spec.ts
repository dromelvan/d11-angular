import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { D11LionDarkImgComponent } from './d11-lion-dark-img.component';

const size = 42;

@Component({
  template: ` <app-d11-lion-dark-img [size]="size" /> `,
  standalone: true,
  imports: [D11LionDarkImgComponent],
})
class HostComponent {
  size = size;
}

describe('D11LionDarkImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'D11');
    expect(img).toHaveAttribute('src', '/images/d11-lion-dark.png');
    expect(img).toHaveAttribute('width', `${size}`);
    expect(img).toHaveAttribute('height', `${size}`);
    expect(img).toHaveStyle({ height: `${size}px` });
  });
});
