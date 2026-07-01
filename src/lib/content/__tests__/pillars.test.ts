import { describe, it, expect } from 'vitest';
import { getPillar, getInterventoPillarSlugs, getGuidaPillarSlugs } from '../pillars';

describe('pillar registry', () => {
  it('gli slug intervento coincidono con gli hasPillar di cantieri-core', () => {
    expect(getInterventoPillarSlugs().sort()).toEqual(
      ['ampliamento', 'cambio-destinazione', 'demo-ricostruzione', 'manutenzione-straordinaria', 'ristrutturazione'].sort(),
    );
  });
  it('include le 5 guide', () => {
    expect(getGuidaPillarSlugs()).toEqual(
      expect.arrayContaining(['cila', 'scia', 'permesso-di-costruire', 'scia-o-cila', 'pratiche-edilizie']),
    );
  });
  it('un pillar ondata 1 ha copy non vuoto', () => {
    const p = getPillar('intervento', 'ristrutturazione');
    expect(p).not.toBeNull();
    expect(p!.answerFirst.length).toBeGreaterThan(40);
    expect(p!.faq.length).toBeGreaterThanOrEqual(3);
  });
});
