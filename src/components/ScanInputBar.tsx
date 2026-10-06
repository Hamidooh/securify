import React, { useState } from 'react';
import { Search, Loader2, Globe, Shield, Sparkles } from 'lucide-react';

interface ScanInputBarProps {
  onScan: (target: string) => void;
  isLoading: boolean;
}

const PRESET_TARGETS = ['github.com', 'cloudflare.com', 'stripe.com', 'openai.com'];

export const ScanInputBar: React.FC<ScanInputBarProps> = ({ onScan, isLoading }) => {
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || isLoading) return;
    onScan(target.trim());
  };

  const handleSelectPreset = (preset: string) => {
    setTarget(preset);
    onScan(preset);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Audit Any Website or API for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Security Flaws</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Deep scan HTTP security headers, TLS/SSL certificates, DNS email spoofing defenses (SPF/DMARC), and exposed server ports.
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1 flex items-center bg-[#0d1424] border border-slate-700/80 rounded-2xl shadow-2xl focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition overflow-hidden">
          <div className="pl-4 pr-2 text-slate-500">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <input
            type="text"
            placeholder="Enter domain or URL (e.g. example.com or https://api.mysite.com)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="flex-1 py-4 px-2 bg-transparent text-sm text-white placeholder-slate-500 font-mono outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !target.trim()}
            className="m-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 fill-white text-white" />
                <span>Analyze Security</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset suggestions */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Try instant scan:
        </span>
        {PRESET_TARGETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 text-[11px] font-mono transition"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
