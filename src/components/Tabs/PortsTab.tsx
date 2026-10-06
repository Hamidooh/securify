import React from 'react';
import { PortAudit } from '../../types';

interface PortsTabProps {
  ports: PortAudit[];
}

export const PortsTab: React.FC<PortsTabProps> = ({ ports }) => {
  const criticalExposed = ports.filter(p => p.isOpen && p.risk === 'Critical');

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="pb-3 border-b border-[#222222] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            &gt; Network Port Exposure Matrix
          </h3>
          <p className="text-[#888888] text-[11px] mt-0.5">
            Real-time port probes to identify publicly accessible administrative consoles and unshielded databases.
          </p>
        </div>
        <span className="px-2 py-0.5 border border-[#222222] bg-[#0c0c0c] text-[#ededed]">
          [{ports.filter(p => p.isOpen).length} OF {ports.length} PORTS OPEN]
        </span>
      </div>

      {criticalExposed.length > 0 && (
        <div className="p-3 bg-[#1a0507] border border-[#ff3344] text-[#ff7788] space-y-1">
          <div className="font-bold text-[#ff3344]">&gt; SECURITY ALERT: CRITICAL DATABASE PORT EXPOSED!</div>
          <p className="text-[11px] text-[#cccccc]">
            One or more sensitive internal services (e.g. MySQL, Redis, MongoDB) are accepting public connections. Immediate firewall intervention (AWS Security Groups, iptables, UFW) is required.
          </p>
        </div>
      )}

      {/* Ports Table */}
      <div className="border border-[#222222] bg-black">
        <div className="grid grid-cols-12 bg-[#0c0c0c] border-b border-[#222222] p-2.5 text-[#777777] uppercase text-[10px] font-semibold">
          <div className="col-span-2">Port</div>
          <div className="col-span-3">Protocol / Service</div>
          <div className="col-span-2">Risk</div>
          <div className="col-span-3">Service Role</div>
          <div className="col-span-2 text-right">State</div>
        </div>

        <div className="divide-y divide-[#1a1a1a]">
          {ports.map((port) => {
            const isCrit = port.isOpen && port.risk === 'Critical';

            return (
              <div key={port.port} className="p-2.5 hover:bg-[#080808] transition">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-2 font-bold text-white">
                    :{port.port}
                  </div>
                  <div className="col-span-3 text-[#00ff66] font-bold">
                    {port.name}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-bold ${
                      port.risk === 'Critical' ? 'text-[#ff3344]' :
                      port.risk === 'High' ? 'text-[#ff7700]' :
                      port.risk === 'Medium' ? 'text-[#ffaa00]' :
                      'text-[#777777]'
                    }`}>
                      {port.risk}
                    </span>
                  </div>
                  <div className="col-span-3 text-[#888888] text-[11px] truncate">
                    {port.desc}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`px-2 py-0.5 border text-[10px] font-bold ${
                      isCrit 
                        ? 'border-[#ff3344] bg-[#ff3344]/10 text-[#ff3344]' 
                        : port.isOpen 
                        ? 'border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]' 
                        : 'border-[#222222] bg-[#0c0c0c] text-[#555555]'
                    }`}>
                      [{port.isOpen ? 'OPEN' : 'CLOSED'}]
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
