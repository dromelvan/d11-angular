import { render } from '@testing-library/angular';
import { fakeD11TeamBase } from '@app/test';
import { D11TeamHeroComponent } from './d11-team-hero.component';

describe('D11TeamHeroComponent', () => {
  it('renders d11 team image', async () => {
    const d11Team = fakeD11TeamBase();

    const { container } = await render(D11TeamHeroComponent, { inputs: { d11Team } });

    expect(container.querySelector('app-d11-team-img')).toBeInTheDocument();
  });
});
