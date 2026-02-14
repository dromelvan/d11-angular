import { Player, Season, Status } from '@app/core/api';
import { faker } from '@faker-js/faker';

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
    iso: faker.location.countryCode('alpha-3'),
  },
});
