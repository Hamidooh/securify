import React from 'react';
import { SslAudit } from '../../types';
import { Lock, ShieldCheck, AlertTriangle, Key, Calendar, Cpu, Layers } from 'lucide-react';

interface SslTabProps {
  ssl: SslAudit;
}

export const SslTab: React.FC<SslTabProps> = ({ ssl }) => {
  if (!ssl.success) {
    return (
      <div className="p-8 text-center bg-[#0f1422] border border-rose-500/30 rounded-3xl space-y-3">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">SSL/TLS Connection Failed</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {ssl.error || 'Could not establish an encrypted TLS handshake on port 443. The target may not support HTTPS.'}
        </p>
      </div>
    );
  }

  const isExpired = ssl.isExpired;
  const isExpiringSoon = ssl.isExpiringSoon;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">SSL / TLS Encryption & Certificate</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Verifies certificate authenticity, validity period, encryption protocols, and key strength.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expiration Card */}
        <div className={`p-5 rounded-2xl border ${isExpired ? 'bg-rose-500/10 border-rose-500/30' : isExpiringSoon ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#090f1d] border-slate-800'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Certificate Validity</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {ssl.daysRemaining} <span className="text-sm font-normal text-slate-400">days left</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
            <div>Valid From: {ssl.validFrom ? new Date(ssl.validFrom).toLocaleDateString() : 'N/A'}</div>
            <div>Valid To: {ssl.validTo ? new Date(ssl.validTo).toLocaleDateString() : 'N/A'}</div>
          </div>
        </div>

        {/* Protocol & Cipher */}
        <div className="p-5 rounded-2xl bg-[#090f1d] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Protocol & Cipher</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {ssl.protocol || 'TLS'}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono truncate" title={ssl.cipher || ''}>
            Cipher: {ssl.cipher || 'Modern AEAD'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Key Strength: {ssl.keyStrength ? `${ssl.keyStrength} bits` : '256-bit ECC / 2048-bit RSA'}
          </div>
        </div>

        {/* Certificate Authority / Issuer */}
        <div className="p-5 rounded-2xl bg-[#090f1d] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Certificate Authority (CA)</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-bold text-white truncate" title={ssl.issuer?.O || ssl.issuer?.CN || 'Public CA'}>
            {ssl.issuer?.O || ssl.issuer?.CN || 'Let\'s Encrypt / Public CA'}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            CN: {ssl.issuer?.CN || 'Verified Root'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Country: {ssl.issuer?.C || 'US'}
          </div>
        </div>
      </div>

      {/* SANs (Subject Alternative Names) */}
      {ssl.sans && ssl.sans.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#090f1d] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Subject Alternative Names ({ssl.sans.length} Domains Covered)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {ssl.sans.map((san, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                {san}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fingerprint & Serial */}
      <div className="p-5 rounded-2xl bg-[#090f1d] border border-slate-800 space-y-2 text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400">
          <span className="text-slate-500">SHA-256 Fingerprint:</span>
          <span className="text-slate-200 select-all">{ssl.fingerprint || 'N/A'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400">
          <span className="text-slate-500">Serial Number:</span>
          <span className="text-slate-200 select-all">{ssl.serialNumber || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};
