import { OrdinalPipe } from './ordinal.pipe';

describe('OrdinalPipe', () => {
  const pipe = new OrdinalPipe();

  it('creates', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns undefined for undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('returns undefined for non-number', () => {
    expect(pipe.transform('1')).toBeUndefined();
    expect(pipe.transform({})).toBeUndefined();
  });

  it('returns undefined for non-integer', () => {
    expect(pipe.transform(1.5)).toBeUndefined();
  });

  it('returns undefined for zero', () => {
    expect(pipe.transform(0)).toBeUndefined();
  });

  it('returns undefined for negative number', () => {
    expect(pipe.transform(-1)).toBeUndefined();
  });

  it('returns 1st for 1', () => {
    expect(pipe.transform(1)).toBe('1st');
  });

  it('returns 2nd for 2', () => {
    expect(pipe.transform(2)).toBe('2nd');
  });

  it('returns 3rd for 3', () => {
    expect(pipe.transform(3)).toBe('3rd');
  });

  it('returns 4th for 4', () => {
    expect(pipe.transform(4)).toBe('4th');
  });

  it('returns 11th for 11', () => {
    expect(pipe.transform(11)).toBe('11th');
  });

  it('returns 12th for 12', () => {
    expect(pipe.transform(12)).toBe('12th');
  });

  it('returns 13th for 13', () => {
    expect(pipe.transform(13)).toBe('13th');
  });

  it('returns 21st for 21', () => {
    expect(pipe.transform(21)).toBe('21st');
  });
});
