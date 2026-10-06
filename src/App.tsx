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
import { 
  ShieldCheck, 
  Lock, 
  Globe, 
  Server, 
  Sparkles, 
  ListChecks, 
  AlertCircle 
} from 'lucide-react';

type ActiveTab = 'headers' | 'ssl' | 'dns' | 'ports' | 'remediation' | 'owasp';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('headers');
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>(getScanHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);

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

  const tabs = [
    { id: 'headers' as ActiveTab, label: 'Security Headers', icon: ShieldCheck, badge: auditResult?.summary.headersGrade },
    { id: 'ssl' as ActiveTab, label: 'SSL / TLS Cert', icon: Lock, badge: auditResult ? (auditResult.ssl.success ? 'Valid' : 'Issue') : null },
    { id: 'dns' as ActiveTab, label: 'DNS & Spoofing', icon: Globe, badge: auditResult ? (auditResult.summary.emailSecurityOk ? 'OK' : 'Warning') : null },
    { id: 'ports' as ActiveTab, label: 'Port Exposure', icon: Server, badge: auditResult ? `${auditResult.summary.exposedPortsCount} Open` : null },
    { id: 'remediation' as ActiveTab, label: 'Fix Generator', icon: Sparkles, badge: 'Auto' },
    { id: 'owasp' as ActiveTab, label: 'OWASP Top 10', icon: ListChecks, badge: '10 Items' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onToggleHistory={() => setIsHistoryOpen(true)}
        onExportReport={handleExportReport}
        hasResult={!!auditResult}
        serverOnline={serverOnline}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Search & URL Input Bar */}
        <ScanInputBar onScan={handleRunScan} isLoading={isLoading} />

        {/* Error message */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Audit Results View */}
        {auditResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overview Card */}
            <OverviewCard result={auditResult} />

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      isActive
                        ? 'bg-[#0d1424] text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[360px]">
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
          <div className="mt-8 border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans">Ready to Inspect Web Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter any public domain, website, or API endpoint above to perform an automated security inspection. Securify evaluates HSTS, CSP, TLS certificates, SPF/DMARC records, and common ports in seconds.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d1424] py-4 text-center text-xs text-slate-500 font-mono">
        Securify v1.0.0 • Open Source DevSecOps Suite • Developed by Hamidooh
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
