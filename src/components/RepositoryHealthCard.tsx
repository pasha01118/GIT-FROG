import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  GitPullRequest, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  FileCode2
} from 'lucide-react';
import { Repository } from '../types';

interface RepositoryHealthCardProps {
  repository: Repository;
  onOpenDiffInspector: () => void;
  onOpenSecurityVault: () => void;
  onOpenDependencies: () => void;
}

export const RepositoryHealthCard: React.FC<RepositoryHealthCardProps> = ({
  repository,
  onOpenDiffInspector,
  onOpenSecurityVault,
  onOpenDependencies
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#2BFF88] border-[#2BFF88] shadow-[#2BFF88]/20';
    if (score >= 75) return 'text-[#C8FF2E] border-[#C8FF2E] shadow-[#C8FF2E]/20';
    if (score >= 60) return 'text-[#FFB84D] border-[#FFB84D] shadow-[#FFB84D]/20';
    return 'text-[#FF3B3B] border-[#FF3B3B] shadow-[#FF3B3B]/20';
  };

  return (
    <div className="relative rounded-2xl bg-[#10131A] border border-slate-800/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Soft Glow Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,_rgba(200,255,46,0.06),_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Side: Score & Repo Info */}
        <div className="flex items-center gap-5">
          {/* Circular/Gauge Health Badge */}
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-2xl bg-[#08090D] border-2 flex flex-col items-center justify-center shadow-lg ${getScoreColor(repository.healthScore)}`}>
              <span className="text-2xl font-black font-mono tracking-tighter">
                {repository.healthScore}
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
                HEALTH
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#C8FF2E] text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +3%
            </div>
          </div>

          {/* Repository Meta Details */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
                {repository.owner}/<span className="text-[#C8FF2E]">{repository.name}</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                {repository.branch}
              </span>
              {repository.isPrivate && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Private
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono flex items-center gap-3">
              <span>Language: <strong className="text-slate-200">{repository.language}</strong></span>
              <span>•</span>
              <span>Last Scan: <strong className="text-slate-200">{repository.lastScanTime}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#2BFF88]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CI {repository.ciStatus.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* Center: 3 Quick Metric Gauges */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
          {/* PR Queue */}
          <button
            onClick={onOpenDiffInspector}
            className="p-3 rounded-xl bg-[#08090D] border border-slate-800 hover:border-[#20E3FF]/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Open PRs</span>
              <GitPullRequest className="w-3.5 h-3.5 text-[#20E3FF]" />
            </div>
            <div className="text-lg font-mono font-bold text-white group-hover:text-[#20E3FF] transition-colors flex items-center justify-between">
              {repository.openPRs}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Security Alerts */}
          <button
            onClick={onOpenSecurityVault}
            className="p-3 rounded-xl bg-[#08090D] border border-slate-800 hover:border-[#FF3B3B]/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Alerts</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF3B3B]" />
            </div>
            <div className="text-lg font-mono font-bold text-white group-hover:text-[#FF3B3B] transition-colors flex items-center justify-between">
              {repository.activeAlerts}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Dependency Health */}
          <button
            onClick={onOpenDependencies}
            className="p-3 rounded-xl bg-[#08090D] border border-slate-800 hover:border-[#C8FF2E]/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Dep Index</span>
              <Layers className="w-3.5 h-3.5 text-[#C8FF2E]" />
            </div>
            <div className="text-lg font-mono font-bold text-white group-hover:text-[#C8FF2E] transition-colors flex items-center justify-between">
              {repository.dependencyHealthScore}%
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
