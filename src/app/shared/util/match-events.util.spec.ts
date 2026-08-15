import { D11Match, Match } from '@app/core/api';
import {
  fakeD11Match,
  fakeD11TeamBase,
  fakeGoal,
  fakeMatch,
  fakePlayerMatchStat,
  fakeTeamBase,
} from '@app/test';
import { describe, expect, it } from 'vitest';
import { d11MatchEvents, matchEvents } from './match-events.util';

describe('toMatchEvents', () => {
  describe('home goals', () => {
    it('returns a home event for each home team goal', () => {
      const match: Match = {
        ...fakeMatch(),
        homeTeamGoals: [
          { ...fakeGoal(), time: 10 },
          { ...fakeGoal(), time: 55 },
        ],
      };
      const events = matchEvents(match);
      const homeEvents = events.filter((e: { team: string }) => e.team === 'home');

      expect(homeEvents).toHaveLength(2);
    });

    it('sets type to goal for a regular goal', () => {
      const match: Match = { ...fakeMatch(), homeTeamGoals: [{ ...fakeGoal(), time: 20 }] };
      const [event] = matchEvents(match);

      expect(event.type).toBe('goal');
    });

    it('sets type to penalty for a penalty goal', () => {
      const match: Match = {
        ...fakeMatch(),
        homeTeamGoals: [{ ...fakeGoal(), time: 20, penalty: true }],
      };
      const [event] = matchEvents(match);

      expect(event.type).toBe('penalty');
    });

    it('sets type to ownGoal for an own goal', () => {
      const match: Match = {
        ...fakeMatch(),
        homeTeamGoals: [{ ...fakeGoal(), time: 20, ownGoal: true }],
      };
      const [event] = matchEvents(match);

      expect(event.type).toBe('ownGoal');
    });

    it('maps the correct player and time', () => {
      const goal = { ...fakeGoal(), time: 33 };
      const match: Match = { ...fakeMatch(), homeTeamGoals: [goal] };
      const [event] = matchEvents(match);

      expect(event.player).toBe(goal.player);
      expect(event.time).toBe(33);
    });
  });

  describe('away goals', () => {
    it('returns an away event for each away team goal', () => {
      const match: Match = {
        ...fakeMatch(),
        awayTeamGoals: [
          { ...fakeGoal(), time: 60 },
          { ...fakeGoal(), time: 80 },
        ],
      };
      const events = matchEvents(match);
      const awayEvents = events.filter((e: { team: string }) => e.team === 'away');

      expect(awayEvents).toHaveLength(2);
    });

    it('sets type to goal for a regular goal', () => {
      const match: Match = { ...fakeMatch(), awayTeamGoals: [{ ...fakeGoal(), time: 60 }] };
      const [event] = matchEvents(match);

      expect(event.type).toBe('goal');
    });

    it('sets type to penalty for a penalty goal', () => {
      const match: Match = {
        ...fakeMatch(),
        awayTeamGoals: [{ ...fakeGoal(), time: 60, penalty: true }],
      };
      const [event] = matchEvents(match);

      expect(event.type).toBe('penalty');
    });

    it('sets type to ownGoal for an own goal', () => {
      const match: Match = {
        ...fakeMatch(),
        awayTeamGoals: [{ ...fakeGoal(), time: 60, ownGoal: true }],
      };
      const [event] = matchEvents(match);

      expect(event.type).toBe('ownGoal');
    });
  });

  describe('red cards', () => {
    it('includes a red card event when redCardTime > 0', () => {
      const match = fakeMatch();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 55, team: match.homeTeam };
      const events = matchEvents(match, [pms]);

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('redCard');
      expect(events[0].time).toBe(55);
    });

    it('excludes a player when redCardTime is 0', () => {
      const match = fakeMatch();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 0, team: match.homeTeam };

      expect(matchEvents(match, [pms])).toHaveLength(0);
    });

    it('assigns team home when pms team id matches match homeTeam id', () => {
      const match = fakeMatch();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 40, team: match.homeTeam };
      const [event] = matchEvents(match, [pms]);

      expect(event.team).toBe('home');
    });

    it('assigns team away when pms team id does not match match homeTeam id', () => {
      const match = fakeMatch();
      const awayTeam = fakeTeamBase();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 70, team: awayTeam };
      const [event] = matchEvents(match, [pms]);

      expect(event.team).toBe('away');
    });

    it('maps the correct player', () => {
      const match = fakeMatch();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 60, team: match.homeTeam };
      const [event] = matchEvents(match, [pms]);

      expect(event.player).toBe(pms.player);
    });
  });

  describe('sorting', () => {
    it('returns events sorted by time ascending', () => {
      const homeTeam = fakeTeamBase();
      const match: Match = {
        ...fakeMatch(),
        homeTeam,
        homeTeamGoals: [
          { ...fakeGoal(), time: 75 },
          { ...fakeGoal(), time: 20 },
        ],
        awayTeamGoals: [{ ...fakeGoal(), time: 45 }],
      };
      const events = matchEvents(match);

      expect(events.map((e: { time: number }) => e.time)).toEqual([20, 45, 75]);
    });

    it('interleaves goals and red cards by time', () => {
      const match = fakeMatch();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 30, team: match.homeTeam };
      const matchWithGoals: Match = {
        ...match,
        homeTeamGoals: [{ ...fakeGoal(), time: 10 }],
        awayTeamGoals: [{ ...fakeGoal(), time: 55 }],
      };
      const events = matchEvents(matchWithGoals, [pms]);

      expect(events.map((e: { time: number }) => e.time)).toEqual([10, 30, 55]);
    });
  });

  describe('empty / missing data', () => {
    it('returns empty array when there are no goals or playerMatchStats', () => {
      expect(matchEvents(fakeMatch())).toEqual([]);
    });

    it('returns empty array when playerMatchStats is undefined', () => {
      expect(matchEvents(fakeMatch(), undefined)).toEqual([]);
    });

    it('returns only goals when playerMatchStats is empty', () => {
      const match: Match = { ...fakeMatch(), homeTeamGoals: [fakeGoal()] };

      expect(matchEvents(match, [])).toHaveLength(1);
    });
  });
});

