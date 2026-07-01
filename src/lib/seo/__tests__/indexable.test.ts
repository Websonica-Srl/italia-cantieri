import { describe, it, expect } from 'vitest';
import { isCantiereIndexable, isAggregateIndexable } from '../indexable';

describe('isCantiereIndexable', () => {
  it('true solo se scheda_pubblicabile === true', () => {
    expect(isCantiereIndexable({ scheda_pubblicabile: true })).toBe(true);
    expect(isCantiereIndexable({ scheda_pubblicabile: false })).toBe(false);
    expect(isCantiereIndexable({ scheda_pubblicabile: null })).toBe(false);
  });
});
describe('isAggregateIndexable', () => {
  it('soglia default 5, mestiere_provincia 3', () => {
    expect(isAggregateIndexable(5)).toBe(true);
    expect(isAggregateIndexable(4)).toBe(false);
    expect(isAggregateIndexable(3, 'mestiere_provincia')).toBe(true);
    expect(isAggregateIndexable(2, 'mestiere_provincia')).toBe(false);
  });
});
