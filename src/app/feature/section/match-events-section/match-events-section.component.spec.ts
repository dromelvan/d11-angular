import { render, screen } from '@testing-library/angular';
import { MatchEventsSectionComponent } from './match-events-section.component';
import { MatchEvent } from '@app/shared/model';
import { fakePlayerBase } from '@app/test/faker-util';

const event = (overrides: Partial<MatchEvent> = {}): MatchEvent => ({
  team: 'home',
  type: 'goal',
  time: 45,
  player: fakePlayerBase(),
  ...overrides,
});

describe('MatchEventsSectionComponent', () => {
  it('renders the section header', async () => {
    await render(MatchEventsSectionComponent, { inputs: { events: [event()] } });

    expect(screen.getByText('Match Events')).toBeInTheDocument();
  });

  it('renders player name', async () => {
    const player = fakePlayerBase();

    await render(MatchEventsSectionComponent, { inputs: { events: [event({ player })] } });

    expect(screen.getByText(player.name)).toBeInTheDocument();
  });

  it('renders event time', async () => {
    await render(MatchEventsSectionComponent, { inputs: { events: [event({ time: 78 })] } });

    expect(screen.getByText("78'")).toBeInTheDocument();
  });

  it('renders multiple events', async () => {
    const player1 = fakePlayerBase();
    const player2 = fakePlayerBase();

    await render(MatchEventsSectionComponent, {
      inputs: {
        events: [event({ time: 10, player: player1 }), event({ time: 20, player: player2 })],
      },
    });

    expect(screen.getByText(player1.name)).toBeInTheDocument();
    expect(screen.getByText(player2.name)).toBeInTheDocument();
  });

  it('reverses layout for away team events', async () => {
    const { container } = await render(MatchEventsSectionComponent, {
      inputs: { events: [event({ team: 'away' })] },
    });

    expect(container.querySelector('.flex-row-reverse')).toBeInTheDocument();
  });

  describe('event types', () => {
    it('renders goal icon for goal', async () => {
      await render(MatchEventsSectionComponent, { inputs: { events: [event({ type: 'goal' })] } });

      expect(screen.getByText('sports_and_outdoors')).toBeInTheDocument();
      expect(screen.queryByText('(P)')).not.toBeInTheDocument();
      expect(screen.queryByText('(OG)')).not.toBeInTheDocument();
    });

    it('renders (P) tag and goal icon for penalty', async () => {
      await render(MatchEventsSectionComponent, {
        inputs: { events: [event({ type: 'penalty' })] },
      });

      expect(screen.getByText('(P)')).toBeInTheDocument();
      expect(screen.getByText('sports_and_outdoors')).toBeInTheDocument();
    });

    it('renders (OG) tag for own goal', async () => {
      await render(MatchEventsSectionComponent, {
        inputs: { events: [event({ type: 'ownGoal' })] },
      });

      expect(screen.getByText('(OG)')).toBeInTheDocument();
    });

    it('renders red card icon for red card', async () => {
      await render(MatchEventsSectionComponent, {
        inputs: { events: [event({ type: 'redCard' })] },
      });

      expect(screen.getByText('crop_portrait')).toBeInTheDocument();
    });
  });
});
