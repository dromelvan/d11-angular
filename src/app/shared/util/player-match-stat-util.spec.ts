import {
  fakeD11MatchBase,
  fakeD11TeamBase,
  fakeMatchBase,
  fakePlayerBase,
  fakePlayerMatchStat,
  fakePosition,
  fakeTeamBase,
} from '@app/core/api/test/faker-util';
import {
  D11MatchBase,
  D11TeamBase,
  Lineup,
  MatchBase,
  PlayerMatchStat,
  TeamBase,
} from '@app/core/api';
import { describe, expect, it } from 'vitest';
import { sortByD11Team, sortByTeam } from './player-match-stat-util';

let homeTeam: TeamBase;
let awayTeam: TeamBase;
let baseMatch: MatchBase;

const fakeStat = (
  team: TeamBase,
  lineup: Lineup,
  overrides: Partial<PlayerMatchStat> = {},
): PlayerMatchStat => ({
  ...fakePlayerMatchStat(),
  match: baseMatch,
  team,
  lineup,
  substitutionOnTime: 0,
  ...overrides,
});

beforeEach(() => {
  homeTeam = fakeTeamBase();
  awayTeam = fakeTeamBase();
  baseMatch = { ...fakeMatchBase(), homeTeam, awayTeam };
});

describe('sortByTeamAndLineup', () => {
  it('filters out DID_NOT_PARTICIPATE', () => {
    const dnp = fakeStat(homeTeam, Lineup.DID_NOT_PARTICIPATE);
    const starter = fakeStat(homeTeam, Lineup.STARTING_LINEUP);
    const result = sortByTeam([dnp, starter]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(starter);
  });

  it('sorts home team before away team', () => {
    const awayStat = fakeStat(awayTeam, Lineup.STARTING_LINEUP);
    const homeStat = fakeStat(homeTeam, Lineup.STARTING_LINEUP);
    const result = sortByTeam([awayStat, homeStat]);

    expect(result[0]).toBe(homeStat);
    expect(result[1]).toBe(awayStat);
  });

  it('sorts starters before substitutes within the same team', () => {
    const sub = fakeStat(homeTeam, Lineup.SUBSTITUTE, { substitutionOnTime: 60 });
    const starter = fakeStat(homeTeam, Lineup.STARTING_LINEUP);
    const result = sortByTeam([sub, starter]);

    expect(result[0]).toBe(starter);
    expect(result[1]).toBe(sub);
  });

  it('sorts active substitutes before unused substitutes', () => {
    const unused = fakeStat(homeTeam, Lineup.SUBSTITUTE, { substitutionOnTime: 0 });
    const active = fakeStat(homeTeam, Lineup.SUBSTITUTE, { substitutionOnTime: 70 });
    const result = sortByTeam([unused, active]);

    expect(result[0]).toBe(active);
    expect(result[1]).toBe(unused);
  });

  it('sorts active substitutes by substitutionOnTime ascending', () => {
    const late = fakeStat(homeTeam, Lineup.SUBSTITUTE, { substitutionOnTime: 80 });
    const early = fakeStat(homeTeam, Lineup.SUBSTITUTE, { substitutionOnTime: 55 });
    const result = sortByTeam([late, early]);

    expect(result[0]).toBe(early);
    expect(result[1]).toBe(late);
  });

  it('sorts starters by position sortOrder', () => {
    const position1 = { ...fakePosition(), sortOrder: 1 };
    const position2 = { ...fakePosition(), sortOrder: 3 };
    const defender = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position: position1 });
    const forward = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position: position2 });
    const result = sortByTeam([forward, defender]);

    expect(result[0]).toBe(defender);
    expect(result[1]).toBe(forward);
  });

  it('sorts by player properties within same position', () => {
    const position = { ...fakePosition(), sortOrder: 1 };
    const player5 = { ...fakePlayerBase(), lastName: 'Zzz', firstName: 'Zzz', id: 1 };
    const player4 = { ...fakePlayerBase(), lastName: 'Sss', firstName: 'Jjj', id: 99 };
    const player3 = { ...fakePlayerBase(), lastName: 'Sss', firstName: 'Jjj', id: 1 };
    const player2 = { ...fakePlayerBase(), lastName: 'Sss', firstName: 'Aaa', id: 2 };
    const player1 = { ...fakePlayerBase(), lastName: 'Aaa', firstName: 'Ttt', id: 2 };
    const stat5 = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position, player: player5 });
    const stat4 = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position, player: player4 });
    const stat3 = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position, player: player3 });
    const stat2 = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position, player: player2 });
    const stat1 = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { position, player: player1 });
    const result = sortByTeam([stat5, stat4, stat3, stat2, stat1]);

    expect(result[0]).toBe(stat1);
    expect(result[1]).toBe(stat2);
    expect(result[2]).toBe(stat3);
    expect(result[3]).toBe(stat4);
    expect(result[4]).toBe(stat5);
  });

  it('returns empty result for empty input', () => {
    expect(sortByTeam([])).toEqual([]);
  });
});

describe('sortByD11TeamAndLineup', () => {
  let homeD11Team: D11TeamBase;
  let awayD11Team: D11TeamBase;
  let baseD11Match: D11MatchBase;

  beforeEach(() => {
    homeD11Team = fakeD11TeamBase();
    awayD11Team = fakeD11TeamBase();
    baseD11Match = { ...fakeD11MatchBase(), homeD11Team, awayD11Team };
  });

  it('filters out DID_NOT_PARTICIPATE', () => {
    const dnp = fakeStat(homeTeam, Lineup.DID_NOT_PARTICIPATE, { d11Team: homeD11Team });
    const starter = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { d11Team: homeD11Team });
    const result = sortByD11Team(baseD11Match, [dnp, starter]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(starter);
  });

  it('sorts home d11Team before away d11Team', () => {
    const awayStat = fakeStat(awayTeam, Lineup.STARTING_LINEUP, { d11Team: awayD11Team });
    const homeStat = fakeStat(homeTeam, Lineup.STARTING_LINEUP, { d11Team: homeD11Team });
    const result = sortByD11Team(baseD11Match, [awayStat, homeStat]);

    expect(result[0]).toBe(homeStat);
    expect(result[1]).toBe(awayStat);
  });

  it('does not separate starters and substitutes within the same d11Team', () => {
    const position1 = { ...fakePosition(), sortOrder: 1 };
    const position2 = { ...fakePosition(), sortOrder: 2 };
    const sub = fakeStat(homeTeam, Lineup.SUBSTITUTE, {
      d11Team: homeD11Team,
      position: position2,
    });
    const starter = fakeStat(homeTeam, Lineup.STARTING_LINEUP, {
      d11Team: homeD11Team,
      position: position1,
    });
    const result = sortByD11Team(baseD11Match, [sub, starter]);

    expect(result[0]).toBe(starter);
    expect(result[1]).toBe(sub);
  });

  it('sorts by position sortOrder within same d11Team', () => {
    const position1 = { ...fakePosition(), sortOrder: 1 };
    const position2 = { ...fakePosition(), sortOrder: 3 };
    const defender = fakeStat(homeTeam, Lineup.STARTING_LINEUP, {
      d11Team: homeD11Team,
      position: position1,
    });
    const forward = fakeStat(homeTeam, Lineup.STARTING_LINEUP, {
      d11Team: homeD11Team,
      position: position2,
    });
    const result = sortByD11Team(baseD11Match, [forward, defender]);

    expect(result[0]).toBe(defender);
    expect(result[1]).toBe(forward);
  });

  it('returns empty result for empty input', () => {
    expect(sortByD11Team(baseD11Match, [])).toEqual([]);
  });
});
