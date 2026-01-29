import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { ImgComponent } from './img.component';

const size = 42;
const alt = 'ImgComponent';
const src = 'img.png';

@Component({
  template: ` <app-img [size]="size" [alt]="alt" [src]="src" /> `,
  standalone: true,
  imports: [ImgComponent],
})
class HostComponent {
  size = size;
  alt = alt;
  src = src;
}

describe('ImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', alt);
    expect(img).toHaveAttribute('src', src);
    expect(img).toHaveAttribute('width', `${size}`);
    expect(img).toHaveAttribute('height', `${size}`);
    expect(img).toHaveStyle({ height: `${size}px` });
  });
});
