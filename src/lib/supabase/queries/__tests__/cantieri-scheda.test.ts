import { describe, it, expect } from 'vitest';
import { unitaOf, mqOf } from '../cantieri-scheda';

describe('fallback jsonb unita/mq', () => {
  it('usa la colonna quando presente', () => {
    expect(unitaOf({ unita_abitative: 8, scheda: { unita_abitative: 3 } } as any)).toBe(8);
    expect(mqOf({ superficie_mq: 120, scheda: { superficie_mq: 90 } } as any)).toBe(120);
  });
  it('fallback al jsonb quando la colonna e null', () => {
    expect(unitaOf({ unita_abitative: null, scheda: { unita_abitative: 8 } } as any)).toBe(8);
    expect(mqOf({ superficie_mq: null, scheda: { superficie_mq: 90 } } as any)).toBe(90);
  });
  it('null quando entrambi assenti', () => {
    expect(unitaOf({ unita_abitative: null, scheda: null } as any)).toBeNull();
    expect(mqOf({ superficie_mq: null, scheda: {} } as any)).toBeNull();
  });
});
