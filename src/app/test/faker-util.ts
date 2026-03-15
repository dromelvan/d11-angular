import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { D11MatchBase } from '@app/core/api/model/d11-match-base.model';
import { GoalBase } from '@app/core/api/model/goal-base.model';
import { Lineup } from '@app/core/api/model/lineup.model';
import { MatchBase } from '@app/core/api/model/match-base.model';
import { MatchWeekBase } from '@app/core/api/model/match-week-base.model';
import { Match } from '@app/core/api/model/match.model';
import { PlayerBase } from '@app/core/api/model/player-base.model';
import { PlayerMatchStat } from '@app/core/api/model/player-match-stat.model';
import { PlayerSearchResult } from '@app/core/api/model/player-search-result.model';
import { PlayerSeasonStat } from '@app/core/api/model/player-season-stat.model';
import { Player } from '@app/core/api/model/player.model';
import { Position } from '@app/core/api/model/position.model';
import { Season } from '@app/core/api/model/season.model';
import { Stadium } from '@app/core/api/model/stadium.model';
import { Status } from '@app/core/api/model/status.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { faker } from '@faker-js/faker';
import { StadiumBase } from '@app/core/api';

export const fakePlayerSearchResult = (): PlayerSearchResult => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  name: faker.person.fullName(),
  teamId: faker.number.int({ min: 2, max: 100 }),
  teamName: faker.company.name(),
});

export const fakeTeamBase = (): TeamBase => ({
  id: faker.number.int({ min: 1, max: 100 }),
  name: faker.company.name(),
  shortName: faker.company.name().slice(0, 3),
  code: faker.string.alpha(2).toUpperCase(),
  colour: faker.color.rgb(),
  dummy: faker.datatype.boolean(),
});

export const fakeD11TeamBase = (): D11TeamBase => ({
  id: faker.number.int({ min: 1, max: 100 }),
  name: faker.company.name(),
  shortName: faker.company.name().slice(0, 3),
  code: faker.string.alpha(2).toUpperCase(),
  dummy: faker.datatype.boolean(),
});

export const fakePosition = (): Position => ({
  id: faker.number.int({ min: 1, max: 10 }),
  name: faker.word.words(1),
  code: faker.string.alpha(3).toUpperCase(),
  maxCount: faker.number.int({ min: 1, max: 5 }),
  defender: faker.datatype.boolean(),
  sortOrder: faker.number.int({ min: 1, max: 10 }),
});

export const fakeSeason = (): Season => ({
  id: faker.number.int({ min: 1, max: 100 }),
  name: `${faker.date.past().getFullYear()}-${faker.date.past().getFullYear() + 1}`,
  shortName: `${faker.number.int({ min: 20, max: 25 })}-${faker.number.int({ min: 20, max: 25 })}`,
  d11TeamBudget: faker.number.int({ min: 500, max: 700 }),
  d11TeamMaxTransfers: faker.number.int({ min: 2, max: 5 }),
  status: faker.helpers.arrayElement([Status.ACTIVE, Status.FINISHED, Status.PENDING]),
  date: faker.date.past().toISOString().split('T')[0],
  legacy: faker.datatype.boolean(),
});

export const fakeStadiumBase = (): StadiumBase => ({
  id: faker.number.int({ min: 1, max: 38 }),
  name: faker.string.alpha(10).toUpperCase(),
  city: faker.string.alpha(10).toUpperCase(),
});

export const fakeStadium = (): Stadium => ({
  ...fakeStadiumBase(),
  capacity: faker.number.int({ min: 10000, max: 90000 }),
  opened: faker.number.int({ min: 1900, max: 2020 }),
  photoFileName: `${faker.system.fileName()}.jpg`,
});

const fakeMatchWeekBase = (): MatchWeekBase => ({
  id: faker.number.int({ min: 1, max: 38 }),
  matchWeekNumber: faker.number.int({ min: 1, max: 38 }),
});

export const fakeMatchBase = (): MatchBase => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  datetime: faker.date.recent().toISOString(),
  homeTeamGoalsScored: faker.number.int({ min: 0, max: 10 }),
  awayTeamGoalsScored: faker.number.int({ min: 0, max: 10 }),
  elapsed: faker.helpers.arrayElement(['N/A', '3', 'HT', '78', 'FT']),
  status: faker.helpers.arrayElement([Status.ACTIVE, Status.FINISHED, Status.PENDING]),
  homeTeam: fakeTeamBase(),
  awayTeam: fakeTeamBase(),
  matchWeek: fakeMatchWeekBase(),
  stadium: fakeStadiumBase(),
});

export const fakeMatch = (): Match => ({
  ...fakeMatchBase(),
  statSourceId: faker.number.int({ min: 1, max: 999999 }),
  previousHomeTeamGoalsScored: faker.number.int({ min: 0, max: 10 }),
  previousAwayTeamGoalsScored: faker.number.int({ min: 0, max: 10 }),
});

