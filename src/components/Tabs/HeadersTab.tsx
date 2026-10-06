import React from 'react';
import { HeadersAudit } from '../../types';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, Copy } from 'lucide-react';
import { getImpactColor } from '../../utils/scoreCalculator';

interface HeadersTabProps {
  headers: HeadersAudit;
}

export const HeadersTab: React.FC<HeadersTabProps> = ({ headers }) => {
  return (
    <div className="space-y-6">
      {/* Top Description */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">HTTP Security Headers</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Security headers protect your web application against XSS, clickjacking, MIME-sniffing, and SSL stripping.
          </p>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {headers.findings.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition ${
              item.status === 'pass'
                ? 'bg-[#090f1d] border-emerald-500/20'
                : item.status === 'fail'
                ? 'bg-[#0f1422] border-rose-500/30'
                : 'bg-[#0f1422] border-amber-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {item.status === 'pass' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : item.status === 'fail' ? (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                )}

                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{item.header}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${getImpactColor(item.impact)}`}>
                  {item.impact}
                </span>

                {item.scoreChange < 0 && (
                  <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                    {item.scoreChange} pts
                  </span>
                )}
              </div>
            </div>

            {/* If passed, show value */}
            {item.value && (
              <div className="mt-3 p-2.5 bg-[#060a14] rounded-xl border border-slate-800 font-mono text-xs text-emerald-400/90 break-all">
                <span className="text-slate-500 mr-2">Configured value:</span>
                {item.value}
              </div>
            )}

            {/* If failed or warning, show remediation */}
            {item.remediation && (
              <div className="mt-3 p-2.5 bg-[#060a14] rounded-xl border border-rose-500/20 font-mono text-xs text-rose-300">
                <span className="text-slate-400 font-semibold block mb-1">Recommended Fix:</span>
                <code>{item.remediation}</code>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Raw Response Headers */}
      <div className="mt-8 border-t border-slate-800 pt-6">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          All Raw HTTP Headers Received ({Object.keys(headers.headers).length})
        </h4>
        <div className="bg-[#090f1d] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="py-2.5 px-4">Header</th>
                <th className="py-2.5 px-4">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(headers.headers).map(([k, v]) => (
                <tr key={k} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-emerald-400 font-semibold w-1/3">{k}</td>
                  <td className="py-2.5 px-4 text-slate-300 break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
