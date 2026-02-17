import { SafeDatePipe } from './safe-date.pipe';

describe('SafeDatePipe', () => {
  const pipe = new SafeDatePipe();

  it('creates', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns formatted date for valid ISO string', () => {
    expect(pipe.transform('2025-06-15')).toBe('15.6 2025');
  });

  it('returns formatted date for valid Date object', () => {
    expect(pipe.transform(new Date('2025-06-15'))).toBe('15.6 2025');
  });

  it('returns formatted date for custom format', () => {
    expect(pipe.transform('2025-06-15', 'yyyy/MM/dd')).toBe('2025/06/15');
  });

  it('returns "Unknown" for empty string', () => {
    expect(pipe.transform('')).toBe('Unknown');
  });

  it('returns "Unknown" for undefined', () => {
    expect(pipe.transform(undefined)).toBe('Unknown');
  });

  it('returns "Unknown" for null', () => {
    expect(pipe.transform(null)).toBe('Unknown');
  });

  it('returns "Unknown" for invalid date', () => {
    expect(pipe.transform('INVALID')).toBe('Unknown');
  });

  it('returns "Unknown" if DatePipe throws', () => {
    // @ts-expect-error: Purposely passing invalid type to simulate DatePipe error
    expect(pipe.transform({})).toBe('Unknown');
  });
});
