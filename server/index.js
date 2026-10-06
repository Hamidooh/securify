import express from 'express';
import cors from 'cors';
import tls from 'node:tls';
import dns from 'node:dns/promises';
import net from 'node:net';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Securify Security Scanner Engine',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Helper: Normalize URL to hostname
function extractHostname(input) {
  let cleaned = input.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const url = new URL(cleaned);
    return {
      hostname: url.hostname,
      protocol: url.protocol,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      fullUrl: cleaned
    };
  } catch (err) {
    throw new Error('Invalid URL or hostname format');
  }
}

// 1. Security Headers Analysis
async function checkHeaders(url) {
  const result = {
    checkedUrl: url,
    score: 100,
    grade: 'A+',
    headers: {},
    findings: [],
    cookies: []
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Securify-Security-Scanner/1.0 (+https://github.com/Hamidooh/securify)'
      }
    });
    clearTimeout(timeout);

    const headers = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    result.headers = headers;

    // Check Content-Security-Policy
    if (headers['content-security-policy']) {
      result.findings.push({
        header: 'Content-Security-Policy',
        status: 'pass',
        impact: 'High',
        scoreChange: 0,
        description: 'Strong CSP header detected. Prevents XSS and malicious script execution.',
        value: headers['content-security-policy']
      });
    } else {
      result.score -= 25;
      result.findings.push({
        header: 'Content-Security-Policy',
        status: 'fail',
        impact: 'Critical',
        scoreChange: -25,
        description: 'Missing Content-Security-Policy header. Susceptible to Cross-Site Scripting (XSS).',
        remediation: "Add: Content-Security-Policy: default-src 'self'; script-src 'self';"
      });
    }

    // Check Strict-Transport-Security (HSTS)
    if (headers['strict-transport-security']) {
      result.findings.push({
        header: 'Strict-Transport-Security',
        status: 'pass',
        impact: 'High',
        scoreChange: 0,
        description: 'HSTS is enabled. Forces clients to communicate exclusively over HTTPS.',
        value: headers['strict-transport-security']
      });
    } else {
      result.score -= 20;
      result.findings.push({
        header: 'Strict-Transport-Security',
        status: 'fail',
        impact: 'High',
        scoreChange: -20,
        description: 'Missing HSTS header. Vulnerable to SSL-stripping and man-in-the-middle attacks.',
        remediation: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
      });
    }

    // Check X-Frame-Options
    if (headers['x-frame-options']) {
      result.findings.push({
        header: 'X-Frame-Options',
        status: 'pass',
        impact: 'Medium',
        scoreChange: 0,
        description: 'Clickjacking defense enabled.',
        value: headers['x-frame-options']
      });
    } else if (!headers['content-security-policy'] || !headers['content-security-policy'].includes('frame-ancestors')) {
      result.score -= 15;
      result.findings.push({
        header: 'X-Frame-Options',
        status: 'fail',
        impact: 'Medium',
        scoreChange: -15,
        description: 'Missing X-Frame-Options and frame-ancestors. Susceptible to clickjacking.',
        remediation: 'Add: X-Frame-Options: DENY or SAMEORIGIN'
      });
    }

    // Check X-Content-Type-Options
    if (headers['x-content-type-options'] === 'nosniff') {
      result.findings.push({
        header: 'X-Content-Type-Options',
        status: 'pass',
        impact: 'Medium',
        scoreChange: 0,
        description: 'MIME-sniffing prevention enabled.',
        value: headers['x-content-type-options']
      });
    } else {
      result.score -= 10;
      result.findings.push({
        header: 'X-Content-Type-Options',
        status: 'fail',
        impact: 'Medium',
        scoreChange: -10,
        description: 'Missing nosniff header. Browsers may misinterpret file MIME types.',
        remediation: 'Add: X-Content-Type-Options: nosniff'
      });
    }

    // Check Referrer-Policy
    if (headers['referrer-policy']) {
      result.findings.push({
        header: 'Referrer-Policy',
        status: 'pass',
        impact: 'Low',
        scoreChange: 0,
        description: 'Referrer policy configured.',
        value: headers['referrer-policy']
      });
    } else {
      result.score -= 5;
      result.findings.push({
        header: 'Referrer-Policy',
        status: 'warn',
        impact: 'Low',
        scoreChange: -5,
        description: 'Missing Referrer-Policy. Sensitive query params may leak in Referer header.',
        remediation: 'Add: Referrer-Policy: strict-origin-when-cross-origin'
      });
    }

    // Check Permissions-Policy
    if (headers['permissions-policy']) {
      result.findings.push({
        header: 'Permissions-Policy',
        status: 'pass',
        impact: 'Low',
        scoreChange: 0,
        description: 'Browser features explicitly restricted.',
        value: headers['permissions-policy']
      });
    } else {
      result.score -= 5;
      result.findings.push({
        header: 'Permissions-Policy',
        status: 'warn',
        impact: 'Low',
        scoreChange: -5,
        description: 'Permissions-Policy not defined. Camera, microphone, and geolocation not restricted.',
        remediation: 'Add: Permissions-Policy: camera=(), microphone=(), geolocation=()'
      });
    }

    // Check Information Disclosure headers (Server, X-Powered-By)
    if (headers['server']) {
      result.score -= 5;
      result.findings.push({
        header: 'Server (Information Disclosure)',
        status: 'warn',
        impact: 'Low',
        scoreChange: -5,
        description: `Server header exposes technology stack: "${headers['server']}".`,
        remediation: 'Remove or mask Server header in reverse proxy (e.g. server_tokens off in Nginx).'
      });
    }

    if (headers['x-powered-by']) {
      result.score -= 5;
      result.findings.push({
        header: 'X-Powered-By (Information Disclosure)',
        status: 'warn',
        impact: 'Low',
        scoreChange: -5,
        description: `Exposes application framework: "${headers['x-powered-by']}".`,
        remediation: 'Disable X-Powered-By in framework (e.g. app.disable("x-powered-by") in Express).'
      });
    }

    // Calculate Grade
    result.score = Math.max(0, Math.min(100, result.score));
    if (result.score >= 90) result.grade = 'A+';
    else if (result.score >= 80) result.grade = 'A';
    else if (result.score >= 70) result.grade = 'B';
    else if (result.score >= 60) result.grade = 'C';
    else if (result.score >= 45) result.grade = 'D';
    else result.grade = 'F';

  } catch (err) {
    result.score = 0;
    result.grade = 'F';
    result.error = err.message;
  }

  return result;
}

