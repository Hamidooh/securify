import React from 'react';
import { SslAudit } from '../../types';

interface SslTabProps {
  ssl: SslAudit;
}

export const SslTab: React.FC<SslTabProps> = ({ ssl }) => {
  if (!ssl.success) {
    return (
      <div className="p-6 border border-[#ff3344]/30 bg-[#120507] font-mono text-xs space-y-2">
        <div className="text-[#ff3344] font-bold">&gt; TLS Handshake Failed on Port 443</div>
        <p className="text-[#888888]">
          {ssl.error || 'Target server did not present a valid SSL/TLS certificate on port 443.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="pb-3 border-b border-[#222222] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            &gt; SSL / TLS Certificate Telemetry
          </h3>
          <p className="text-[#888888] text-[11px] mt-0.5">
            Cryptographic handshake telemetry, certificate authority hierarchy, and key specifications.
          </p>
        </div>
        <span className="px-2 py-0.5 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] font-bold">
          [TLS: {ssl.protocol || 'TLSv1.3'} - {ssl.daysRemaining}d REMAINING]
        </span>
      </div>

      {/* Grid of Cert Metadata */}
      <div className="border border-[#222222] bg-black divide-y divide-[#1c1c1c]">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[#666666] uppercase text-[10px] block">Certificate Authority</span>
            <span className="text-white font-bold text-sm block mt-0.5">
              {ssl.issuer?.O || ssl.issuer?.CN || 'Let\'s Encrypt / DigiCert'}
            </span>
            <span className="text-[#777777] text-[11px]">Common Name: {ssl.issuer?.CN || 'Root CA'}</span>
          </div>
          <div>
            <span className="text-[#666666] uppercase text-[10px] block">Cipher Suite & Strength</span>
            <span className="text-[#00ff66] font-bold text-sm block mt-0.5">
              {ssl.cipher || 'TLS_AES_256_GCM_SHA384'}
            </span>
            <span className="text-[#777777] text-[11px]">Key Length: {ssl.keyStrength || 256} bits</span>
          </div>
        </div>

        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[#666666] uppercase text-[10px] block">Validity Window</span>
            <div className="text-[#cccccc] text-[11px] mt-0.5 space-y-0.5">
              <div>Valid From: {ssl.validFrom ? new Date(ssl.validFrom).toUTCString() : 'N/A'}</div>
              <div>Valid To:   {ssl.validTo ? new Date(ssl.validTo).toUTCString() : 'N/A'}</div>
            </div>
          </div>
          <div>
            <span className="text-[#666666] uppercase text-[10px] block">Status & Expiration</span>
            <span className={`font-bold block mt-0.5 ${ssl.isExpired ? 'text-[#ff3344]' : ssl.isExpiringSoon ? 'text-[#ffaa00]' : 'text-[#00ff66]'}`}>
              [{ssl.isExpired ? 'EXPIRED' : ssl.isExpiringSoon ? 'EXPIRING SOON' : 'ACTIVE & VERIFIED'}]
            </span>
            <span className="text-[#777777] text-[11px]">{ssl.daysRemaining} days remaining until renewal</span>
          </div>
        </div>

        {/* SANs */}
        {ssl.sans && ssl.sans.length > 0 && (
          <div className="p-3">
            <span className="text-[#666666] uppercase text-[10px] block mb-1.5">
              Subject Alternative Names ({ssl.sans.length} Hostnames Protected)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ssl.sans.map((san, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-[#0a0a0a] border border-[#222222] text-[#aaaaaa] text-[10px]">
                  {san}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hashes */}
        <div className="p-3 space-y-1 text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#888888]">
            <span className="text-[#666666]">SHA-256 Fingerprint:</span>
            <span className="text-[#ededed] select-all font-mono">{ssl.fingerprint || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#888888]">
            <span className="text-[#666666]">Serial Number:</span>
            <span className="text-[#ededed] select-all font-mono">{ssl.serialNumber || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
