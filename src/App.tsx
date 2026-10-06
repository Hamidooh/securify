import React, { useState, useEffect } from 'react';
import { SecurityAuditResult, ScanHistoryItem } from './types';
import { getScanHistory, saveScanHistory, clearScanHistory } from './utils/storage';
import { Navbar } from './components/Navbar';
import { ScanInputBar } from './components/ScanInputBar';
import { OverviewCard } from './components/OverviewCard';
import { HeadersTab } from './components/Tabs/HeadersTab';
import { SslTab } from './components/Tabs/SslTab';
import { DnsTab } from './components/Tabs/DnsTab';
import { PortsTab } from './components/Tabs/PortsTab';
import { RemediationTab } from './components/Tabs/RemediationTab';
import { OwaspChecklistTab } from './components/Tabs/OwaspChecklistTab';
import { HistoryDrawer } from './components/HistoryDrawer';

type ActiveTab = 'headers' | 'ssl' | 'dns' | 'ports' | 'remediation' | 'owasp';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('headers');
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>(getScanHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [showRawJsonModal, setShowRawJsonModal] = useState(false);

  // Health check for backend scanner engine
  useEffect(() => {
    const checkEngine = async () => {
      try {
        const res = await fetch('/api/health');
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      }
    };
    checkEngine();
    const interval = setInterval(checkEngine, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleRunScan = async (target: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Security scan failed on target host.');
      }

      const data: SecurityAuditResult = await res.json();
      setAuditResult(data);

      // Save to history
      const historyItem: ScanHistoryItem = {
        id: `scan_${Date.now()}`,
        target: data.target,
        timestamp: data.timestamp,
        score: data.summary.overallScore,
        grade: data.summary.overallGrade
      };
      saveScanHistory(historyItem);
      setHistory(getScanHistory());

    } catch (err: any) {
      setError(err.message || 'Network error scanning target host.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!auditResult) return;
    const blob = new Blob([JSON.stringify(auditResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securify_audit_${auditResult.target}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: ActiveTab; label: string; badge?: string | null }[] = [
    { id: 'headers', label: 'Security Headers', badge: auditResult ? `Grade ${auditResult.summary.headersGrade}` : null },
    { id: 'ssl', label: 'SSL Certificate', badge: auditResult ? (auditResult.ssl.success ? 'Valid' : 'Failed') : null },
    { id: 'dns', label: 'DNS Email', badge: auditResult ? (auditResult.summary.emailSecurityOk ? 'OK' : 'Warn') : null },
    { id: 'ports', label: 'Port Scanner', badge: auditResult ? `${auditResult.summary.exposedPortsCount} Open` : null },
    { id: 'remediation', label: 'Fix Generator', badge: 'Auto' },
    { id: 'owasp', label: 'OWASP Top 10', badge: '10 Items' },
  ];

  return (
    <div className="min-h-screen bg-black text-[#ededed] flex flex-col font-mono selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
      {/* Top Navbar */}
      <Navbar
        onToggleHistory={() => setIsHistoryOpen(true)}
        onExportReport={handleExportReport}
        hasResult={!!auditResult}
        serverOnline={serverOnline}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Search Bar */}
        <ScanInputBar onScan={handleRunScan} isLoading={isLoading} />

        {/* Error message */}
        {error && (
          <div className="p-3 bg-[#120507] border border-[#ff3344] text-[#ff8899] text-xs">
            <span className="font-bold text-[#ff3344] mr-2">&gt; ERROR:</span>
            {error}
          </div>
        )}

        {/* Audit Results View */}
        {auditResult && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Overview Card */}
            <OverviewCard 
              result={auditResult} 
              onRawDataClick={() => setShowRawJsonModal(true)}
              onReScanClick={() => handleRunScan(auditResult.target)}
            />

            {/* Brutalist Sub-navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-[#222222] pb-2 overflow-x-auto text-xs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 border whitespace-nowrap transition flex items-center gap-2 ${
                      isActive
                        ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] font-bold'
                        : 'border-[#222222] bg-[#0a0a0a] text-[#888888] hover:text-white hover:border-[#333333]'
                    }`}
                  >
                    <span>[{tab.label}]</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1 border ${
                        isActive 
                          ? 'border-[#00ff66]/40 text-[#00ff66] bg-[#00ff66]/20' 
                          : 'border-[#333333] text-[#777777]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="border border-[#222222] bg-black p-4 sm:p-5 shadow-2xl min-h-[360px]">
              {activeTab === 'headers' && <HeadersTab headers={auditResult.headers} />}
              {activeTab === 'ssl' && <SslTab ssl={auditResult.ssl} />}
              {activeTab === 'dns' && <DnsTab dns={auditResult.dns} />}
              {activeTab === 'ports' && <PortsTab ports={auditResult.ports} />}
              {activeTab === 'remediation' && <RemediationTab headers={auditResult.headers} />}
              {activeTab === 'owasp' && <OwaspChecklistTab />}
            </div>
          </div>
        )}

        {/* Initial Empty State */}
        {!auditResult && !isLoading && !error && (
          <div className="mt-8 border border-[#222222] bg-[#080808] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-3">
            <div className="text-[#00ff66] text-xl font-bold font-mono">
              [Securify DevSecOps Audit Engine]
            </div>
            <p className="text-xs text-[#888888] leading-relaxed max-w-md mx-auto">
              Ready to audit. Enter any target host or domain above to inspect SSL/TLS certificates, evaluate CSP/HSTS response headers, test SPF/DMARC email defenses, and probe sensitive ports.
            </p>
            <div className="pt-2 text-[11px] text-[#555555]">
              Quick command: Select a preset above to execute an instant security benchmark.
            </div>
          </div>
        )}
      </main>

      {/* Raw JSON Modal */}
      {showRawJsonModal && auditResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-[#2e2e2e] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl font-mono text-xs">
            <div className="p-3 border-b border-[#222222] bg-[#0a0a0a] flex items-center justify-between">
              <span className="font-bold text-[#00ff66]">&gt; Raw Audit JSON Telemetry</span>
              <button
                onClick={() => setShowRawJsonModal(false)}
                className="px-2 py-0.5 border border-[#333333] hover:border-[#666666] text-[#888888] hover:text-white"
              >
                [Close]
              </button>
            </div>
            <div className="p-4 overflow-auto text-[#00ff66] bg-[#050505]">
              <pre>{JSON.stringify(auditResult, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#222222] bg-black py-3 text-center text-[11px] text-[#555555]">
        Securify v1.0.0 • Supabase/Vercel Brutalist Neo-Developer Architecture • Built by Hamidooh
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectTarget={handleRunScan}
        onClearHistory={() => {
          clearScanHistory();
          setHistory([]);
        }}
      />
    </div>
  );
};
