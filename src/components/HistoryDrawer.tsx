import React from 'react';
import { ScanHistoryItem } from '../types';
import { X, Trash2, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { getGradeBadge } from '../utils/scoreCalculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectTarget: (target: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectTarget,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0d1424] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Recent Audit History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-2.5">
          {history.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No previous audit history recorded. Run a scan to see it logged here!
            </div>
          ) : (
            history.map((item) => {
              const gradeStyle = getGradeBadge(item.grade);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectTarget(item.target);
                    onClose();
                  }}
                  className="p-3 bg-[#090f1d] border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 hover:bg-slate-900 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-lg font-mono font-bold text-sm flex items-center justify-center border ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}>
                      {item.grade}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono group-hover:text-emerald-400 transition truncate max-w-[180px]">
                        {item.target}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleDateString()} • {item.score}/100
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950/40">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[11px] text-slate-500 font-mono">{history.length} scans</span>
          </div>
        )}
      </div>
    </div>
  );
};