// 2. SSL/TLS Certificate Analysis
function checkTlsCertificate(hostname, port = 443) {
  return new Promise((resolve) => {
    const socket = tls.connect({
      host: hostname,
      port: port,
      servername: hostname,
      rejectUnauthorized: false,
      timeout: 8000
    }, () => {
      try {
        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol();
        const authorized = socket.authorized;
        const authError = socket.authorizationError;

        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
          return resolve({ success: false, error: 'No certificate presented' });
        }

        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const now = new Date();
        const daysRemaining = Math.round((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        resolve({
          success: true,
          authorized,
          authError: authError || null,
          subject: cert.subject,
          issuer: cert.issuer,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining,
          isExpired: daysRemaining <= 0,
          isExpiringSoon: daysRemaining > 0 && daysRemaining < 30,
          sans: cert.subjectaltname ? cert.subjectaltname.split(', ').map(s => s.replace('DNS:', '')) : [],
          serialNumber: cert.serialNumber,
          fingerprint: cert.fingerprint256,
          protocol,
          cipher: cipher ? cipher.name : null,
          keyStrength: cert.bits || null
        });
      } catch (err) {
        socket.destroy();
        resolve({ success: false, error: err.message });
      }
    });

    socket.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ success: false, error: 'Connection timed out' });
    });
  });
}

// 3. DNS & Email Security
async function checkDns(hostname) {
  const dnsResult = {
    aRecords: [],
    aaaaRecords: [],
    mxRecords: [],
    caaRecords: [],
    spfRecord: null,
    dmarcRecord: null,
    hasSpf: false,
    hasDmarc: false
  };

  try {
    const a = await dns.resolve4(hostname).catch(() => []);
    dnsResult.aRecords = a;
  } catch {}

  try {
    const aaaa = await dns.resolve6(hostname).catch(() => []);
    dnsResult.aaaaRecords = aaaa;
  } catch {}

  try {
    const mx = await dns.resolveMx(hostname).catch(() => []);
    dnsResult.mxRecords = mx;
  } catch {}

  try {
    const caa = await dns.resolveCaa(hostname).catch(() => []);
    dnsResult.caaRecords = caa;
  } catch {}

  // Check SPF in root TXT records
  try {
    const txts = await dns.resolveTxt(hostname).catch(() => []);
    const flatTxt = txts.map(t => t.join(''));
    const spf = flatTxt.find(t => t.startsWith('v=spf1'));
    if (spf) {
      dnsResult.spfRecord = spf;
      dnsResult.hasSpf = true;
    }
  } catch {}

  // Check DMARC
  try {
    const dmarcTxts = await dns.resolveTxt(`_dmarc.${hostname}`).catch(() => []);
    const flatDmarc = dmarcTxts.map(t => t.join(''));
    const dmarc = flatDmarc.find(t => t.startsWith('v=DMARC1'));
    if (dmarc) {
      dnsResult.dmarcRecord = dmarc;
      dnsResult.hasDmarc = true;
    }
  } catch {}

  return dnsResult;
}

