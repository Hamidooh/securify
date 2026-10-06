import React from 'react';
import { ShieldCheck, History, Download, RefreshCw, Terminal } from 'lucide-react';

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
    <header className="h-16 border-b border-slate-800/80 bg-[#0d1424] px-6 flex items-center justify-between select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-sans">
              Securify
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AUDITOR
              </span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block -mt-0.5">DevSecOps & Web Security Analyzer</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Server Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-pulse'}`} />
          <span className="text-slate-400">
            {serverOnline ? 'Scanner Engine Online' : 'Connecting to Engine...'}
          </span>
        </div>

        {/* Export Report */}
        {hasResult && (
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 text-xs font-medium transition"
            title="Export JSON Security Report"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Export Report</span>
          </button>
        )}

        {/* History Drawer Trigger */}
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 text-xs font-medium transition"
        >
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>History</span>
          {historyCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full">
              {historyCount}
            </span>
          )}
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/Hamidooh/securify"
          target="_blank"
          rel="noreferrer"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="GitHub Repository"
        >
          <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>
    </header>
  );
};
