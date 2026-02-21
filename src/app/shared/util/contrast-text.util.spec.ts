import { PRIMARY } from '@app/app.theme';
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

    { bg: PRIMARY, expected: 'text-white!' },

    // --- Team colors
    { bg: '#e20613', expected: 'text-white!' }, // Arsenale
    { bg: '#480024', expected: 'text-white!' }, // Aston Villa
    { bg: '#104c8c', expected: 'text-white!' }, // Birmingham
    { bg: '#00adef', expected: 'text-white!' }, // Blackburn
    { bg: '#f7931e', expected: 'text-white!' }, // Blackpool
    { bg: '#f5f5f5', expected: 'text-black!' }, // Bolton
    { bg: '#ce0a17', expected: 'text-white!' }, // Bournemouth
    { bg: '#c10000', expected: 'text-white!' }, // Brentford
    { bg: '#0054a5', expected: 'text-white!' }, // Brighton
    { bg: '#81204c', expected: 'text-white!' }, // Burnley
    { bg: '#035daa', expected: 'text-white!' }, // Cardiff
    { bg: '#dd2c2f', expected: 'text-white!' }, // Charlton
    { bg: '#001489', expected: 'text-white!' }, // Chelsea
    { bg: '#ee2e24', expected: 'text-white!' }, // Crystal Palace
    { bg: '#f5f5f5', expected: 'text-black!' }, // Derby
    { bg: '#014593', expected: 'text-white!' }, // Everton
    { bg: '#eb0024', expected: 'text-white!' }, // Forest
    { bg: '#231f20', expected: 'text-white!' }, // Fulham
    { bg: '#f5f5f5', expected: 'text-black!' }, // Huddersfield
    { bg: '#f6a22e', expected: 'text-white!' }, // Hull
    { bg: '#2461a1', expected: 'text-white!' }, // Ipswich
    { bg: '#ffd600', expected: 'text-black!' }, // Leeds
    { bg: '#204c9c', expected: 'text-white!' }, // Leicester
    { bg: '#d10011', expected: 'text-white!' }, // Liverpool
    { bg: '#fa4616', expected: 'text-white!' }, // Luton
    { bg: '#7ab2e1', expected: 'text-white!' }, // Man City
    { bg: '#b90006', expected: 'text-white!' }, // Man Utd
    { bg: '#db1d23', expected: 'text-white!' }, // Middlesbrough
    { bg: '#231f20', expected: 'text-white!' }, // Newcastle
    { bg: '#00a94f', expected: 'text-white!' }, // Norwich
    { bg: '#2a307d', expected: 'text-white!' }, // Portsmouth
    { bg: '#005cab', expected: 'text-white!' }, // Queens Park
    { bg: '#0060a9', expected: 'text-white!' }, // Reading
    { bg: '#fa3844', expected: 'text-white!' }, // Sheffield Utd
    { bg: '#c6322d', expected: 'text-white!' }, // Southampton
    { bg: '#d71f30', expected: 'text-white!' }, // Stoke
    { bg: '#dc0714', expected: 'text-white!' }, // Sunderland
    { bg: '#f5f5f5', expected: 'text-black!' }, // Swansea
    { bg: '#000a3c', expected: 'text-white!' }, // Tottenham
    { bg: '#ffee00', expected: 'text-black!' }, // Watford
    { bg: '#f5f5f5', expected: 'text-black!' }, // West Brom
    { bg: '#7c2c3b', expected: 'text-white!' }, // West Ham
    { bg: '#005ca6', expected: 'text-white!' }, // Wigan
    { bg: '#fab900', expected: 'text-black!' }, // Wolves
  ];

  it.each(cases)('returns $expected for $bg', ({ bg, expected }) => {
    expect(contrastTextClass(bg)).toBe(expected);
  });
});
