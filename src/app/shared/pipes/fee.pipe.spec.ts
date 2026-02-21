import { FeePipe } from './fee.pipe';

describe('FeePipe', () => {
  const pipe = new FeePipe();

  it('creates', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns undefined for undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('returns undefined for non-number', () => {
    expect(pipe.transform('foo')).toBeUndefined();
    expect(pipe.transform({})).toBeUndefined();
    expect(pipe.transform(NaN)).toBeUndefined();
  });

  it('returns correct decimal string for 5', () => {
    expect(pipe.transform(5)).toBe('0.5');
  });

  it('returns correct decimal string for 10', () => {
    expect(pipe.transform(10)).toBe('1.0');
  });

  it('returns correct decimal string for 100', () => {
    expect(pipe.transform(100)).toBe('10.0');
  });

  it('returns correct decimal string for 105', () => {
    expect(pipe.transform(105)).toBe('10.5');
  });

  it('returns correct decimal string for 0', () => {
    expect(pipe.transform(0)).toBe('0.0');
  });
});
