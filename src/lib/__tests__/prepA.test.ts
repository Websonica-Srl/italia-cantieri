import { describe, it, expect } from 'vitest';
import { prepA } from '../utils';

describe('prepA', () => {
  it('usa "ad" davanti a vocale', () => {
    expect(prepA('Asti')).toBe('ad Asti');
    expect(prepA('Alba')).toBe('ad Alba');
    expect(prepA('Udine')).toBe('ad Udine');
  });

  it('usa "a" davanti a consonante', () => {
    expect(prepA('Torino')).toBe('a Torino');
  });

  it('gestisce la stringa vuota', () => {
    expect(prepA('')).toBe('a ');
  });
});
