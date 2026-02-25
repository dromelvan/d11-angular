import { RatingPipe } from './rating.pipe';

describe('RatingPipe', () => {
  const pipe = new RatingPipe();

  it('creates', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns undefined for undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('returns undefined for non-number', () => {
    expect(pipe.transform({})).toBeUndefined();
    expect(pipe.transform('foo')).toBeUndefined();
    expect(pipe.transform(NaN)).toBeUndefined();
  });

  it('returns correct decimal string for 5', () => {
    expect(pipe.transform(5)).toBe('0.05');
  });

  it('returns correct decimal string for 10', () => {
    expect(pipe.transform(10)).toBe('0.10');
  });

  it('returns correct decimal string for 100', () => {
    expect(pipe.transform(100)).toBe('1.00');
  });

  it('returns correct decimal string for 105', () => {
    expect(pipe.transform(105)).toBe('1.05');
  });

  it('returns correct decimal string for 0', () => {
    expect(pipe.transform(0)).toBe('0.00');
  });
});
