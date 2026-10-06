import { ScanHistoryItem } from '../types';

const STORAGE_KEY = 'securify_scan_history_v1';

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScanHistory(item: ScanHistoryItem): void {
  try {
    const history = getScanHistory();
    const updated = [item, ...history.filter(h => h.target !== item.target)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history to localStorage', err);
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
