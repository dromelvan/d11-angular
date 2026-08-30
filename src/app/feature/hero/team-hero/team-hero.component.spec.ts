import { render, screen } from '@testing-library/angular';
import { fakeTeam } from '@app/test';
import { TeamHeroComponent } from './team-hero.component';

describe('TeamHeroComponent', () => {
  it('renders stadium name', async () => {
    const team = fakeTeam();

    await render(TeamHeroComponent, { inputs: { team } });

    expect(screen.getByTestId('stadium-name')).toHaveTextContent(team.stadium.name);
  });

  it('renders stadium city', async () => {
    const team = fakeTeam();

    await render(TeamHeroComponent, { inputs: { team } });

    expect(screen.getByTestId('stadium-city')).toHaveTextContent(team.stadium.city);
  });

  it('renders capacity formatted', async () => {
    const team = { ...fakeTeam(), stadium: { ...fakeTeam().stadium, capacity: 50000 } };

    await render(TeamHeroComponent, { inputs: { team } });

    expect(screen.getByText(/50,000/)).toBeInTheDocument();
  });

  it('renders established year', async () => {
    const team = { ...fakeTeam(), established: 1892 };

    await render(TeamHeroComponent, { inputs: { team } });

    expect(screen.getByTestId('established')).toHaveTextContent('1892');
  });

  it('renders url as a link', async () => {
    const team = { ...fakeTeam(), url: 'https://example.com' };

    await render(TeamHeroComponent, { inputs: { team } });

    const link = screen.getByTestId('url');
    expect(link).toHaveTextContent('https://example.com');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