export const fakePlayerBase = (): PlayerBase => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  name: faker.person.fullName(),
  shortName: `${faker.person.firstName().charAt(0)}. ${faker.person.lastName()}`,
  parameterizedName: faker.helpers.slugify(faker.person.fullName()).toLowerCase(),
});

export const fakeD11MatchBase = (): D11MatchBase => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  datetime: faker.date.recent().toISOString(),
  homeTeamGoalsScored: faker.number.int({ min: 0, max: 10 }),
  awayTeamGoalsScored: faker.number.int({ min: 0, max: 10 }),
  homeTeamPoints: faker.number.int({ min: 0, max: 100 }),
  awayTeamPoints: faker.number.int({ min: 0, max: 100 }),
  homeD11Team: fakeD11TeamBase(),
  awayD11Team: fakeD11TeamBase(),
  matchWeek: fakeMatchWeekBase(),
});

export const fakeGoal = (): GoalBase => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  time: faker.number.int({ min: 1, max: 90 }),
  addedTime: faker.number.int({ min: 0, max: 5 }),
  penalty: false,
  ownGoal: false,
  player: fakePlayerBase(),
});

export const fakePlayer = (): Player => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  name: faker.person.fullName(),
  shortName: `${faker.person.firstName().charAt(0)}. ${faker.person.lastName()}`,
  parameterizedName: faker.helpers.slugify(faker.person.fullName()).toLowerCase(),
  statSourceId: faker.number.int({ min: 1, max: 999999 }),
  premierLeagueId: faker.number.int({ min: 1, max: 999999 }),
  fullName: faker.person.fullName(),
  dateOfBirth: faker.date.past({ years: 40 }).toISOString().split('T')[0],
  height: faker.number.int({ min: 160, max: 210 }),
  verified: faker.datatype.boolean(),
  country: {
    id: faker.number.int({ min: 1, max: 200 }),
    name: faker.location.country(),
    iso: faker.location.countryCode('alpha-2'),
  },
});

export const fakePlayerSeasonStat = (): PlayerSeasonStat => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  shirtNumber: faker.number.int({ min: 1, max: 99 }),
  fee: faker.number.int({ min: 0, max: 100 }),
  winCount: faker.number.int({ min: 0, max: 30 }),
  ranking: faker.number.int({ min: 1, max: 20 }),
  points: faker.number.int({ min: 0, max: 200 }),
  formPoints: faker.number.int({ min: 0, max: 50 }),
  formMatchPoints: [faker.number.int(), faker.number.int(), faker.number.int()],
  pointsPerAppearance: faker.number.float({ min: 0, max: 10 }),
  goals: faker.number.int({ min: 0, max: 30 }),
  goalAssists: faker.number.int({ min: 0, max: 20 }),
  ownGoals: faker.number.int({ min: 0, max: 5 }),
  goalsConceded: faker.number.int({ min: 0, max: 50 }),
  cleanSheets: faker.number.int({ min: 0, max: 20 }),
  yellowCards: faker.number.int({ min: 0, max: 10 }),
  redCards: faker.number.int({ min: 0, max: 3 }),
  substitutionsOn: faker.number.int({ min: 0, max: 10 }),
  substitutionsOff: faker.number.int({ min: 0, max: 10 }),
  manOfTheMatch: faker.number.int({ min: 0, max: 10 }),
  sharedManOfTheMatch: faker.number.int({ min: 0, max: 5 }),
  rating: faker.number.float({ min: 0, max: 10 }),
  gamesStarted: faker.number.int({ min: 0, max: 38 }),
  gamesSubstitute: faker.number.int({ min: 0, max: 38 }),
  gamesDidNotParticipate: faker.number.int({ min: 0, max: 38 }),
  minutesPlayed: faker.number.int({ min: 0, max: 3420 }),
  player: fakePlayerBase(),
  season: fakeSeason(),
  team: fakeTeamBase(),
  d11Team: fakeD11TeamBase(),
  position: fakePosition(),
});

export const fakePlayerMatchStat = (): PlayerMatchStat => ({
  playedPosition: faker.string.alpha(2).toUpperCase(),
  lineup: faker.helpers.arrayElement(Object.values(Lineup)),
  substitutionOnTime: faker.number.int({ min: 0, max: 90 }),
  substitutionOffTime: faker.number.int({ min: 0, max: 90 }),
  goals: faker.number.int({ min: 0, max: 5 }),
  goalAssists: faker.number.int({ min: 0, max: 5 }),
  ownGoals: faker.number.int({ min: 0, max: 2 }),
  goalsConceded: faker.number.int({ min: 0, max: 5 }),
  yellowCardTime: faker.number.int({ min: 0, max: 90 }),
  redCardTime: faker.number.int({ min: 0, max: 90 }),
  manOfTheMatch: faker.datatype.boolean(),
  sharedManOfTheMatch: faker.datatype.boolean(),
  rating: faker.number.float({ min: 0, max: 10 }),
  points: faker.number.int({ min: -5, max: 25 }),
  player: fakePlayerBase(),
  match: fakeMatchBase(),
  team: fakeTeamBase(),
  d11Team: fakeD11TeamBase(),
  position: fakePosition(),
});
