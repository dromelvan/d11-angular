import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlayerDialogMatchStatComponent } from './player-dialog-match-stat.component';
import { fakeD11TeamBase, fakeMatchBase, fakePlayerMatchStat, fakePosition } from '@app/test';
import { Lineup, Status } from '@app/core/api';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';

function fakeConfig(playerMatchStat = fakePlayerMatchStat()) {
  return {
    data: {
      current: signal(playerMatchStat),
      list: [playerMatchStat],
    },
  };
}

async function setup(playerMatchStat = fakePlayerMatchStat()) {
  const config = fakeConfig(playerMatchStat);
  await render(PlayerDialogMatchStatComponent, {
    providers: [{ provide: DynamicDialogConfig, useValue: config }],
  });
  return config;
}

describe('PlayerDialogMatchStatComponent', () => {
  describe('match info', () => {
    it('renders home team short name', async () => {
      const playerMatchStat = fakePlayerMatchStat();
      playerMatchStat.match.homeTeam.shortName = 'homeTeam';
      playerMatchStat.match.awayTeam.shortName = 'awayTeam';

      await setup(playerMatchStat);

      expect(screen.getByText(playerMatchStat.match.homeTeam.shortName)).toBeInTheDocument();
    });

    it('renders away team short name', async () => {
      const playerMatchStat = fakePlayerMatchStat();
      playerMatchStat.match.homeTeam.shortName = 'homeTeam';
      playerMatchStat.match.awayTeam.shortName = 'awayTeam';

      await setup(playerMatchStat);

      expect(screen.getByText(playerMatchStat.match.awayTeam.shortName)).toBeInTheDocument();
    });

    it('renders stadium name', async () => {
      const playerMatchStat = fakePlayerMatchStat();

      await setup(playerMatchStat);

      expect(
        screen.getByText(
          `${playerMatchStat.match.stadium.name}, ${playerMatchStat.match.stadium.city}`,
        ),
      ).toBeInTheDocument();
    });

    it('renders elapsed', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        match: { ...fakeMatchBase(), status: Status.FINISHED, elapsed: 'test-elapsed' },
      };

      await setup(playerMatchStat);

      expect(screen.getByText(playerMatchStat.match.elapsed)).toBeInTheDocument();
    });

    it('renders score', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        match: { ...fakeMatchBase(), status: Status.FINISHED },
      };

      await setup(playerMatchStat);

      expect(
        screen.getByText(
          `${playerMatchStat.match.homeTeamGoalsScored}\u2013${playerMatchStat.match.awayTeamGoalsScored}`,
          {
            exact: false,
          },
        ),
      ).toBeInTheDocument();
    });
  });

  describe('D11 team', () => {
    it('renders D11 team when not dummy', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        d11Team: { ...fakeD11TeamBase(), dummy: false },
      };

      await setup(playerMatchStat);

      const element = screen.getByText('D11 team');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(playerMatchStat.d11Team.name);
    });

    it('does not render D11 team when dummy', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        d11Team: { ...fakeD11TeamBase(), dummy: true },
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('D11 team')).not.toBeInTheDocument();
    });
  });

  describe('position', () => {
    it('renders position', async () => {
      const playerMatchStat = fakePlayerMatchStat();

      await setup(playerMatchStat);

      const element = screen.getByText('Position');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(playerMatchStat.position.name);
    });
  });

  describe('rating', () => {
    it('renders rating', async () => {
      const playerMatchStat = fakePlayerMatchStat();

      await setup(playerMatchStat);

      const element = screen.getByText('Rating');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(
        new RatingPipe().transform(playerMatchStat.rating)!,
      );
    });

    it('does not render zero rating', async () => {
      const playerMatchStat = { ...fakePlayerMatchStat(), rating: 0 };

      await setup(playerMatchStat);

      expect(screen.queryByText('Rating')).not.toBeInTheDocument();
    });
  });

  describe('man of the match', () => {
    it('renders man of the match', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        manOfTheMatch: true,
        sharedManOfTheMatch: false,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Man of the Match');
      expect(element).toBeInTheDocument();

      const icon = element.nextElementSibling?.querySelector('app-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('icon', 'mom');

      expect(
        element.nextElementSibling?.querySelector('[icon="shared_mom"]'),
      ).not.toBeInTheDocument();
    });

    it('renders shared man of the match', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        manOfTheMatch: false,
        sharedManOfTheMatch: true,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Man of the Match');
      expect(element).toBeInTheDocument();

      const icon = element.nextElementSibling?.querySelector('app-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('icon', 'shared_mom');

      expect(element.nextElementSibling?.querySelector('[icon="mom"]')).not.toBeInTheDocument();
    });

    it('does not render non man of the match', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        manOfTheMatch: false,
        sharedManOfTheMatch: false,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Man of the Match')).not.toBeInTheDocument();
    });
  });

  describe('points', () => {
    it('renders points', async () => {
      const playerMatchStat = { ...fakePlayerMatchStat(), points: 17 };

      await setup(playerMatchStat);

      const element = screen.getByText('Points');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.points}`);
    });
  });

  describe('lineup', () => {
    it('renders message when did not participate', async () => {
      const playerMatchStat = { ...fakePlayerMatchStat(), lineup: Lineup.DID_NOT_PARTICIPATE };

      await setup(playerMatchStat);

      expect(screen.getByText('Did not participate')).toBeInTheDocument();
      expect(screen.queryByText('Unused substitute')).not.toBeInTheDocument();
      expect(screen.queryByText('Match stats')).not.toBeInTheDocument();
    });

    it('renders message when unused substitute', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.SUBSTITUTE,
        substitutionOnTime: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Did not participate')).not.toBeInTheDocument();
      expect(screen.getByText('Unused substitute')).toBeInTheDocument();
      expect(screen.queryByText('Match stats')).not.toBeInTheDocument();
    });

    it('renders match stats section when used substitute', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.SUBSTITUTE,
        substitutionOnTime: 1,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Did not participate')).not.toBeInTheDocument();
      expect(screen.queryByText('Unused substitute')).not.toBeInTheDocument();
      expect(screen.queryByText('Match stats')).toBeInTheDocument();
    });

    it('renders match stats section when started', async () => {
      const playerMatchStat = { ...fakePlayerMatchStat(), lineup: Lineup.STARTING_LINEUP };

      await setup(playerMatchStat);

      expect(screen.queryByText('Did not participate')).not.toBeInTheDocument();
      expect(screen.queryByText('Unused substitute')).not.toBeInTheDocument();
      expect(screen.getByText('Match stats')).toBeInTheDocument();
    });
  });

  describe('match stats', () => {
    it('renders goals', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        goals: 2,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Goals');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.goals}`);
    });

    it('does not render zero goals', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        goals: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Goals')).not.toBeInTheDocument();
    });

    it('renders assists', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        goalAssists: 1,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Assists');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.goalAssists}`);
    });

    it('does not render zero assists', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        goalAssists: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Assists')).not.toBeInTheDocument();
    });

    it('renders own goals', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        ownGoals: 1,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Own goals');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.ownGoals}`);
    });

    it('does not render zero own goals', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        ownGoals: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Own goals')).not.toBeInTheDocument();
    });

    it('renders clean sheet', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        position: { ...fakePosition(), id: 4 },
        goalsConceded: 0,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Clean sheet');
      expect(element).toBeInTheDocument();

      const icon = element.nextElementSibling?.querySelector('app-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('icon', 'check');

      expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
    });

    it('does not render forward clean sheet', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        position: { ...fakePosition(), id: 5 },
        goalsConceded: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Clean sheet')).not.toBeInTheDocument();
      expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
    });

    it('renders goals conceded', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        position: { ...fakePosition(), id: 3, defender: true },
        goalsConceded: 1,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Goals conceded');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.goalsConceded}`);
      expect(screen.queryByText('Clean sheet')).not.toBeInTheDocument();
    });

    it('does not render non defender goals conceded', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        position: { ...fakePosition(), id: 5, defender: false },
        goalsConceded: 1,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
      expect(screen.queryByText('Clean sheet')).not.toBeInTheDocument();
    });

    it('renders yellow card', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        yellowCardTime: 45,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Yellow card');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.yellowCardTime}'`);
    });

    it('does not render zero yellow card', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        yellowCardTime: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Yellow card')).not.toBeInTheDocument();
    });

    it('renders red card', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        redCardTime: 80,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Red card');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(`${playerMatchStat.redCardTime}'`);
    });

    it('does not render zero red card', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        redCardTime: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Red card')).not.toBeInTheDocument();
    });

    it('renders substituted on', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        substitutionOnTime: 60,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Substituted on');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(
        `${playerMatchStat.substitutionOnTime}'`,
      );
    });

    it('does not render zero substituted on', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        substitutionOnTime: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Substituted on')).not.toBeInTheDocument();
    });

    it('renders substituted off', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        substitutionOffTime: 75,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Substituted off');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(
        `${playerMatchStat.substitutionOffTime}'`,
      );
    });

    it('does not render zero substituted off', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        substitutionOffTime: 0,
      };

      await setup(playerMatchStat);

      expect(screen.queryByText('Substituted off')).not.toBeInTheDocument();
    });
  });

  describe('minutes played', () => {
    it('renders full game played', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        substitutionOffTime: 0,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Minutes played');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent('90');
    });

    it('renders substituted off played', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.STARTING_LINEUP,
        substitutionOffTime: 60,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Minutes played');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(
        `${playerMatchStat.substitutionOffTime}`,
      );
    });

    it('renders substituted on played', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.SUBSTITUTE,
        substitutionOnTime: 60,
        substitutionOffTime: 0,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Minutes played');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(
        `${90 - playerMatchStat.substitutionOnTime}`,
      );
    });

    it('renders substituted on and off played', async () => {
      const playerMatchStat = {
        ...fakePlayerMatchStat(),
        lineup: Lineup.SUBSTITUTE,
        substitutionOnTime: 60,
        substitutionOffTime: 70,
      };

      await setup(playerMatchStat);

      const element = screen.getByText('Minutes played');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent(
        `${playerMatchStat.substitutionOffTime - playerMatchStat.substitutionOnTime}`,
      );
    });
  });
});
