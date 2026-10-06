import React, { useState } from 'react';
import { Terminal, Loader2, ArrowRight } from 'lucide-react';

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
    <div className="w-full space-y-3 font-mono">
      {/* Input container */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row items-stretch bg-black border border-[#2e2e2e] focus-within:border-[#00ff66] transition shadow-2xl">
          {/* CLI Prompt icon */}
          <div className="flex items-center px-4 py-3 bg-[#0a0a0a] border-b sm:border-b-0 sm:border-r border-[#222222] text-[#00ff66] select-none text-xs">
            <span className="text-[#888888] mr-2">audit@securify:~$</span>
            <span>scan</span>
          </div>

          {/* Text input */}
          <input
            type="text"
            placeholder="target domain or host (e.g. github.com, api.site.com)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="flex-1 py-3 px-4 bg-transparent text-sm text-[#ededed] placeholder-[#555555] outline-none font-mono"
            spellCheck={false}
          />

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading || !target.trim()}
            className="px-6 py-3 bg-[#00ff66] hover:bg-[#00dd55] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed select-none border-t sm:border-t-0 sm:border-l border-[#2e2e2e]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <span>[Run Scan]</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset targets */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-[#666666]">
        <span className="text-[11px] uppercase tracking-wider text-[#777777]">Presets:</span>
        {PRESET_TARGETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2 py-0.5 bg-[#0a0a0a] border border-[#222222] hover:border-[#00ff66] text-[#aaaaaa] hover:text-[#00ff66] text-[11px] transition"
          >
            [{preset}]
          </button>
        ))}
      </div>
    </div>
  );
};
