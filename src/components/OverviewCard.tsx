import React from 'react';
import { SecurityAuditResult } from '../types';
import { getGradeBadge } from '../utils/scoreCalculator';
import { ShieldCheck, Lock, MailCheck, Server, AlertTriangle, Clock } from 'lucide-react';

interface OverviewCardProps {
  result: SecurityAuditResult;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ result }) => {
  const { summary, target, timestamp, durationMs } = result;
  const gradeStyle = getGradeBadge(summary.overallGrade);

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
            Audit Complete
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5">
            {target}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(timestamp).toLocaleTimeString()}
            </span>
            <span>•</span>
            <span>{durationMs}ms scan time</span>
          </div>
        </div>

        {/* Big Grade Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Security Score</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              {summary.overallScore} <span className="text-slate-500 text-sm font-normal">/ 100</span>
            </span>
          </div>
          <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-black text-3xl shadow-2xl ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border} ${gradeStyle.glow}`}>
            <span>{summary.overallGrade}</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Grade</span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Headers */}
        <div className="bg-[#090f1d] border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">Security Headers</span>
            <span className="text-sm font-bold text-white font-mono">
              Grade {summary.headersGrade} ({summary.headersScore}/100)
            </span>
            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
              {result.headers.findings.filter(f => f.status === 'pass').length} passed, {result.headers.findings.filter(f => f.status === 'fail').length} missing
            </span>
          </div>
        </div>

        {/* SSL / TLS */}
        <div className="bg-[#090f1d] border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">SSL / TLS Certificate</span>
            <span className={`text-sm font-bold font-mono ${result.ssl.success ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.ssl.success ? 'Valid & Encrypted' : 'Invalid / Missing'}
            </span>
            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
              {result.ssl.daysRemaining !== undefined ? `${result.ssl.daysRemaining} days left` : 'No cert'}
            </span>
          </div>
        </div>

        {/* Email / DNS Defenses */}
        <div className="bg-[#090f1d] border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <MailCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">Email Spoofing (SPF/DMARC)</span>
            <span className={`text-sm font-bold font-mono ${summary.emailSecurityOk ? 'text-cyan-400' : 'text-amber-400'}`}>
              {summary.emailSecurityOk ? 'Protected' : 'Gaps Detected'}
            </span>
            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
              SPF: {result.dns.hasSpf ? '✓' : '✗'}, DMARC: {result.dns.hasDmarc ? '✓' : '✗'}
            </span>
          </div>
        </div>

        {/* Port Exposure */}
        <div className="bg-[#090f1d] border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">Service Ports</span>
            <span className="text-sm font-bold text-white font-mono">
              {summary.exposedPortsCount} Open Ports
            </span>
            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
              {result.ports.filter(p => p.isOpen && p.risk === 'Critical').length > 0 
                ? '⚠️ Critical port exposed' 
                : 'Standard web ports active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
