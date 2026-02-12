import { faker } from '@faker-js/faker';
import { Season } from '@app/core/api/model/season.model';
import { Status } from '@app/core/api';

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
