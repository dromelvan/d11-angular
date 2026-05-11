import {
  fakeD11TeamBase,
  fakeD11TeamSeasonStat,
  fakePlayerSeasonStat,
  fakePosition,
} from '@app/test';
import { POSITION_IDS } from '@app/core/api';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { D11TeamHeaderComponent } from './d11-team-header.component';

describe('D11TeamHeaderComponent', () => {
  it('renders d11 team name', async () => {
    const d11Team = fakeD11TeamBase();

    await render(D11TeamHeaderComponent, { inputs: { d11Team, d11TeamSeasonStat: undefined } });

    expect(screen.getByText(d11Team.name)).toBeInTheDocument();
  });

  it('renders d11 team image', async () => {
    const d11Team = fakeD11TeamBase();

    await render(D11TeamHeaderComponent, { inputs: { d11Team, d11TeamSeasonStat: undefined } });

    expect(screen.getByAltText(d11Team.name)).toBeInTheDocument();
  });

  it('renders ranking and points when d11 team season stat is provided', async () => {
    const d11Team = fakeD11TeamBase();
    const d11TeamSeasonStat = fakeD11TeamSeasonStat();

    await render(D11TeamHeaderComponent, { inputs: { d11Team, d11TeamSeasonStat } });

    expect(screen.getByTestId('ranking')).toHaveTextContent(String(d11TeamSeasonStat.ranking));
    expect(screen.getByTestId('points')).toHaveTextContent(String(d11TeamSeasonStat.points));
  });

  it('renders form dots when formMatchPoints has values', async () => {
    const d11Team = fakeD11TeamBase();
    const d11TeamSeasonStat = fakeD11TeamSeasonStat();
    d11TeamSeasonStat.formMatchPoints = [3, 1, 0];

    await render(D11TeamHeaderComponent, { inputs: { d11Team, d11TeamSeasonStat } });

    const dots = document.querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(3);
  });

  it('does not render form dots when formMatchPoints is empty', async () => {
    const d11Team = fakeD11TeamBase();
    const d11TeamSeasonStat = fakeD11TeamSeasonStat();
    d11TeamSeasonStat.formMatchPoints = [];

    await render(D11TeamHeaderComponent, { inputs: { d11Team, d11TeamSeasonStat } });

    expect(document.querySelector('.rounded-full')).not.toBeInTheDocument();
  });

  it('does not render stats when d11 team season stat is undefined', async () => {
    const d11Team = fakeD11TeamBase();

    await render(D11TeamHeaderComponent, { inputs: { d11Team, d11TeamSeasonStat: undefined } });

    expect(document.querySelector('[data-testid="ranking"]')).not.toBeInTheDocument();
  });

  it('renders Lineup and Value headers when player season stats are provided', async () => {
    const d11Team = fakeD11TeamBase();
    const position = { ...fakePosition(), id: POSITION_IDS.KEEPER, maxCount: 1, sortOrder: 1 };
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [stat],
        positions: [position],
      },
    });

    expect(screen.getByText('Lineup')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders position count in lineup', async () => {
    const d11Team = fakeD11TeamBase();
    const position = { ...fakePosition(), id: POSITION_IDS.KEEPER, maxCount: 1, sortOrder: 1 };
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [stat],
        positions: [position],
      },
    });

    expect(screen.getByTestId('lineup').textContent?.trim()).toContain('1');
  });

  it('applies text-error to position count when count does not match maxCount', async () => {
    const d11Team = fakeD11TeamBase();
    const position = { ...fakePosition(), id: POSITION_IDS.KEEPER, maxCount: 2, sortOrder: 1 };
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [stat],
        positions: [position],
      },
    });

    expect(screen.getByTestId('lineup').querySelector('.text-error')).toBeInTheDocument();
  });

  it('does not apply text-error to position count when count matches maxCount', async () => {
    const d11Team = fakeD11TeamBase();
    const position = { ...fakePosition(), id: POSITION_IDS.KEEPER, maxCount: 1, sortOrder: 1 };
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [stat],
        positions: [position],
      },
    });

    expect(screen.getByTestId('lineup').querySelector('.text-error')).not.toBeInTheDocument();
  });

  it('does not render positions with maxCount 0 in lineup', async () => {
    const d11Team = fakeD11TeamBase();
    const keeperPosition = {
      ...fakePosition(),
      id: POSITION_IDS.KEEPER,
      maxCount: 1,
      sortOrder: 1,
    };
    const inactivePosition = {
      ...fakePosition(),
      id: POSITION_IDS.FORWARD,
      maxCount: 0,
      sortOrder: 2,
    };
    const keeperStat = fakePlayerSeasonStat();
    keeperStat.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [keeperStat],
        positions: [keeperPosition, inactivePosition],
      },
    });

    expect(screen.getByTestId('lineup').querySelector('.opacity-50')).not.toBeInTheDocument();
  });

  it('sorts positions by sortOrder in lineup', async () => {
    const d11Team = fakeD11TeamBase();
    const forwardPosition = {
      ...fakePosition(),
      id: POSITION_IDS.FORWARD,
      maxCount: 2,
      sortOrder: 1,
    };
    const keeperPosition = {
      ...fakePosition(),
      id: POSITION_IDS.KEEPER,
      maxCount: 1,
      sortOrder: 2,
    };
    const forwardStat1 = fakePlayerSeasonStat();
    forwardStat1.position.id = POSITION_IDS.FORWARD;
    const forwardStat2 = fakePlayerSeasonStat();
    forwardStat2.position.id = POSITION_IDS.FORWARD;
    const keeperStat = fakePlayerSeasonStat();
    keeperStat.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [forwardStat1, forwardStat2, keeperStat],
        positions: [forwardPosition, keeperPosition],
      },
    });

    const countSpans = Array.from(
      screen.getByTestId('lineup').querySelectorAll<HTMLElement>('span:not(.opacity-50)'),
    );
    expect(countSpans[0].textContent).toBe('2');
    expect(countSpans[1].textContent).toBe('1');
  });

  it('shows total fee as value', async () => {
    const d11Team = fakeD11TeamBase();
    const position = { ...fakePosition(), id: POSITION_IDS.KEEPER, maxCount: 1, sortOrder: 1 };
    const stat1 = { ...fakePlayerSeasonStat(), fee: 100 };
    stat1.position.id = POSITION_IDS.KEEPER;
    const stat2 = { ...fakePlayerSeasonStat(), fee: 150 };
    stat2.position.id = POSITION_IDS.KEEPER;

    await render(D11TeamHeaderComponent, {
      inputs: {
        d11Team,
        d11TeamSeasonStat: undefined,
        playerSeasonStats: [stat1, stat2],
        positions: [position],
      },
    });

    expect(screen.getByTestId('value').textContent).toContain('25');
  });

  it('does not render lineup and value when player season stats are empty', async () => {
    const d11Team = fakeD11TeamBase();

    await render(D11TeamHeaderComponent, {
      inputs: { d11Team, d11TeamSeasonStat: undefined, playerSeasonStats: [], positions: [] },
    });

    expect(document.querySelector('[data-testid="lineup"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-testid="value"]')).not.toBeInTheDocument();
  });
});
