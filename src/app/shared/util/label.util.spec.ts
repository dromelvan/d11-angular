import { fromCamelCase } from './label.util';

describe('fromCamelCase', () => {
  it('capitalises a single word', () => {
    expect(fromCamelCase('country')).toBe('Country');
  });

  it('splits camelCase into words and capitalises only the first', () => {
    expect(fromCamelCase('dateOfBirth')).toBe('Date of birth');
  });

  it('handles multiple humps', () => {
    expect(fromCamelCase('premierLeagueId')).toBe('Premier league id');
  });

  it('strips the model prefix before converting', () => {
    expect(fromCamelCase('player.country')).toBe('Country');
  });

  it('strips the model prefix from a camelCase property', () => {
    expect(fromCamelCase('player.dateOfBirth')).toBe('Date of birth');
  });

  it('strips only the first segment when there are multiple dots', () => {
    expect(fromCamelCase('player.address.streetName')).toBe('Address.street name');
  });
});
