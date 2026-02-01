import { AvatarComponent } from './avatar.component';
import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { environment } from '../../../environments/environment';

const id = 42;
const resource = 'test-resource';

@Component({
  template: `
    <app-avatar data-testid="default-extension" [resource]="resource" [id]="id" />
    <app-avatar data-testid="set-extension" [resource]="resource" [id]="id" extension="jpg" />
    <app-avatar data-testid="default-size" [resource]="resource" [id]="id" />
    <app-avatar data-testid="set-size" [resource]="resource" [id]="id" size="large" />
  `,
  standalone: true,
  imports: [AvatarComponent],
})
class HostComponent {
  resource = resource;
  id = id;
}

describe('AvatarComponent', () => {
  beforeEach(async () => {
    await render(HostComponent, {});
  });

  it('renders default extension', async () => {
    const avatar = screen.getByTestId('default-extension');

    expect(avatar).toBeInTheDocument();

    const img = avatar.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/${id}.png`);
  });

  it('renders set extension', async () => {
    const avatar = screen.getByTestId('set-extension');

    expect(avatar).toBeInTheDocument();

    const img = avatar.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/${id}.jpg`);
  });

  it('does not render default size attribute', async () => {
    const avatar = screen.getByTestId('default-size');

    expect(avatar).toBeInTheDocument();

    const pAvatar = avatar.querySelector('p-avatar');
    expect(pAvatar).toBeInTheDocument();

    const dataP = pAvatar?.getAttribute('data-p');
    expect(dataP).toBe('circle');
  });

  it('renders set size attribute', async () => {
    const avatar = screen.getByTestId('set-size');

    expect(avatar).toBeInTheDocument();

    const pAvatar = avatar.querySelector('p-avatar');
    expect(pAvatar).toBeInTheDocument();

    const dataP = pAvatar?.getAttribute('data-p');
    expect(dataP).toBe('circle large');
  });

  it('renders circle shape', async () => {
    const avatar = screen.getByTestId('default-extension');

    const pAvatar = avatar.querySelector('p-avatar');
    expect(pAvatar).toBeInTheDocument();
    expect(pAvatar).toHaveAttribute('shape', 'circle');
  });
});
