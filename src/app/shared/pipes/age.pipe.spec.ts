import { AgePipe } from './age.pipe';

describe('AgePipe', () => {
  const FIXED_NOW = new Date('2025-06-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const pipe = new AgePipe();

  it('creates', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns undefined for undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('returns undefined for invalid date', () => {
    expect(pipe.transform('INVALID')).toBeUndefined();
  });

  it('returns correct age before birthday', () => {
    expect(pipe.transform('2000-06-20')).toBe(24);
  });

  it('returns correct age after birthday', () => {
    expect(pipe.transform('2000-06-01')).toBe(25);
  });

  it('returns correct age on birthday', () => {
    expect(pipe.transform('2000-06-15')).toBe(25);
  });

  it('returns correct age for leap year', () => {
    expect(pipe.transform('2004-02-29')).toBe(21);
  });

  it('returns correct age for 0', () => {
    expect(pipe.transform('2025-06-14')).toBe(0);
  });
});
