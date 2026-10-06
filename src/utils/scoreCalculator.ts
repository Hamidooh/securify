export function getGradeBadge(grade: string): { bg: string; text: string; border: string; glow: string } {
  switch (grade) {
    case 'A+':
    case 'A':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      };
    case 'B':
      return {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      };
    case 'C':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      };
    case 'D':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
      };
    default:
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
      };
  }
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'Critical':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    case 'High':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
    case 'Medium':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    default:
      return 'bg-slate-800 text-slate-400 border border-slate-700';
  }
}
