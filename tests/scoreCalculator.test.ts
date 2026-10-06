import { describe, it, expect } from 'vitest';
import { getGradeBadge, getImpactColor } from '../src/utils/scoreCalculator';

describe('scoreCalculator', () => {
  it('returns emerald badge styling for A+ and A grades', () => {
    const badgeA = getGradeBadge('A+');
    expect(badgeA.text).toBe('text-emerald-400');
    expect(badgeA.bg).toBe('bg-emerald-500/10');
  });

  it('returns rose badge styling for F grade', () => {
    const badgeF = getGradeBadge('F');
    expect(badgeF.text).toBe('text-rose-400');
    expect(badgeF.bg).toBe('bg-rose-500/10');
  });

  it('returns appropriate impact styling', () => {
    expect(getImpactColor('Critical')).toContain('text-rose-400');
    expect(getImpactColor('High')).toContain('text-orange-400');
    expect(getImpactColor('Medium')).toContain('text-amber-400');
  });
});
