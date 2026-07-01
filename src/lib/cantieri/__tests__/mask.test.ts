import { describe, it, expect } from 'vitest';
import { maskCivico } from '../mask';

describe('maskCivico (R7)', () => {
  it('maschera il civico esatto', () => {
    expect(maskCivico('30')).toBe('civ. ●●');
    expect(maskCivico('12/B')).toBe('civ. ●●');
  });
  it('stringa vuota se assente', () => {
    expect(maskCivico(null)).toBe('');
    expect(maskCivico('')).toBe('');
  });
});
