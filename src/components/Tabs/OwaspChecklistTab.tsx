import React, { useState } from 'react';

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
    desc: 'Users can act outside of their intended permissions. Leads to unauthorized disclosure or modification of data.',
    recommendation: 'Implement deny-by-default access control and enforce record-level ownership checks.'
  },
  {
    id: 'a02',
    code: 'A02:2021',
    title: 'Cryptographic Failures',
    risk: 'Critical',
    desc: 'Exposure of sensitive data (PII, tokens) in transit or at rest due to weak algorithms or missing HTTPS.',
    recommendation: 'Enforce TLS 1.3, HSTS, strong modern ciphers, and hash passwords using bcrypt or argon2id.'
  },
  {
    id: 'a03',
    code: 'A03:2021',
    title: 'Injection (SQL, NoSQL, OS)',
    risk: 'Critical',
    desc: 'Hostile data sent to an interpreter as part of a command or query tricks interpreter into unintended execution.',
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
    desc: 'Code and infrastructure that does not protect against integrity violations (untrusted plugins, insecure deserialization).',
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
    desc: 'Flaw occurs when web application fetches a remote resource without validating user-supplied URLs.',
    recommendation: 'Sanitize URLs, restrict target protocols to HTTP/HTTPS, and block requests to internal IP ranges.'
  }
];

export const OwaspChecklistTab: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedIds).filter(Boolean).length;

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="pb-3 border-b border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            &gt; OWASP Top 10 Web Application Security Checklist
          </h3>
          <p className="text-[#888888] text-[11px] mt-0.5">
            Industry standard benchmark for web security risk mitigation.
          </p>
        </div>
        <span className="px-2.5 py-1 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] font-bold self-start sm:self-auto">
          [{checkedCount} / {OWASP_ITEMS.length} VERIFIED]
        </span>
      </div>

      <div className="border border-[#222222] bg-black divide-y divide-[#1a1a1a]">
        {OWASP_ITEMS.map((item) => {
          const isChecked = checkedIds[item.id] ?? false;

          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="p-3 cursor-pointer hover:bg-[#080808] transition flex items-start gap-3 select-none"
            >
              <span className={`font-bold mt-0.5 ${isChecked ? 'text-[#00ff66]' : 'text-[#555555]'}`}>
                {isChecked ? '[X]' : '[ ]'}
              </span>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00eeff] font-bold text-[11px]">{item.code}</span>
                    <span className={`font-bold ${isChecked ? 'text-[#00ff66] line-through' : 'text-white'}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-[10px] self-start sm:self-auto font-bold ${
                    item.risk === 'Critical' ? 'text-[#ff3344]' : 'text-[#ffaa00]'
                  }`}>
                    [{item.risk}]
                  </span>
                </div>

                <p className="text-[#888888] text-[11px]">{item.desc}</p>
                <div className="p-1.5 bg-[#0a0a0a] border border-[#1a1a1a] text-[11px] text-[#cccccc]">
                  <span className="text-[#00ff66] mr-1">Recommended Action:</span>
                  {item.recommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
