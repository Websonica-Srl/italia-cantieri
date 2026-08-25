import { describe, it, expect } from 'vitest';
import { isCantiereIndexable, isComuneIndexable, isAggregateIndexable } from '../indexable';

describe('isCantiereIndexable', () => {
  it('sempre false con SCHEDE_PUBBLICHE_INDICIZZABILI a false, anche con scheda_pubblicabile true', () => {
    expect(isCantiereIndexable({ scheda_pubblicabile: true })).toBe(false);
    expect(isCantiereIndexable({ scheda_pubblicabile: false })).toBe(false);
    expect(isCantiereIndexable({ scheda_pubblicabile: null })).toBe(false);
  });
});
describe('isComuneIndexable', () => {
  it('false finche SCHEDE_PUBBLICHE_INDICIZZABILI resta false', () => {
    expect(isComuneIndexable()).toBe(false);
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
