import { describe, expect, it } from 'vitest';
import { contrastTextClass } from './contrast-text.util';

interface Case {
  bg: string | null | undefined;
  expected: string;
  note?: string;
}

describe('contrastTextClass', () => {
  const cases: Case[] = [
    // --- Dark backgrounds -> white text
    { bg: '#000000', expected: 'text-white!' },
    { bg: '#111111', expected: 'text-white!' },

    // --- Mid colors (important edge cases)
    { bg: '#7ab2e1', expected: 'text-white!' },
    { bg: '#336699', expected: 'text-white!' },

    // --- Light backgrounds → black text
    { bg: '#ffffff', expected: 'text-black!' },
    { bg: '#f5f5f5', expected: 'text-black!' },
    { bg: '#eeeeee', expected: 'text-black!' },

    // --- Safety cases
    { bg: null, expected: 'text-white!' },
    { bg: undefined, expected: 'text-white!' },
    { bg: 'invalid', expected: 'text-white!' },

    // --- Team colors
    { bg: '#e20613', expected: 'text-white!' }, // Arsenal
    { bg: '#480024', expected: 'text-white!' }, // Aston Villa
    { bg: '#ce0a17', expected: 'text-white!' }, // Bournemouth
    { bg: '#c10000', expected: 'text-white!' }, // Brentford
    { bg: '#0054a5', expected: 'text-white!' }, // Brighton
    { bg: '#81204c', expected: 'text-white!' }, // Burnley
    { bg: '#001489', expected: 'text-white!' }, // Chelsea
    { bg: '#ee2e24', expected: 'text-white!' }, // Crystal Palace
    { bg: '#014593', expected: 'text-white!' }, // Everton
    { bg: '#231f20', expected: 'text-white!' }, // Fulham
    { bg: '#ffd600', expected: 'text-black!' }, // Leeds
    { bg: '#d10011', expected: 'text-white!' }, // Liverpool
    { bg: '#7ab2e1', expected: 'text-white!' }, // Manchester City
    { bg: '#b90006', expected: 'text-white!' }, // Manchester United
    { bg: '#231f20', expected: 'text-white!' }, // Newcastle
    { bg: '#eb0024', expected: 'text-white!' }, // Nottingham
    { bg: '#dc0714', expected: 'text-white!' }, // Sunderland
    { bg: '#000a3c', expected: 'text-white!' }, // Tottenham
    { bg: '#7c2c3b', expected: 'text-white!' }, // West Ham
    { bg: '#fab900', expected: 'text-black!' }, // Wolverhampton
  ];

  it.each(cases)('returns $expected for $bg', ({ bg, expected }) => {
    expect(contrastTextClass(bg)).toBe(expected);
  });
});
