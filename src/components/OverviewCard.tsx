import React from 'react';
import { SecurityAuditResult } from '../types';
import { Terminal, Shield, Lock, Globe, Server, Check, AlertTriangle, X } from 'lucide-react';

interface OverviewCardProps {
  result: SecurityAuditResult;
  onRawDataClick?: () => void;
  onReScanClick?: () => void;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ 
  result,
  onRawDataClick,
  onReScanClick 
}) => {
  const { summary, target, timestamp, durationMs } = result;

  // Grade color
  const isA = summary.overallGrade === 'A+' || summary.overallGrade === 'A';
  const isB = summary.overallGrade === 'B';
  const isC = summary.overallGrade === 'C';
  const gradeColor = isA ? '#00ff66' : isB ? '#00e5ff' : isC ? '#ffaa00' : '#ff3344';

  // SVG Gauge calculations
  const radius = 42;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (summary.overallScore / 100) * circumference;

  return (
    <div className="bg-black border border-[#222222] font-mono space-y-4 shadow-2xl">
      {/* Top CLI Header Status */}
      <div className="p-4 border-b border-[#222222] bg-[#0a0a0a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#888888] text-xs">Target:</span>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              {target}
            </span>
            <span 
              className="text-xs font-bold px-2 py-0.5 border"
              style={{ color: gradeColor, borderColor: `${gradeColor}55`, backgroundColor: `${gradeColor}11` }}
            >
              [✓ {summary.overallScore}/100 Grade {summary.overallGrade}]
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#666666] mt-1">
            <span>AUDIT_TIME: {new Date(timestamp).toLocaleTimeString()}</span>
            <span>•</span>
            <span>LATENCY: {durationMs}ms</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start md:self-center">
          {onRawDataClick && (
            <button
              onClick={onRawDataClick}
              className="px-3 py-1.5 bg-[#0f0f0f] border border-[#333333] hover:border-[#666666] text-[#aaaaaa] hover:text-white text-xs transition"
            >
              [Raw Data]
            </button>
          )}
          {onReScanClick && (
            <button
              onClick={onReScanClick}
              className="px-3 py-1.5 bg-[#00ff66] hover:bg-[#00dd55] text-black font-bold text-xs uppercase tracking-wider transition"
            >
              [Run Scan]
            </button>
          )}
        </div>
      </div>

      {/* Main Meter / Score Banner */}
      <div className="p-4 sm:p-6 bg-[#080808] border-b border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] text-[#666666] uppercase tracking-wider block">Security Posture</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
            <span style={{ color: gradeColor }}>Grade {summary.overallGrade}</span>
            <span className="text-sm font-normal text-[#888888]">({summary.overallScore}/100 points)</span>
          </div>
          <p className="text-xs text-[#888888] max-w-md">
            {isA 
              ? 'Hardened web deployment. Critical security headers and modern TLS active.' 
              : 'Security exposures detected. Follow recommended automated fixes below.'}
          </p>
        </div>

        {/* Speedometer Arc SVG */}
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-36 h-20 overflow-visible" viewBox="0 0 100 55">
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Active Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={gradeColor}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute top-7 text-center">
            <span className="text-xl font-black text-white block">{summary.overallScore}</span>
            <span className="text-[9px] uppercase tracking-widest text-[#777777] block -mt-1">Score</span>
          </div>
        </div>
      </div>

      {/* 4 Brutalist Data Grids */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* 1. Security Headers Grid */}
        <div className="bg-[#0a0a0a] border border-[#222222] p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1c1c1c]">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="text-[#00ff66]">&gt;</span> Security Headers
            </span>
            <span className="text-[11px] text-[#00ff66] font-bold">
              [Grade {summary.headersGrade}]
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            {result.headers.findings.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center justify-between py-0.5 border-b border-[#161616]">
                <span className="text-[#888888] truncate max-w-[170px]">{f.header}</span>
                <span className={f.status === 'pass' ? 'text-[#00ff66]' : 'text-[#ff3344]'}>
                  [{f.status === 'pass' ? 'Enabled' : 'DENY'}]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SSL Certificate Grid */}
        <div className="bg-[#0a0a0a] border border-[#222222] p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1c1c1c]">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="text-[#00ff66]">&gt;</span> SSL Certificate
            </span>
            <span className={result.ssl.success ? 'text-[#00ff66] font-bold' : 'text-[#ff3344] font-bold'}>
              [{result.ssl.success ? 'Valid' : 'Failed'}]
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">Issuer</span>
              <span className="text-[#cccccc] truncate max-w-[150px]">
                {result.ssl.issuer?.O || result.ssl.issuer?.CN || 'DigiCert / CA'}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">Expiry</span>
              <span className="text-[#cccccc]">{result.ssl.daysRemaining ?? 'N/A'} days left</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">Protocol</span>
              <span className="text-[#00ff66]">{result.ssl.protocol || 'TLSv1.3'}</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">Key Strength</span>
              <span className="text-[#cccccc]">{result.ssl.keyStrength || '256'} bits</span>
            </div>
          </div>
        </div>

        {/* 3. DNS Email Grid */}
        <div className="bg-[#0a0a0a] border border-[#222222] p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1c1c1c]">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="text-[#00ff66]">&gt;</span> DNS Email Defenses
            </span>
            <span className={summary.emailSecurityOk ? 'text-[#00ff66] font-bold' : 'text-[#ffaa00] font-bold'}>
              [{summary.emailSecurityOk ? 'Protected' : 'Gaps'}]
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">SPF Record</span>
              <span className={result.dns.hasSpf ? 'text-[#00ff66]' : 'text-[#ff3344]'}>
                [{result.dns.hasSpf ? 'Active' : 'Missing'}]
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">DMARC Policy</span>
              <span className={result.dns.hasDmarc ? 'text-[#00ff66]' : 'text-[#ff3344]'}>
                [{result.dns.hasDmarc ? 'Enforced' : 'Missing'}]
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">IPv4 Records</span>
              <span className="text-[#cccccc]">{result.dns.aRecords.length} host(s)</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#161616]">
              <span className="text-[#888888]">MX Servers</span>
              <span className="text-[#cccccc]">{result.dns.mxRecords.length} mail exchangers</span>
            </div>
          </div>
        </div>

        {/* 4. Port Scanner Grid */}
        <div className="bg-[#0a0a0a] border border-[#222222] p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1c1c1c]">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="text-[#00ff66]">&gt;</span> Port Scanner
            </span>
            <span className="text-[#00ff66] font-bold">
              [{summary.exposedPortsCount} Open]
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            {result.ports.slice(0, 4).map((p) => (
              <div key={p.port} className="flex items-center justify-between py-0.5 border-b border-[#161616]">
                <span className="text-[#888888]">Port {p.port} ({p.name})</span>
                <span className={p.isOpen ? (p.risk === 'Critical' ? 'text-[#ff3344] font-bold' : 'text-[#00ff66]') : 'text-[#555555]'}>
                  [{p.isOpen ? 'Open' : 'Closed'}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
