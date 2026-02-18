import { Component } from '@angular/core';
import { fakeTeamBase } from '@app/core/api/test/faker-util';
import { fireEvent, render, screen, within } from '@testing-library/angular';
import { environment } from '../../../../environments/environment';
import { ImgWidth } from '../img-width';
import { TeamImgComponent } from './team-img.component';

const width = ImgWidth.SMALL;

const team = fakeTeamBase();

@Component({
  template: ` <app-team-img data-testid="team-img" [team]="team" [width]="width" />`,
  imports: [TeamImgComponent],
})
class HostComponent {
  width = width;
  team = team;
}

describe('TeamImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent);
  });

  it('renders', () => {
    const host = screen.getByTestId('team-img');

    const img = within(host).getByRole('img') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', team.name);
    expect(img).toHaveAttribute('src', `${environment.imageHost}/images/team/${team.id}.png`);
    expect(img).toHaveAttribute('width', `${width}`);
  });

  it('renders default image on error', async () => {
    const host = screen.getByTestId('team-img');
    const img = within(host).getByRole('img') as HTMLImageElement;

    fireEvent.error(img);
    await Promise.resolve();

    expect(img.src).toContain('/images/team/default.png');
  });
});
