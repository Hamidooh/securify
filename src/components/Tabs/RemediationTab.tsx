import React, { useState } from 'react';
import { HeadersAudit } from '../../types';
import { 
  generateNginxConfig, 
  generateApacheConfig, 
  generateCaddyConfig, 
  generateVercelConfig, 
  generateExpressConfig 
} from '../../utils/remediationGenerator';
import { Copy, Check, Terminal, Sparkles } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Automated Remediation Generator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Instantly generate drop-in configurations tailored to eliminate all detected security header vulnerabilities.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Configuration'}</span>
        </button>
      </div>

      {/* Server selector tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {servers.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedServer(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedServer === s.id
                ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="p-4 bg-[#060a14] border border-slate-800 rounded-2xl font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
        <pre>{configText}</pre>
      </div>
    </div>
  );
};
