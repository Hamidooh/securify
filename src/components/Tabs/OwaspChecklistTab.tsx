import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, AlertCircle, ExternalLink } from 'lucide-react';

interface OwaspItem {
  id: string;
  code: string;
  title: string;
  risk: 'Critical' | 'High' | 'Medium';
  desc: string;
  recommendation: string;
}

const OWASP_ITEMS: OwaspItem[] = [
  {
    id: 'a01',
    code: 'A01:2021',
    title: 'Broken Access Control',
    risk: 'Critical',
    desc: 'Users can act outside of their intended permissions. Flaws lead to unauthorized information disclosure or modification.',
    recommendation: 'Implement deny-by-default access control and enforce record-level ownership checks.'
  },
  {
    id: 'a02',
    code: 'A02:2021',
    title: 'Cryptographic Failures',
    risk: 'Critical',
    desc: 'Exposure of sensitive data (PII, credentials, cards) in transit or at rest due to weak algorithms or missing HTTPS.',
    recommendation: 'Enforce TLS 1.3, HSTS, strong modern ciphers, and hash passwords using bcrypt or argon2id.'
  },
  {
    id: 'a03',
    code: 'A03:2021',
    title: 'Injection (SQL, NoSQL, OS)',
    risk: 'Critical',
    desc: 'Hostile data sent to an interpreter as part of a command or query tricks the interpreter into executing unintended commands.',
    recommendation: 'Use parameterized queries / ORMs and validate and sanitize all untrusted user inputs.'
  },
  {
    id: 'a04',
    code: 'A04:2021',
    title: 'Insecure Design',
    risk: 'High',
    desc: 'Flaws resulting from lack of threat modeling, secure design patterns, and reference architectures.',
    recommendation: 'Establish threat modeling during design phases and integrate security requirements early.'
  },
  {
    id: 'a05',
    code: 'A05:2021',
    title: 'Security Misconfiguration',
    risk: 'High',
    desc: 'Missing security hardening across application stack, default accounts, unneeded services, or missing HTTP headers.',
    recommendation: 'Automate security header deployment, disable unnecessary ports/features, and review error handling.'
  },
  {
    id: 'a06',
    code: 'A06:2021',
    title: 'Vulnerable and Outdated Components',
    risk: 'High',
    desc: 'Using third-party libraries, packages, or operating system dependencies with known CVE vulnerabilities.',
    recommendation: 'Continuously run npm audit, Dependabot, or Snyk in CI/CD pipeline.'
  },
  {
    id: 'a07',
    code: 'A07:2021',
    title: 'Identification and Authentication Failures',
    risk: 'High',
    desc: 'Permits brute force attacks, credential stuffing, weak session IDs, or missing multi-factor authentication (MFA).',
    recommendation: 'Enforce MFA, rate-limiting on login endpoints, and secure session management.'
  },
  {
    id: 'a08',
    code: 'A08:2021',
    title: 'Software and Data Integrity Failures',
    risk: 'High',
    desc: 'Code and infrastructure that does not protect against integrity violations (untrusted CI/CD plugins, insecure deserialization).',
    recommendation: 'Sign software releases, verify checksums, and avoid insecure object deserialization.'
  },
  {
    id: 'a09',
    code: 'A09:2021',
    title: 'Security Logging and Monitoring Failures',
    risk: 'Medium',
    desc: 'Insufficient logging and monitoring prevents active breach detection and incident response.',
    recommendation: 'Centralize security logs, set alerts for anomalous login activity, and maintain immutable audit trails.'
  },
  {
    id: 'a10',
    code: 'A10:2021',
    title: 'Server-Side Request Forgery (SSRF)',
    risk: 'High',
    desc: 'Flaw occurs when web application fetches a remote resource without validating user-supplied URLs (e.g. cloud metadata attacks).',
    recommendation: 'Sanitize URLs, restrict target protocols to HTTP/HTTPS, and block requests to internal IP ranges (127.0.0.1, 169.254.169.254).'
  }
];

export const OwaspChecklistTab: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedIds).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">OWASP Top 10 Web Application Security Checklist</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard awareness document representing the most critical security risks to web applications worldwide.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 self-start sm:self-auto">
          {checkedCount} / {OWASP_ITEMS.length} Audited
        </div>
      </div>

      <div className="space-y-3">
        {OWASP_ITEMS.map((item) => {
          const isChecked = checkedIds[item.id] ?? false;

          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition select-none ${
                isChecked
                  ? 'bg-[#090f1d] border-emerald-500/30'
                  : 'bg-[#0d1424] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-white transition"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">{item.code}</span>
                      <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-300 line-through opacity-80' : 'text-white'}`}>
                        {item.title}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full self-start sm:self-auto ${
                      item.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                    }`}>
                      {item.risk} Risk
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>

                  <div className="mt-2 text-xs font-mono text-slate-300 bg-[#060a14] p-2 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-sans font-medium mr-1">Recommended Defense:</span>
                    {item.recommendation}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
