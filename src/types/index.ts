export interface HeaderFinding {
  header: string;
  status: 'pass' | 'fail' | 'warn';
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  scoreChange: number;
  description: string;
  value?: string;
  remediation?: string;
}

export interface HeadersAudit {
  checkedUrl: string;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  headers: Record<string, string>;
  findings: HeaderFinding[];
  error?: string;
}

export interface SslAudit {
  success: boolean;
  authorized?: boolean;
  authError?: string | null;
  subject?: Record<string, string>;
  issuer?: Record<string, string>;
  validFrom?: string;
  validTo?: string;
  daysRemaining?: number;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  sans?: string[];
  serialNumber?: string;
  fingerprint?: string;
  protocol?: string;
  cipher?: string | null;
  keyStrength?: number | null;
  error?: string;
}

export interface DnsAudit {
  aRecords: string[];
  aaaaRecords: string[];
  mxRecords: Array<{ exchange: string; priority: number }>;
  caaRecords: any[];
  spfRecord: string | null;
  dmarcRecord: string | null;
  hasSpf: boolean;
  hasDmarc: boolean;
}

export interface PortAudit {
  port: number;
  name: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  desc: string;
  isOpen: boolean;
}

export interface AuditSummary {
  overallScore: number;
  overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  headersScore: number;
  headersGrade: string;
  tlsStatus: string;
  exposedPortsCount: number;
  emailSecurityOk: boolean;
}

export interface SecurityAuditResult {
  target: string;
  scannedUrl: string;
  timestamp: string;
  durationMs: number;
  summary: AuditSummary;
  headers: HeadersAudit;
  ssl: SslAudit;
  dns: DnsAudit;
  ports: PortAudit[];
}

export interface ScanHistoryItem {
  id: string;
  target: string;
  timestamp: string;
  score: number;
  grade: string;
}
