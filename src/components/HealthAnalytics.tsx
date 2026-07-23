import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { Repository, HealthMetricHistory } from '../types';

interface HealthAnalyticsProps {
  repository: Repository;
  history: HealthMetricHistory[];
}

export const HealthAnalytics: React.FC<HealthAnalyticsProps> = ({
  repository,
  history
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              HEALTH AGENT • LONG-TERM REPO CONDITION
            </h3>
            <p className="text-slate-400 font-sans text-xs">
              Continuous repo health metrics, test coverage trend & multi-week security debt tracking
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 bg-[#10131A] p-1 rounded-xl border border-slate-800">
          {(['7d', '30d', '90d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                selectedTimeframe === tf
                  ? 'bg-emerald-400 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf} View
            </button>
          ))}
        </div>
      </div>

      {/* Top Health KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Overall Health Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#C8FF2E]">{repository.healthScore}/100</span>
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +3%
            </span>
          </div>
          <p className="text-slate-500 text-[10px] font-sans">98% target benchmark achieved</p>
        </div>

        <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">CI Pipeline Pass Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#2BFF88]">98.4%</span>
            <span className="text-emerald-400 font-bold text-xs">142 runs</span>
          </div>
          <p className="text-slate-500 text-[10px] font-sans">Avg build duration: 48 seconds</p>
        </div>

        <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Dependency Freshness</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400">{repository.dependencyHealthScore}%</span>
            <span className="text-slate-400 text-xs">0 Major Drifts</span>
          </div>
          <p className="text-slate-500 text-[10px] font-sans">Freshness index verified daily</p>
        </div>

        <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Active Security Debt</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{repository.activeAlerts} Issues</span>
            <span className="text-amber-400 font-bold text-xs">1 Auto-Patch Ready</span>
          </div>
          <p className="text-slate-500 text-[10px] font-sans">Zero critical vulnerabilities</p>
        </div>
      </div>

      {/* Visual Chart Bars Representation */}
      <div className="p-5 rounded-2xl bg-[#10131A] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C8FF2E]" />
            Multi-Day Health Score & Security Debt Progression
          </span>
          <span className="text-slate-400 text-xs">Updated 2 minutes ago</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-48 border-b border-slate-800 pb-2">
          {history.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[10px] font-bold text-[#C8FF2E] group-hover:scale-110 transition-all">
                {h.score}%
              </div>
              <div 
                style={{ height: `${h.score}%` }} 
                className="w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-[#C8FF2E] rounded-t-lg group-hover:brightness-125 transition-all relative"
              >
                {/* Vulnerability dot overlay */}
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">{h.date}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#C8FF2E]" /> Health Index</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500" /> Security Debt Bar</span>
          </div>
          <span>Health Agent Prediction: <strong className="text-emerald-400">Target 95% achievable by release v2.5</strong></span>
        </div>
      </div>
    </div>
  );
};
