import React from 'react';
import { DnsAudit } from '../../types';

interface DnsTabProps {
  dns: DnsAudit;
}

export const DnsTab: React.FC<DnsTabProps> = ({ dns }) => {
  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="pb-3 border-b border-[#222222] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            &gt; DNS & Email Domain Authentication
          </h3>
          <p className="text-[#888888] text-[11px] mt-0.5">
            Validation of SPF records, DMARC enforcement policies, and Mail Exchanger configurations.
          </p>
        </div>
        <span className={`px-2 py-0.5 border text-xs font-bold ${
          dns.hasSpf && dns.hasDmarc 
            ? 'border-[#00ff66]/40 text-[#00ff66] bg-[#00ff66]/10' 
            : 'border-[#ffaa00]/40 text-[#ffaa00] bg-[#ffaa00]/10'
        }`}>
          [{dns.hasSpf && dns.hasDmarc ? 'SPOOFING_SHIELD: ACTIVE' : 'SPOOFING_SHIELD: GAPS DETECTED'}]
        </span>
      </div>

      {/* SPF & DMARC Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* SPF */}
        <div className="p-3 bg-black border border-[#222222] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">SPF (Sender Policy Framework)</span>
            <span className={`px-1.5 py-0.2 border text-[10px] font-bold ${dns.hasSpf ? 'border-[#00ff66]/40 text-[#00ff66]' : 'border-[#ff3344]/40 text-[#ff3344]'}`}>
              [{dns.hasSpf ? 'PASS' : 'MISSING'}]
            </span>
          </div>
          <p className="text-[#777777] text-[11px]">
            Restricts which outbound mail servers can authoritatively send emails on behalf of this domain.
          </p>
          <div className="p-2 bg-[#0a0a0a] border border-[#1a1a1a] text-[11px] text-[#cccccc] break-all">
            {dns.spfRecord ? (
              <span className="text-[#00ff66]">{dns.spfRecord}</span>
            ) : (
              <span className="text-[#ff7777]">No TXT record starting with v=spf1 configured.</span>
            )}
          </div>
        </div>

        {/* DMARC */}
        <div className="p-3 bg-black border border-[#222222] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">DMARC (Domain-based Message Authentication)</span>
            <span className={`px-1.5 py-0.2 border text-[10px] font-bold ${dns.hasDmarc ? 'border-[#00ff66]/40 text-[#00ff66]' : 'border-[#ff3344]/40 text-[#ff3344]'}`}>
              [{dns.hasDmarc ? 'ENFORCED' : 'MISSING'}]
            </span>
          </div>
          <p className="text-[#777777] text-[11px]">
            Instructs recipient servers whether to reject or quarantine forged emails sent under this domain.
          </p>
          <div className="p-2 bg-[#0a0a0a] border border-[#1a1a1a] text-[11px] text-[#cccccc] break-all">
            {dns.dmarcRecord ? (
              <span className="text-[#00ff66]">{dns.dmarcRecord}</span>
            ) : (
              <span className="text-[#ff7777]">No TXT record on _dmarc with v=DMARC1 found.</span>
            )}
          </div>
        </div>
      </div>

      {/* Network & Mail Records Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* IPv4 / IPv6 */}
        <div className="border border-[#222222] bg-black">
          <div className="p-2.5 bg-[#0c0c0c] border-b border-[#222222] text-[#777777] uppercase text-[10px] font-semibold">
            Resolved IP Addresses (A / AAAA)
          </div>
          <div className="p-3 space-y-1 text-[11px]">
            {dns.aRecords.map((ip, i) => (
              <div key={i} className="flex justify-between py-0.5 border-b border-[#141414]">
                <span className="text-[#666666]">IPv4 Host</span>
                <span className="text-[#ededed] font-bold">{ip}</span>
              </div>
            ))}
            {dns.aaaaRecords.map((ip, i) => (
              <div key={i} className="flex justify-between py-0.5 border-b border-[#141414]">
                <span className="text-[#666666]">IPv6 Host</span>
                <span className="text-[#ededed] truncate max-w-[200px]">{ip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MX */}
        <div className="border border-[#222222] bg-black">
          <div className="p-2.5 bg-[#0c0c0c] border-b border-[#222222] text-[#777777] uppercase text-[10px] font-semibold">
            Mail Exchanger Servers (MX)
          </div>
          <div className="p-3 space-y-1 text-[11px]">
            {dns.mxRecords.length > 0 ? (
              dns.mxRecords.map((mx, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-[#141414]">
                  <span className="text-[#ededed] truncate max-w-[210px]">{mx.exchange}</span>
                  <span className="text-[#00ff66]">Priority {mx.priority}</span>
                </div>
              ))
            ) : (
              <div className="text-[#666666]">No direct MX records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
