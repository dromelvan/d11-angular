import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { environment } from '../../../../environments/environment';
import { CountryImgComponent } from './country-img.component';

const size = 32;
const country = { id: 1, name: 'Egypt', iso: 'EG' } as const;

@Component({
  template: ` <app-country-img data-testid="country-img" [country]="country" [size]="size" /> `,
  imports: [CountryImgComponent],
})
class HostComponent {
  size = size;
  country = country;
}

describe('CountryImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const host = screen.getByTestId('country-img');
    const img = host.querySelector('img') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', country.name);
    expect(img).toHaveAttribute(
      'src',
      `${environment.imageHost}/images/country/${country.iso}.png`,
    );
    expect(img).toHaveAttribute('width', `${size}`);
    expect(img).toHaveAttribute('height', `${size}`);
    expect(img).toHaveStyle({ height: `${size}px` });
  });
});
