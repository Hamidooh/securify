import { describe, it, expect } from 'vitest';
import { 
  generateNginxConfig, 
  generateApacheConfig, 
  generateCaddyConfig, 
  generateVercelConfig, 
  generateExpressConfig 
} from '../src/utils/remediationGenerator';
import { HeadersAudit } from '../src/types';

describe('remediationGenerator', () => {
  const mockHeaders: HeadersAudit = {
    checkedUrl: 'https://example.com',
    score: 50,
    grade: 'C',
    headers: {},
    findings: []
  };

  it('generates Nginx configuration block with HSTS and CSP', () => {
    const nginx = generateNginxConfig(mockHeaders);
    expect(nginx).toContain('Strict-Transport-Security');
    expect(nginx).toContain('Content-Security-Policy');
    expect(nginx).toContain('server_tokens off;');
  });

  it('generates Apache configuration with mod_headers', () => {
    const apache = generateApacheConfig(mockHeaders);
    expect(apache).toContain('<IfModule mod_headers.c>');
    expect(apache).toContain('X-Frame-Options "DENY"');
    expect(apache).toContain('ServerSignature Off');
  });

  it('generates Caddy configuration block', () => {
    const caddy = generateCaddyConfig(mockHeaders);
    expect(caddy).toContain('X-Content-Type-Options "nosniff"');
  });

  it('generates Vercel JSON format', () => {
    const vercel = generateVercelConfig(mockHeaders);
    const parsed = JSON.parse(vercel.replace('// vercel.json\n', ''));
    expect(parsed.headers[0].headers.length).toBeGreaterThan(3);
  });

  it('generates Express helmet code snippet', () => {
    const express = generateExpressConfig(mockHeaders);
    expect(express).toContain("import helmet from 'helmet'");
    expect(express).toContain("app.disable('x-powered-by')");
  });
});
