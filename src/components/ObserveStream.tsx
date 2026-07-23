import React, { useState } from 'react';
import { 
  Eye, 
  GitPullRequest, 
  GitCommit, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  Filter,
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { ActivityEvent, ActionRiskLevel } from '../types';

interface ObserveStreamProps {
  events: ActivityEvent[];
  onInspectEvent: (event: ActivityEvent) => void;
}

export const ObserveStream: React.FC<ObserveStreamProps> = ({
  events,
  onInspectEvent
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'pr': return <GitPullRequest className="w-4 h-4 text-[#20E3FF]" />;
      case 'security': return <ShieldAlert className="w-4 h-4 text-[#FF3B3B]" />;
      case 'dependency': return <Layers className="w-4 h-4 text-[#C8FF2E]" />;
      case 'ci': return <CheckCircle2 className="w-4 h-4 text-[#2BFF88]" />;
      case 'commit': default: return <GitCommit className="w-4 h-4 text-[#FF4FD8]" />;
    }
  };

  const getRiskBadge = (risk?: ActionRiskLevel) => {
    switch (risk) {
      case 'sensitive':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            SENSITIVE
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            HIGH RISK
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            MED RISK
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SAFE
          </span>
        );
    }
  };

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <div className="space-y-4">
      {/* Stream Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-mono font-bold text-white tracking-wide flex items-center gap-2">
              OBSERVE RIVER STREAM
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2BFF88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2BFF88]"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live stream of repository commits, PR diffs, CI runs & security webhooks
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 bg-[#10131A] p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {['all', 'pr', 'security', 'dependency', 'ci'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#C8FF2E] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline Stream */}
      <div className="space-y-2.5">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => onInspectEvent(event)}
            className="p-4 rounded-xl bg-[#10131A] border border-slate-800/80 hover:border-[#C8FF2E]/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#08090D] border border-slate-800 flex-shrink-0 mt-0.5">
                {getEventIcon(event.type)}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-sm font-mono font-bold text-white group-hover:text-[#C8FF2E] transition-colors">
                    {event.title}
                  </h4>
                  {getRiskBadge(event.risk)}
                </div>

                <p className="text-xs text-slate-300 font-sans mb-1.5 leading-relaxed">
                  {event.summary}
                </p>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span>Author: <strong className="text-slate-300">{event.author}</strong></span>
                  <span>•</span>
                  <span>Repo: <strong className="text-slate-300">{event.repo}</strong></span>
                  {event.branch && (
                    <>
                      <span>•</span>
                      <span>Branch: <strong className="text-cyan-400">{event.branch}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs text-slate-400 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <span className="text-[11px] text-slate-500">{event.timestamp}</span>
              <button className="px-3 py-1.5 rounded-lg bg-[#08090D] border border-slate-800 group-hover:border-[#C8FF2E]/50 group-hover:text-[#C8FF2E] transition-all flex items-center gap-1">
                Inspect
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
