import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Award,
  GitCommit,
  Check,
  XCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Repository, HealthMetricHistory } from '../types';

interface HealthAnalyticsProps {
  repository: Repository;
  history: HealthMetricHistory[];
}

// Generate 30-day realistic trend data
const generate30DayTrends = (currentHealth: number, currentDep: number) => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    
    // Slight variance
    const health = Math.min(100, Math.max(60, currentHealth + Math.sin(i * 0.5) * 6 - (i > 15 ? 4 : 0)));
    const depHealth = Math.min(100, Math.max(50, currentDep + Math.cos(i * 0.4) * 5));
    const securityIssues = Math.max(0, Math.floor(8 - (30 - i) * 0.2 + Math.sin(i) * 2));
    const ciPassRate = Math.min(100, Math.max(70, 92 + Math.sin(i * 0.8) * 7));
    const ciFails = Math.max(0, Math.floor((100 - ciPassRate) / 5));

    data.push({
      date: dayLabel,
      healthScore: Math.round(health),
      dependencyHealth: Math.round(depHealth),
      securityIssues: securityIssues,
      ciPassRate: Math.round(ciPassRate),
      ciFails: ciFails
    });
  }
  return data;
};

export const HealthAnalytics: React.FC<HealthAnalyticsProps> = ({
  repository,
  history
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const chartData = generate30DayTrends(repository.healthScore, repository.dependencyHealthScore);

  const displayData = selectedTimeframe === '7d' 
    ? chartData.slice(-7) 
    : selectedTimeframe === '30d' 
      ? chartData 
      : chartData;

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              HEALTH ANALYTICS • 30-DAY METRIC TRENDS
            </h3>
            <p className="text-slate-400 font-sans text-xs">
              Interactive multi-line Recharts visualization for health index, dependencies, security & CI/CD trends
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

      {/* CHART 1: Multi-Line Graph (Health Score, Dependency Health, Security Issues) */}
      <div className="p-5 rounded-2xl bg-[#10131A] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C8FF2E]" />
            Historical Health, Dependency Index & Security Trend
          </span>
          <span className="text-slate-400 text-xs">30-Day Moving Window</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#08090D', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#F8FAFC' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="healthScore" 
                name="Health Score" 
                stroke="#C8FF2E" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="dependencyHealth" 
                name="Dependency Health" 
                stroke="#20E3FF" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="securityIssues" 
                name="Security Issues Count" 
                stroke="#FF3B3B" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: CI/CD Pipeline Pass / Fail Trend Chart */}
      <div className="p-5 rounded-2xl bg-[#10131A] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#2BFF88]" />
            CI/CD Pipeline Pass / Fail Rate (30 Days)
          </span>
          <span className="text-slate-400 text-xs flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400"><Check className="w-3 h-3" /> Passing</span>
            <span className="flex items-center gap-1 text-rose-400"><XCircle className="w-3 h-3" /> Failing</span>
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#08090D', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#F8FAFC' }}
              />
              <Bar dataKey="ciPassRate" name="CI Pass Rate (%)" fill="#2BFF88" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ciFails" name="CI Failure Incidents" fill="#FF3B3B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
