import { Component } from '@angular/core';
import { fakeD11TeamBase } from '@app/core/api/test/faker-util';
import { fireEvent, render, screen, within } from '@testing-library/angular';
import { environment } from '../../../../environments/environment';
import { ImgWidth } from '../img-width';
import { D11TeamImgComponent } from './d11-team-img.component';

const width = ImgWidth.SMALL;

const d11Team = fakeD11TeamBase();

@Component({
  template: ` <app-d11-team-img data-testid="d11-team-img" [d11Team]="d11Team" [width]="width" />`,
  imports: [D11TeamImgComponent],
})
class HostComponent {
  width = width;
  d11Team = d11Team;
}

describe('D11TeamImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent);
  });

  it('renders', () => {
    const host = screen.getByTestId('d11-team-img');

    const img = within(host).getByRole('img') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', d11Team.name);
    expect(img).toHaveAttribute(
      'src',
      `${environment.imageHost}/images/d11-team/${d11Team.id}.png`,
    );
    expect(img).toHaveAttribute('width', `${width}`);
  });

  it('renders default image on error', async () => {
    const host = screen.getByTestId('d11-team-img');
    const img = within(host).getByRole('img') as HTMLImageElement;

    fireEvent.error(img);
    await Promise.resolve();

    expect(img.src).toContain('/images/d11-team/default.png');
  });
});