describe('toD11MatchEvents', () => {
  describe('home goals', () => {
    it('returns a home event for each home team goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        homeTeamGoals: [
          { ...fakeGoal(), time: 10 },
          { ...fakeGoal(), time: 55 },
        ],
      };
      const events = d11MatchEvents(d11Match);
      const homeEvents = events.filter((e) => e.team === 'home');

      expect(homeEvents).toHaveLength(2);
    });

    it('sets type to goal for a regular goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        homeTeamGoals: [{ ...fakeGoal(), time: 20 }],
      };
      const [event] = d11MatchEvents(d11Match);

      expect(event.type).toBe('goal');
    });

    it('sets type to penalty for a penalty goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        homeTeamGoals: [{ ...fakeGoal(), time: 20, penalty: true }],
      };
      const [event] = d11MatchEvents(d11Match);

      expect(event.type).toBe('penalty');
    });

    it('sets type to ownGoal for an own goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        homeTeamGoals: [{ ...fakeGoal(), time: 20, ownGoal: true }],
      };
      const [event] = d11MatchEvents(d11Match);

      expect(event.type).toBe('ownGoal');
    });

    it('maps the correct player and time', () => {
      const goal = { ...fakeGoal(), time: 33 };
      const d11Match: D11Match = { ...fakeD11Match(), homeTeamGoals: [goal] };
      const [event] = d11MatchEvents(d11Match);

      expect(event.player).toBe(goal.player);
      expect(event.time).toBe(33);
    });
  });

  describe('away goals', () => {
    it('returns an away event for each away team goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        awayTeamGoals: [
          { ...fakeGoal(), time: 60 },
          { ...fakeGoal(), time: 80 },
        ],
      };
      const events = d11MatchEvents(d11Match);
      const awayEvents = events.filter((e) => e.team === 'away');

      expect(awayEvents).toHaveLength(2);
    });

    it('sets type to goal for a regular goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        awayTeamGoals: [{ ...fakeGoal(), time: 60 }],
      };
      const [event] = d11MatchEvents(d11Match);

      expect(event.type).toBe('goal');
    });

    it('sets type to penalty for a penalty goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        awayTeamGoals: [{ ...fakeGoal(), time: 60, penalty: true }],
      };
      const [event] = d11MatchEvents(d11Match);

      expect(event.type).toBe('penalty');
    });

    it('sets type to ownGoal for an own goal', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        awayTeamGoals: [{ ...fakeGoal(), time: 60, ownGoal: true }],
      };
      const [event] = d11MatchEvents(d11Match);

      expect(event.type).toBe('ownGoal');
    });
  });

  describe('red cards', () => {
    it('includes a red card event when redCardTime > 0', () => {
      const d11Match = fakeD11Match();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 55, d11Team: d11Match.homeD11Team };
      const events = d11MatchEvents(d11Match, [pms]);

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('redCard');
      expect(events[0].time).toBe(55);
    });

    it('excludes a player when redCardTime is 0', () => {
      const d11Match = fakeD11Match();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 0, d11Team: d11Match.homeD11Team };

      expect(d11MatchEvents(d11Match, [pms])).toHaveLength(0);
    });

    it('assigns team home when pms d11Team id matches match homeD11Team id', () => {
      const d11Match = fakeD11Match();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 40, d11Team: d11Match.homeD11Team };
      const [event] = d11MatchEvents(d11Match, [pms]);

      expect(event.team).toBe('home');
    });

    it('assigns team away when pms d11Team id does not match match homeD11Team id', () => {
      const d11Match = fakeD11Match();
      const awayD11Team = fakeD11TeamBase();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 70, d11Team: awayD11Team };
      const [event] = d11MatchEvents(d11Match, [pms]);

      expect(event.team).toBe('away');
    });

    it('maps the correct player', () => {
      const d11Match = fakeD11Match();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 60, d11Team: d11Match.homeD11Team };
      const [event] = d11MatchEvents(d11Match, [pms]);

      expect(event.player).toBe(pms.player);
    });
  });

  describe('sorting', () => {
    it('returns events sorted by time ascending', () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        homeTeamGoals: [
          { ...fakeGoal(), time: 75 },
          { ...fakeGoal(), time: 20 },
        ],
        awayTeamGoals: [{ ...fakeGoal(), time: 45 }],
      };
      const events = d11MatchEvents(d11Match);

      expect(events.map((e) => e.time)).toEqual([20, 45, 75]);
    });

    it('interleaves goals and red cards by time', () => {
      const d11Match = fakeD11Match();
      const pms = { ...fakePlayerMatchStat(), redCardTime: 30, d11Team: d11Match.homeD11Team };
      const d11MatchWithGoals: D11Match = {
        ...d11Match,
        homeTeamGoals: [{ ...fakeGoal(), time: 10 }],
        awayTeamGoals: [{ ...fakeGoal(), time: 55 }],
      };
      const events = d11MatchEvents(d11MatchWithGoals, [pms]);

      expect(events.map((e) => e.time)).toEqual([10, 30, 55]);
    });
  });

  describe('empty / missing data', () => {
    it('returns empty array when there are no goals or playerMatchStats', () => {
      expect(d11MatchEvents(fakeD11Match())).toEqual([]);
    });

    it('returns empty array when playerMatchStats is undefined', () => {
      expect(d11MatchEvents(fakeD11Match(), undefined)).toEqual([]);
    });

    it('returns only goals when playerMatchStats is empty', () => {
      const d11Match: D11Match = { ...fakeD11Match(), homeTeamGoals: [fakeGoal()] };

      expect(d11MatchEvents(d11Match, [])).toHaveLength(1);
    });
  });
});
