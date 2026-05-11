import { fakeD11TeamBase } from '@app/test';
import { render } from '@testing-library/angular';
import { expect } from 'vitest';
import { D11TeamHeaderCardComponent } from './d11-team-header-card.component';

describe('D11TeamHeaderCardComponent', () => {
  it('renders', async () => {
    const d11Team = fakeD11TeamBase();

    await render(D11TeamHeaderCardComponent, { inputs: { d11Team, d11TeamSeasonStat: undefined } });

    expect(document.querySelector('.app-d11-team-header-card')).toBeInTheDocument();
  });

  it('does not render when d11 team is undefined', async () => {
    await render(D11TeamHeaderCardComponent, {
      inputs: { d11Team: undefined, d11TeamSeasonStat: undefined },
    });

    expect(document.querySelector('.app-d11-team-header-card')).not.toBeInTheDocument();
  });
});
