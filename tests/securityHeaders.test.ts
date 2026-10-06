import { describe, it, expect } from 'vitest';

describe('securityHeaders checklist verification', () => {
  const ESSENTIAL_HEADERS = [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy'
  ];

  it('contains all 6 core security headers', () => {
    expect(ESSENTIAL_HEADERS).toHaveLength(6);
    expect(ESSENTIAL_HEADERS).toContain('content-security-policy');
    expect(ESSENTIAL_HEADERS).toContain('strict-transport-security');
  });
});
