import React from 'react';
import { ScanHistoryItem } from '../types';
import { X, Trash2, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end font-mono">
      <div className="w-full max-w-md bg-black border-l border-[#222222] h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#222222] bg-[#080808] flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-[#00ff66]">&gt;</span> Audit Log History
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#333333] hover:border-[#666666] text-[#888888] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs">
          {history.length === 0 ? (
            <div className="p-8 text-center text-[#555555] text-xs">
              [No previous scan records in cache]
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectTarget(item.target);
                  onClose();
                }}
                className="p-3 bg-[#0a0a0a] border border-[#222222] hover:border-[#00ff66] cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold group-hover:text-[#00ff66] transition">
                      {item.target}
                    </span>
                    <span className="text-[#00ff66] font-bold text-[10px]">
                      [Grade {item.grade}]
                    </span>
                  </div>
                  <span className="text-[10px] text-[#666666]">
                    {new Date(item.timestamp).toLocaleDateString()} • {item.score}/100 pts
                  </span>
                </div>

                <span className="text-[#555555] group-hover:text-[#00ff66] text-xs transition">
                  [Re-scan] →
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-[#222222] bg-[#080808] flex justify-between items-center text-xs">
            <button
              onClick={onClearHistory}
              className="text-[#ff5566] hover:text-[#ff2233] transition"
            >
              [Clear History]
            </button>
            <span className="text-[#666666] text-[11px]">{history.length} audit logs</span>
          </div>
        )}
      </div>
    </div>
  );
};
