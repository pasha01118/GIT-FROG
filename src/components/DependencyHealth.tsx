import React from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Wrench, 
  ShieldAlert, 
  Sparkles,
  GitPullRequest
} from 'lucide-react';
import { DependencyPackage } from '../types';

interface DependencyHealthProps {
  dependencies: DependencyPackage[];
  onOpenUpgradePr: (dep: DependencyPackage) => void;
}

export const DependencyHealth: React.FC<DependencyHealthProps> = ({
  dependencies,
  onOpenUpgradePr
}) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              DEPENDENCY DRIFT & ADVISORY MATRIX
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Continuous package freshness checks, CVE security advisories & breaking change risk scores
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-300 bg-[#10131A] px-3 py-1 rounded-lg border border-slate-800">
          Freshest Package Index: <strong className="text-[#C8FF2E]">92%</strong>
        </span>
      </div>

      {/* Package List Grid */}
      <div className="space-y-3">
        {dependencies.map((dep) => (
          <div
            key={dep.id}
            className="p-4 rounded-xl bg-[#10131A] border border-slate-800 hover:border-[#C8FF2E]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#08090D] border border-slate-800 text-[#C8FF2E]">
                <Layers className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">{dep.name}</h4>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-300 uppercase">
                    {dep.ecosystem}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                    {dep.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span>Current: <strong className="text-slate-200">{dep.currentVersion}</strong></span>
                  <span>→</span>
                  <span>Latest: <strong className="text-[#2BFF88]">{dep.latestVersion}</strong></span>
                  <span>•</span>
                  <span>
                    Breaking Risk: 
                    <strong className={`ml-1 ${dep.breakingRiskScore === 'low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {dep.breakingRiskScore.toUpperCase()}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Advisories & Repair Action */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {dep.advisoriesCount > 0 ? (
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {dep.advisoriesCount} Advisory
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clean
                </span>
              )}

              <button
                onClick={() => onOpenUpgradePr(dep)}
                className="px-4 py-2 rounded-lg bg-[#C8FF2E] hover:bg-[#b5eb1c] text-black font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(200,255,46,0.2)]"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                {dep.upgradePrStatus === 'opened' ? 'PR Opened' : 'Draft Upgrade PR'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