// 4. Port Probe
function probePort(host, port, timeout = 1200) {
  return new Promise((resolve) => {
    const s = new net.Socket();
    let status = 'closed';

    s.setTimeout(timeout);
    s.connect(port, host, () => {
      status = 'open';
      s.destroy();
    });

    s.on('error', () => {
      status = 'closed';
      s.destroy();
    });

    s.on('timeout', () => {
      status = 'filtered/closed';
      s.destroy();
    });

    s.on('close', () => {
      resolve({ port, status });
    });
  });
}

async function checkCommonPorts(hostname) {
  const PORTS_TO_CHECK = [
    { port: 80, name: 'HTTP', risk: 'Low', desc: 'Standard Web Port' },
    { port: 443, name: 'HTTPS', risk: 'Low', desc: 'Secure Web Port' },
    { port: 21, name: 'FTP', risk: 'Critical', desc: 'Unencrypted File Transfer Protocol' },
    { port: 22, name: 'SSH', risk: 'Medium', desc: 'Secure Shell Administration' },
    { port: 8080, name: 'HTTP-Alt', risk: 'Medium', desc: 'Alternative Web / Proxy' },
    { port: 8443, name: 'HTTPS-Alt', risk: 'Low', desc: 'Alternative Secure Web' },
    { port: 3306, name: 'MySQL', risk: 'Critical', desc: 'Exposed Database' },
    { port: 5432, name: 'PostgreSQL', risk: 'Critical', desc: 'Exposed Database' },
    { port: 6379, name: 'Redis', risk: 'Critical', desc: 'Exposed In-Memory Cache' },
    { port: 27017, name: 'MongoDB', risk: 'Critical', desc: 'Exposed NoSQL Database' },
  ];

  const results = await Promise.all(
    PORTS_TO_CHECK.map(async (p) => {
      const probe = await probePort(hostname, p.port);
      return {
        ...p,
        isOpen: probe.status === 'open'
      };
    })
  );

  return results;
}

// MAIN SCAN ENDPOINT
app.post('/api/scan', async (req, res) => {
  const { target } = req.body;
  if (!target) {
    return res.status(400).json({ error: 'Target domain or URL is required' });
  }

  const startTime = Date.now();
  try {
    const { hostname, fullUrl } = extractHostname(target);

    // Run scans concurrently for maximum performance
    const [headersAudit, tlsAudit, dnsAudit, portsAudit] = await Promise.all([
      checkHeaders(fullUrl),
      checkTlsCertificate(hostname),
      checkDns(hostname),
      checkCommonPorts(hostname)
    ]);

    const durationMs = Date.now() - startTime;

    // Calculate Consolidated Security Score
    let overallScore = headersAudit.score;
    if (!tlsAudit.success) overallScore -= 30;
    if (tlsAudit.isExpiringSoon) overallScore -= 10;
    if (!dnsAudit.hasDmarc) overallScore -= 5;
    if (!dnsAudit.hasSpf) overallScore -= 5;

    // Check for exposed database ports
    const exposedCriticalPorts = portsAudit.filter(p => p.isOpen && p.risk === 'Critical');
    if (exposedCriticalPorts.length > 0) {
      overallScore -= (exposedCriticalPorts.length * 20);
    }

    overallScore = Math.max(0, Math.min(100, overallScore));

    let overallGrade = 'A+';
    if (overallScore >= 90) overallGrade = 'A+';
    else if (overallScore >= 80) overallGrade = 'A';
    else if (overallScore >= 70) overallGrade = 'B';
    else if (overallScore >= 60) overallGrade = 'C';
    else if (overallScore >= 45) overallGrade = 'D';
    else overallGrade = 'F';

    res.json({
      target: hostname,
      scannedUrl: fullUrl,
      timestamp: new Date().toISOString(),
      durationMs,
      summary: {
        overallScore,
        overallGrade,
        headersScore: headersAudit.score,
        headersGrade: headersAudit.grade,
        tlsStatus: tlsAudit.success ? (tlsAudit.isExpiringSoon ? 'Expiring Soon' : 'Valid') : 'Invalid / Inactive',
        exposedPortsCount: portsAudit.filter(p => p.isOpen).length,
        emailSecurityOk: dnsAudit.hasSpf && dnsAudit.hasDmarc
      },
      headers: headersAudit,
      ssl: tlsAudit,
      dns: dnsAudit,
      ports: portsAudit
    });
  } catch (err) {
    res.status(500).json({
      error: 'Security scan failed',
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🛡️ Securify Scanner Engine listening on http://localhost:${PORT}`);
});
