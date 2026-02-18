import { Component } from '@angular/core';
import { fakePlayer } from '@app/core/api/test/faker-util';
import { fireEvent, render, screen, within } from '@testing-library/angular';
import { environment } from '../../../../environments/environment';
import { ImgWidth } from '../img-width';
import { PlayerImgComponent } from './player-img.component';

const width = ImgWidth.SMALL;

const player = fakePlayer();

@Component({
  template: ` <app-player-img data-testid="player-img" [player]="player" [width]="width" />`,
  imports: [PlayerImgComponent],
})
class HostComponent {
  width = width;
  player = player;
}

describe('PlayerImgComponent', () => {
  beforeEach(async () => {
    await render(HostComponent);
  });

  it('renders', () => {
    const host = screen.getByTestId('player-img');

    const img = within(host).getByRole('img') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', player.name);
    expect(img).toHaveAttribute('src', `${environment.imageHost}/images/player/${player.id}.png`);
    expect(img).toHaveAttribute('width', `${width}`);
  });

  it('renders default image on error', async () => {
    const host = screen.getByTestId('player-img');
    const img = within(host).getByRole('img') as HTMLImageElement;

    fireEvent.error(img);
    await Promise.resolve();

    expect(img.src).toContain('/images/player/default.png');
  });
});
