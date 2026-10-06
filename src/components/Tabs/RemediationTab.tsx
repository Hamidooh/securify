import React, { useState } from 'react';
import { HeadersAudit } from '../../types';
import { 
  generateNginxConfig, 
  generateApacheConfig, 
  generateCaddyConfig, 
  generateVercelConfig, 
  generateExpressConfig 
} from '../../utils/remediationGenerator';
import { Copy, Check } from 'lucide-react';

interface RemediationTabProps {
  headers: HeadersAudit;
}

type ServerType = 'nginx' | 'apache' | 'caddy' | 'vercel' | 'express';

export const RemediationTab: React.FC<RemediationTabProps> = ({ headers }) => {
  const [selectedServer, setSelectedServer] = useState<ServerType>('nginx');
  const [copied, setCopied] = useState(false);

  const servers: { id: ServerType; name: string }[] = [
    { id: 'nginx', name: 'Nginx' },
    { id: 'apache', name: 'Apache (.htaccess)' },
    { id: 'caddy', name: 'Caddy' },
    { id: 'vercel', name: 'Vercel (vercel.json)' },
    { id: 'express', name: 'Express (Node.js)' },
  ];

  let configText = '';
  switch (selectedServer) {
    case 'nginx':
      configText = generateNginxConfig(headers);
      break;
    case 'apache':
      configText = generateApacheConfig(headers);
      break;
    case 'caddy':
      configText = generateCaddyConfig(headers);
      break;
    case 'vercel':
      configText = generateVercelConfig(headers);
      break;
    case 'express':
      configText = generateExpressConfig(headers);
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="pb-3 border-b border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            &gt; Server Hardening Code Generator
          </h3>
          <p className="text-[#888888] text-[11px] mt-0.5">
            Drop-in server configurations pre-populated to remediate all missing security headers.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-[#00ff66] hover:bg-[#00dd55] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
          <span>{copied ? '[Copied]' : '[Copy Config]'}</span>
        </button>
      </div>

      {/* Server selector tabs */}
      <div className="flex items-center gap-1 border-b border-[#222222] pb-2 overflow-x-auto">
        {servers.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedServer(s.id)}
            className={`px-3 py-1 border text-xs whitespace-nowrap transition ${
              selectedServer === s.id
                ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] font-bold'
                : 'border-[#222222] bg-[#080808] text-[#888888] hover:text-[#ededed] hover:border-[#333333]'
            }`}
          >
            [{s.name}]
          </button>
        ))}
      </div>

      {/* Code Container */}
      <div className="p-4 bg-[#050505] border border-[#222222] text-[#00ff66] text-[11px] leading-relaxed overflow-x-auto select-all">
        <pre>{configText}</pre>
      </div>
    </div>
  );
};
