import React, { useState } from 'react';
import { 
  Radar, 
  FileCode2, 
  Bug, 
  ShieldAlert, 
  Layers, 
  Wrench, 
  Lock, 
  BarChart3, 
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Bot
} from 'lucide-react';
import { SpecialistAgent, AgentType } from '../types';

interface AgentPipelineProps {
  agents: SpecialistAgent[];
  onSelectAgent?: (agent: SpecialistAgent) => void;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  agents,
  onSelectAgent
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentType | null>(null);

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radar': return <Radar className="w-4 h-4 text-lime-400" />;
      case 'FileCode2': return <FileCode2 className="w-4 h-4 text-cyan-400" />;
      case 'Bug': return <Bug className="w-4 h-4 text-amber-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-teal-400" />;
      case 'Lock': return <Lock className="w-4 h-4 text-fuchsia-400" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4 text-[#20E3FF]" />;
      case 'Activity': default: return <Activity className="w-4 h-4 text-[#2BFF88]" />;
    }
  };

  const getStatusBadge = (status: SpecialistAgent['status']) => {
    switch (status) {
      case 'watching':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-lime-500/10 text-lime-400 border border-lime-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
            Watching
          </span>
        );
      case 'analyzing':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin" />
            Analyzing
          </span>
        );
      case 'action_required':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
            <ShieldAlert className="w-3 h-3" />
            Alert
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Done
          </span>
        );
      case 'idle':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-slate-400 border border-slate-700">
            Idle
          </span>
        );
    }
  };

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-mono font-bold text-white tracking-wide">
              SPECIALIST AGENT PIPELINE
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              9 Autonomous Guardians orchestrating repository intelligence & repairs
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-[#10131A] px-3 py-1 rounded-lg border border-slate-800">
          Status: <strong className="text-[#C8FF2E]">All Systems Nominal</strong>
        </span>
      </div>

      {/* 9 Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => {
                setSelectedAgentId(agent.id);
                if (onSelectAgent) onSelectAgent(agent);
              }}
              className={`p-3.5 rounded-xl bg-[#10131A] border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'border-[#C8FF2E] shadow-[0_0_20px_rgba(200,255,46,0.15)] bg-[#10131A]/90'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-[#1A1F2B]/60'
              }`}
            >
              {/* Agent Top Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg bg-[#08090D] border border-slate-800 flex items-center justify-center`}>
                    {getAgentIcon(agent.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white group-hover:text-[#C8FF2E] transition-colors">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">{agent.role}</p>
                  </div>
                </div>

                {getStatusBadge(agent.status)}
              </div>

              {/* Current Task Telemetry Bar */}
              <div className="bg-[#08090D] p-2 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 truncate mb-2">
                <span className="text-[#C8FF2E] font-bold">TASK: </span>
                {agent.currentTask || 'Monitoring event stream...'}
              </div>

              {/* Bottom Footer Info */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Active: {agent.lastActive}</span>
                <span className="text-slate-300 font-bold">
                  Findings: <span className="text-[#C8FF2E]">{agent.findingsCount}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Telemetry Detail Card */}
      {activeAgent && (
        <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#08090D] border border-[#C8FF2E]/30 text-[#C8FF2E]">
              {getAgentIcon(activeAgent.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{activeAgent.name}</h4>
                <span className="text-xs text-[#C8FF2E] font-semibold">• {activeAgent.role}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeAgent.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-end">
            <div className="bg-[#08090D] px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Telemetry: </span>
              <span className="text-slate-200 font-bold">0.12ms response</span>
            </div>
            <div className="bg-[#08090D] px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Guard Rule: </span>
              <span className="text-[#20E3FF] font-bold">Enforced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
