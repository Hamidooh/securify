import React from 'react';
import { PortAudit } from '../../types';
import { Server, CheckCircle2, AlertOctagon, ShieldCheck } from 'lucide-react';
import { getImpactColor } from '../../utils/scoreCalculator';

interface PortsTabProps {
  ports: PortAudit[];
}

export const PortsTab: React.FC<PortsTabProps> = ({ ports }) => {
  const criticalExposed = ports.filter(p => p.isOpen && p.risk === 'Critical');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">Port Exposure & Service Inspector</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Scans for inadvertently exposed databases, remote administrative consoles, and unencrypted legacy protocols.
        </p>
      </div>

      {criticalExposed.length > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-300">Critical Database Port Exposed!</h4>
            <p className="text-xs text-rose-200/80 mt-0.5">
              One or more internal services (such as MySQL, Redis, or MongoDB) are open to the public internet. Ensure your firewall (AWS Security Groups, UFW, or Cloudflare) restricts access immediately.
            </p>
          </div>
        </div>
      )}

      {/* Ports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ports.map((port) => {
          const isCriticalRisk = port.isOpen && port.risk === 'Critical';
          const isNormalOpen = port.isOpen && !isCriticalRisk;

          return (
            <div
              key={port.port}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                isCriticalRisk
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
                  : isNormalOpen
                  ? 'bg-[#090f1d] border-emerald-500/30'
                  : 'bg-[#090f1d] border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-white">
                    Port {port.port}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({port.name})</span>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${getImpactColor(port.risk)}`}>
                  {port.risk} Risk
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 mb-3">{port.desc}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs font-mono">
                <span className="text-slate-500">Status:</span>
                {port.isOpen ? (
                  <span className={`flex items-center gap-1 font-bold ${isCriticalRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${isCriticalRisk ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    OPEN
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                    Closed / Filtered
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
