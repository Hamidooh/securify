import React from 'react';
import { HeadersAudit } from '../../types';

interface HeadersTabProps {
  headers: HeadersAudit;
}

export const HeadersTab: React.FC<HeadersTabProps> = ({ headers }) => {
  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="pb-3 border-b border-[#222222] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            &gt; HTTP Security Headers Analysis
          </h3>
          <p className="text-[#888888] text-[11px] mt-0.5">
            Core HTTP defense headers to mitigate Cross-Site Scripting, Clickjacking, and MIME confusion.
          </p>
        </div>
        <span className="px-2 py-0.5 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] font-bold">
          [Grade {headers.grade} - {headers.score}/100]
        </span>
      </div>

      {/* Findings Table */}
      <div className="border border-[#222222] bg-black">
        <div className="grid grid-cols-12 bg-[#0c0c0c] border-b border-[#222222] p-2.5 text-[#777777] uppercase text-[10px] font-semibold">
          <div className="col-span-4">Directive Header</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-4">Evaluation</div>
        </div>

        <div className="divide-y divide-[#1a1a1a]">
          {headers.findings.map((item, idx) => (
            <div key={idx} className="p-3 hover:bg-[#080808] transition">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-4 font-bold text-white truncate">
                  {item.header}
                </div>
                <div className="col-span-2">
                  <span className={`px-1.5 py-0.2 border text-[10px] font-bold ${
                    item.status === 'pass'
                      ? 'border-[#00ff66]/40 text-[#00ff66] bg-[#00ff66]/10'
                      : item.status === 'fail'
                      ? 'border-[#ff3344]/40 text-[#ff3344] bg-[#ff3344]/10'
                      : 'border-[#ffaa00]/40 text-[#ffaa00] bg-[#ffaa00]/10'
                  }`}>
                    [{item.status.toUpperCase()}]
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] font-semibold ${
                    item.impact === 'Critical' ? 'text-[#ff3344]' :
                    item.impact === 'High' ? 'text-[#ff7700]' :
                    item.impact === 'Medium' ? 'text-[#ffaa00]' :
                    'text-[#888888]'
                  }`}>
                    {item.impact}
                  </span>
                </div>
                <div className="col-span-4 text-[#888888] text-[11px] truncate" title={item.description}>
                  {item.description}
                </div>
              </div>

              {/* Detail / Configured value */}
              {item.value && (
                <div className="mt-2 p-2 bg-[#0a0a0a] border border-[#222222] text-[#00ff66] text-[11px] break-all">
                  <span className="text-[#666666] mr-2">Configured value:</span>
                  {item.value}
                </div>
              )}

              {/* Remediation */}
              {item.remediation && (
                <div className="mt-2 p-2 bg-[#120507] border border-[#ff3344]/30 text-[#ff9999] text-[11px]">
                  <span className="text-[#ff3344] font-bold block mb-0.5">Recommended Defense:</span>
                  <code>{item.remediation}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Raw HTTP Response Headers */}
      <div className="border border-[#222222] bg-black">
        <div className="p-2.5 bg-[#0c0c0c] border-b border-[#222222] text-[#777777] uppercase text-[10px] font-semibold">
          Raw Target Response Headers ({Object.keys(headers.headers).length})
        </div>
        <div className="p-3 max-h-72 overflow-y-auto space-y-1 text-[11px]">
          {Object.entries(headers.headers).map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row sm:items-start py-0.5 border-b border-[#141414]">
              <span className="text-[#00ff66] font-bold sm:w-1/3 truncate shrink-0">{k}:</span>
              <span className="text-[#aaaaaa] break-all">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
