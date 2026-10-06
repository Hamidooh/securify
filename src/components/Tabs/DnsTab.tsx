import React from 'react';
import { DnsAudit } from '../../types';
import { MailCheck, CheckCircle2, XCircle, Globe, Shield, Server } from 'lucide-react';

interface DnsTabProps {
  dns: DnsAudit;
}

export const DnsTab: React.FC<DnsTabProps> = ({ dns }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">DNS & Email Authentication (SPF / DMARC)</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Email spoofing defenses and DNS configuration verification to prevent phishing campaigns using your domain.
        </p>
      </div>

      {/* SPF & DMARC Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SPF */}
        <div className={`p-5 rounded-2xl border ${dns.hasSpf ? 'bg-[#090f1d] border-emerald-500/20' : 'bg-[#0f1422] border-rose-500/30'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MailCheck className={`w-5 h-5 ${dns.hasSpf ? 'text-emerald-400' : 'text-rose-400'}`} />
              <h4 className="text-sm font-bold text-white">SPF (Sender Policy Framework)</h4>
            </div>
            {dns.hasSpf ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Missing
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-3">
            SPF authorizes specific mail servers to send emails on behalf of your domain, preventing unauthorized sender spoofing.
          </p>
          {dns.spfRecord ? (
            <div className="p-2.5 bg-[#060a14] rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all">
              {dns.spfRecord}
            </div>
          ) : (
            <div className="p-2.5 bg-[#060a14] rounded-xl border border-rose-500/20 font-mono text-xs text-rose-300">
              Fix: Add a TXT DNS record: <code>v=spf1 include:_spf.google.com ~all</code>
            </div>
          )}
        </div>

        {/* DMARC */}
        <div className={`p-5 rounded-2xl border ${dns.hasDmarc ? 'bg-[#090f1d] border-cyan-500/20' : 'bg-[#0f1422] border-rose-500/30'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${dns.hasDmarc ? 'text-cyan-400' : 'text-rose-400'}`} />
              <h4 className="text-sm font-bold text-white">DMARC Policy</h4>
            </div>
            {dns.hasDmarc ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Enforced
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Missing
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-3">
            DMARC instructs recipient mail servers how to treat unauthenticated emails (quarantine, reject) and sends abuse telemetry.
          </p>
          {dns.dmarcRecord ? (
            <div className="p-2.5 bg-[#060a14] rounded-xl border border-slate-800 font-mono text-xs text-cyan-400 break-all">
              {dns.dmarcRecord}
            </div>
          ) : (
            <div className="p-2.5 bg-[#060a14] rounded-xl border border-rose-500/20 font-mono text-xs text-rose-300">
              Fix: Add TXT record to <code>_dmarc.yourdomain.com</code>: <code>v=DMARC1; p=quarantine;</code>
            </div>
          )}
        </div>
      </div>

      {/* IP Records & Mail Exchangers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A & AAAA */}
        <div className="p-5 rounded-2xl bg-[#090f1d] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              A / AAAA IP Addresses
            </h4>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {dns.aRecords.length > 0 ? (
              dns.aRecords.map((ip, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 font-sans">IPv4</span>
                  <span>{ip}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs">No IPv4 records found</div>
            )}

            {dns.aaaaRecords.map((ip, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-slate-500 font-sans">IPv6</span>
                <span className="truncate">{ip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MX Records */}
        <div className="p-5 rounded-2xl bg-[#090f1d] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Mail Exchangers (MX Records)
            </h4>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {dns.mxRecords.length > 0 ? (
              dns.mxRecords.map((mx, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="truncate">{mx.exchange}</span>
                  <span className="text-slate-500 font-sans">Priority {mx.priority}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs">No MX records configured</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
