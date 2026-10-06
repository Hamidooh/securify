import React from 'react';
import { Shield, Terminal, Download, History, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onToggleHistory: () => void;
  onExportReport: () => void;
  hasResult: boolean;
  serverOnline: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleHistory,
  onExportReport,
  hasResult,
  serverOnline,
  historyCount,
}) => {
  return (
    <header className="h-14 border-b border-[#222222] bg-black px-4 sm:px-6 flex items-center justify-between select-none font-mono">
      {/* Brand & Monospace Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
          <Terminal className="w-4 h-4 text-[#00ff66]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-[#00ff66] tracking-tight">
            Securify
          </span>
          <span className="text-[10px] uppercase px-1.5 py-0.2 border border-[#333333] text-[#888888] bg-[#0d0d0d]">
            DEV_AUDITOR
          </span>
        </div>
      </div>

      {/* Navigation center (Brutalist tabs) */}
      <nav className="hidden md:flex items-center gap-1 text-xs">
        <span className="px-3 py-1.5 text-[#00ff66] border-b-2 border-[#00ff66] font-semibold">
          Dashboard
        </span>
        <span className="px-3 py-1.5 text-[#888888] hover:text-[#ededed] cursor-pointer transition">
          Targets
        </span>
        <span className="px-3 py-1.5 text-[#888888] hover:text-[#ededed] cursor-pointer transition">
          OWASP Top 10
        </span>
        <span className="px-3 py-1.5 text-[#888888] hover:text-[#ededed] cursor-pointer transition">
          Config Generator
        </span>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 text-xs">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 border border-[#222222] bg-[#0a0a0a] text-[11px]">
          <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-[#00ff66] shadow-[0_0_6px_#00ff66]' : 'bg-[#ffaa00] animate-pulse'}`} />
          <span className="text-[#888888]">
            Status: <span className={serverOnline ? 'text-[#00ff66]' : 'text-[#ffaa00]'}>{serverOnline ? 'Online' : 'Connecting'}</span>
          </span>
        </div>

        {/* Export JSON */}
        {hasResult && (
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1 border border-[#333333] bg-[#0f0f0f] hover:border-[#00ff66] hover:text-[#00ff66] text-[#cccccc] transition"
            title="Export JSON telemetry"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        )}

        {/* History Button */}
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-1.5 px-3 py-1 border border-[#333333] bg-[#0f0f0f] hover:border-[#666666] text-[#cccccc] transition"
        >
          <History className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>History</span>
          {historyCount > 0 && (
            <span className="text-[10px] bg-[#00ff66]/20 text-[#00ff66] px-1 border border-[#00ff66]/30">
              {historyCount}
            </span>
          )}
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com/Hamidooh/securify"
          target="_blank"
          rel="noreferrer"
          className="p-1.5 border border-[#333333] hover:border-[#00ff66] text-[#888888] hover:text-[#00ff66] transition bg-[#0f0f0f]"
          title="GitHub Repository"
        >
          <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>
    </header>
  );
};
