import { describe, it, expect } from 'vitest';
import { hubRegisterUrl } from '../utils';

describe('hubRegisterUrl', () => {
  it('trasporta il contesto e imposta le UTM', () => {
    const u = new URL(hubRegisterUrl({ intent: 'unlock', cantiere: 'abc', comune: 'Cremona', campaign: 'unlock_flow' }));
    expect(u.host).toBe('www.italiaprogettisti.com');
    expect(u.searchParams.get('utm_source')).toBe('italiacantieri');
    expect(u.searchParams.get('intent')).toBe('unlock');
    expect(u.searchParams.get('cantiere')).toBe('abc');
    expect(u.searchParams.get('comune')).toBe('Cremona');
    expect(u.searchParams.get('utm_campaign')).toBe('unlock_flow');
  });
});
