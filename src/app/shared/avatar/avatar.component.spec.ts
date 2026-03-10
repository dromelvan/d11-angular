import { AvatarComponent } from './avatar.component';
import { Component } from '@angular/core';
import { render, RenderResult, screen } from '@testing-library/angular';
import { environment } from '../../../environments/environment';

const id = 42;
const resource = 'test-resource';

@Component({
  template: `
    <app-avatar data-testid="default-extension" [resource]="resource" [id]="id" />
    <app-avatar data-testid="set-extension" [resource]="resource" [id]="id" extension="jpg" />
    <app-avatar data-testid="default-size" [resource]="resource" [id]="id" />
    <app-avatar data-testid="set-size" [resource]="resource" [id]="id" size="large" />
    <app-avatar data-testid="2xlarge-size" [resource]="resource" [id]="id" size="2xlarge" />
  `,
  standalone: true,
  imports: [AvatarComponent],
})
class HostComponent {
  resource = resource;
  id = id;
}

describe('AvatarComponent', () => {
  describe('static rendering', () => {
    let renderResult: RenderResult<HostComponent, HostComponent>;

    beforeEach(async () => {
      renderResult = await render(HostComponent, {});
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

    it('renders 2xlarge size as xlarge with override classes', async () => {
      const avatar = screen.getByTestId('2xlarge-size');

      expect(avatar).toBeInTheDocument();

      const pAvatar = avatar.querySelector('p-avatar');
      expect(pAvatar).toBeInTheDocument();

      const dataP = pAvatar?.getAttribute('data-p');
      expect(dataP).toBe('circle xlarge');

      expect(pAvatar).toHaveClass('h-25!');
      expect(pAvatar).toHaveClass('w-25!');
    });

    it('renders circle shape', async () => {
      const avatar = screen.getByTestId('default-extension');

      const pAvatar = avatar.querySelector('p-avatar');
      expect(pAvatar).toBeInTheDocument();
      expect(pAvatar).toHaveAttribute('shape', 'circle');
    });

    it('renders default image on image load error', () => {
      const { container, fixture } = renderResult;

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();

      expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/${id}.png`);

      const avatar = container.querySelector('p-avatar');
      avatar?.dispatchEvent(new Event('onImageError'));
      fixture.detectChanges();

      expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/default.png`);
    });
  });

  describe('image error reset', () => {
    let img: HTMLImageElement | null;
    let fixture: RenderResult<AvatarComponent>['fixture'];

    beforeEach(async () => {
      const result = await render(AvatarComponent, {
        inputs: { resource, id, extension: 'png' },
      });
      fixture = result.fixture;
      img = result.container.querySelector('img');

      result.container.querySelector('p-avatar')?.dispatchEvent(new Event('onImageError'));
      fixture.detectChanges();
    });

    it('resets to real image URL when id changes after an error', () => {
      expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/default.png`);

      fixture.componentRef.setInput('id', 99);
      fixture.detectChanges();

      expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/99.png`);
    });

    it('resets to real image URL when resource changes after an error', () => {
      expect(img).toHaveAttribute('src', `${environment.imageHost}/images/${resource}/default.png`);

      fixture.componentRef.setInput('resource', 'new-resource');
      fixture.detectChanges();

      expect(img).toHaveAttribute('src', `${environment.imageHost}/images/new-resource/${id}.png`);
    });
  });
});
