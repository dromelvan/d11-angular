import { Component } from '@angular/core';
import type { PlayerSeasonStat } from '@app/core/api';
import { fakePlayerSeasonStat } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerSeasonStatComponent } from './player-season-stat.component';

const renderComponent = (playerSeasonStat: PlayerSeasonStat, showInfo = false) => {
  @Component({
    template: ` <app-player-season-stat
      [playerSeasonStat]="playerSeasonStat"
      [showInfo]="showInfo"
    />`,
    standalone: true,
    imports: [PlayerSeasonStatComponent],
  })
  class HostComponent {
    playerSeasonStat = playerSeasonStat;
    showInfo = showInfo;
  }

  return render(HostComponent);
};

describe('PlayerSeasonStatComponent', () => {
  let pss: PlayerSeasonStat;

  beforeEach(async () => {
    pss = fakePlayerSeasonStat();
    await renderComponent(pss);
  });

  it('renders', () => {
    expect(document.querySelector('app-player-season-stat')).toBeInTheDocument();
  });

  it('does not render info section', async () => {
    await waitFor(() => {
      expect(screen.queryByText('Info')).not.toBeInTheDocument();
    });
  });

  it('does not render player avatar', async () => {
    await waitFor(() => {
      expect(document.querySelector('app-avatar')).not.toBeInTheDocument();
    });
  });

  it('renders D11 section header', async () => {
    await waitFor(() => {
      expect(screen.getByText('D11')).toBeInTheDocument();
    });
  });

  it('renders Appearances section header', async () => {
    await waitFor(() => {
      expect(screen.getByText('Appearances')).toBeInTheDocument();
    });
  });

  it('renders Attack section header', async () => {
    await waitFor(() => {
      expect(screen.getByText('Attack')).toBeInTheDocument();
    });
  });

  it('renders Defence section header', async () => {
    await waitFor(() => {
      expect(screen.getByText('Defence')).toBeInTheDocument();
    });
  });

  it('renders Discipline section header', async () => {
    await waitFor(() => {
      expect(screen.getByText('Discipline')).toBeInTheDocument();
    });
  });

  it('renders ranking', async () => {
    await waitFor(() => {
      expect(screen.getByText('Ranking').nextElementSibling?.textContent?.trim()).toBe(
        `#${pss.ranking}`,
      );
    });
  });

  it('renders rating', async () => {
    await waitFor(() => {
      expect(screen.getByText('Rating').nextElementSibling?.textContent?.trim()).toBe(
        (pss.rating / 100).toFixed(2),
      );
    });
  });

  it('renders man of the match', async () => {
    await waitFor(() => {
      expect(screen.getByText('Man of the Match').nextElementSibling?.textContent?.trim()).toBe(
        `${pss.manOfTheMatch}/${pss.sharedManOfTheMatch}`,
      );
    });
  });

  it('renders points', async () => {
    await waitFor(() => {
      expect(screen.getByText('Points').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.points),
      );
    });
  });

  it('renders form match points circles', async () => {
    await waitFor(() => {
      for (const pts of pss.formMatchPoints.slice(0, 5)) {
        expect(screen.getByText(String(pts))).toBeInTheDocument();
      }
    });
  });

  it('renders points per appearance', async () => {
    const expected = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(pss.pointsPerAppearance / 100);

    await waitFor(() => {
      expect(screen.getByText('Points / Appearance').nextElementSibling?.textContent?.trim()).toBe(
        expected,
      );
    });
  });

  it('renders games started', async () => {
    await waitFor(() => {
      expect(screen.getByText('Started').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.gamesStarted),
      );
    });
  });

  it('renders games substitute', async () => {
    await waitFor(() => {
      expect(screen.getByText('Substitute').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.gamesSubstitute),
      );
    });
  });

  it('renders minutes played', async () => {
    await waitFor(() => {
      expect(screen.getByText('Minutes played').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.minutesPlayed),
      );
    });
  });

  it('renders goals', async () => {
    await waitFor(() => {
      expect(screen.getByText('Goals').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.goals),
      );
    });
  });

  it('renders goal assists', async () => {
    await waitFor(() => {
      expect(screen.getByText('Assists').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.goalAssists),
      );
    });
  });

  it('renders goals conceded', async () => {
    await waitFor(() => {
      expect(screen.getByText('Goals conceded').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.goalsConceded),
      );
    });
  });

  it('renders clean sheets', async () => {
    await waitFor(() => {
      expect(screen.getByText('Clean sheets').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.cleanSheets),
      );
    });
  });

  it('renders yellow cards', async () => {
    await waitFor(() => {
      expect(screen.getByText('Yellow cards').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.yellowCards),
      );
    });
  });

  it('renders red cards', async () => {
    await waitFor(() => {
      expect(screen.getByText('Red cards').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.redCards),
      );
    });
  });

  it('renders own goals', async () => {
    await waitFor(() => {
      expect(screen.getByText('Own goals').nextElementSibling?.textContent?.trim()).toBe(
        String(pss.ownGoals),
      );
    });
  });
});

describe('PlayerSeasonStatComponent fee', () => {
  it('renders fee', async () => {
    const pss = fakePlayerSeasonStat();
    pss.fee = 150;
    await renderComponent(pss);

    await waitFor(() => {
      expect(screen.getByText('Fee').nextElementSibling?.textContent?.trim()).toBe('15.0m');
    });
  });

  it('renders dash when fee is 0', async () => {
    const pss = fakePlayerSeasonStat();
    pss.fee = 0;
    await renderComponent(pss);

    await waitFor(() => {
      expect(screen.getByText('Fee').nextElementSibling?.textContent?.trim()).toBe('–');
    });
  });
});

describe('PlayerSeasonStatComponent with showInfo', () => {
  let pss: PlayerSeasonStat;

  beforeEach(async () => {
    pss = fakePlayerSeasonStat();
    await renderComponent(pss, true);
  });

  it('renders info section', async () => {
    await waitFor(() => {
      expect(screen.getByText('Info')).toBeInTheDocument();
    });
  });

  it('renders position name', async () => {
    await waitFor(() => {
      expect(screen.getByText(pss.position.name)).toBeInTheDocument();
    });
  });

  it('renders team name', async () => {
    await waitFor(() => {
      expect(screen.getByText(pss.team.name)).toBeInTheDocument();
    });
  });

  it('renders d11 team name', async () => {
    await waitFor(() => {
      expect(screen.getByText(pss.d11Team.name)).toBeInTheDocument();
    });
  });
});
