import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search,
  Filter,
  Check
} from 'lucide-react';
import { PolicyRule, AuditEvent } from '../types';

interface PolicyAndAuditProps {
  policies: PolicyRule[];
  onTogglePolicy: (id: string) => void;
  auditTrail: AuditEvent[];
}

export const PolicyAndAudit: React.FC<PolicyAndAuditProps> = ({
  policies,
  onTogglePolicy,
  auditTrail
}) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'audit'>('policies');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exported, setExported] = useState(false);

  const handleExportCSV = () => {
    const csvHeader = 'ID,Timestamp,Agent,Action,Target,Details,RiskLevel,Status\n';
    const csvRows = auditTrail.map(a => 
      `"${a.id}","${a.timestamp}","${a.agent}","${a.action}","${a.target}","${a.details.replace(/"/g, '""')}","${a.riskLevel}","${a.status}"`
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `git-frog-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const filteredAudit = auditTrail.filter(
    a => a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FF4FD8]/10 text-[#FF4FD8] border border-[#FF4FD8]/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              POLICY RULES & AUDIT GOVERNANCE
            </h3>
            <p className="text-slate-400 font-sans">
              Repository governance rules, risk gates, and complete traceability audit trail
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-[#10131A] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
              activeTab === 'policies'
                ? 'bg-[#FF4FD8] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Policy Rules ({policies.filter(p => p.enabled).length}/{policies.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#20E3FF] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail ({auditTrail.length})
          </button>
        </div>
      </div>

      {/* TAB 1: POLICY RULES */}
      {activeTab === 'policies' && (
        <div className="space-y-3">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="p-4 rounded-xl bg-[#10131A] border border-slate-800 hover:border-[#FF4FD8]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{policy.name}</h4>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-purple-300 uppercase">
                    {policy.category}
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">{policy.description}</p>
                <code className="text-[#C8FF2E] bg-[#08090D] px-2 py-0.5 rounded text-[10px]">
                  Rule: {policy.ruleCode}
                </code>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <span className="px-2.5 py-1 rounded bg-[#08090D] border border-slate-800 text-slate-300 uppercase text-[10px]">
                  Action: <strong className="text-rose-400">{policy.actionOnViolation}</strong>
                </span>

                <button
                  onClick={() => onTogglePolicy(policy.id)}
                  className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                    policy.enabled
                      ? 'bg-[#FF4FD8] text-black shadow-[0_0_12px_rgba(255,79,216,0.3)]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {policy.enabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#10131A] p-3 rounded-xl border border-slate-800">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by agent, action or target..."
                className="w-full bg-[#08090D] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#20E3FF]"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg bg-[#20E3FF] hover:bg-cyan-300 text-black font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(32,227,255,0.2)]"
            >
              {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {exported ? 'Exported CSV!' : 'Export Audit CSV'}
            </button>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-xl bg-[#10131A] border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#08090D] text-slate-400 uppercase text-[10px]">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAudit.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-bold text-[#C8FF2E]">{log.agent.toUpperCase()}</td>
                    <td className="p-3 font-bold text-white">{log.action}</td>
                    <td className="p-3 text-cyan-300 whitespace-nowrap">{log.target}</td>
                    <td className="p-3 text-slate-300 font-sans max-w-xs truncate">{log.details}</td>
                    <td className="p-3 whitespace-nowrap">
                      {log.status === 'success' && (
                        <span className="text-[#2BFF88] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                        </span>
                      )}
                      {log.status === 'blocked' && (
                        <span className="text-[#FF3B3B] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> BLOCKED
                        </span>
                      )}
                      {log.status === 'flagged' && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> FLAGGED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
