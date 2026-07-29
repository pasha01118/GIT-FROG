import React, { useState } from 'react';
import { 
  ShieldAlert, 
  EyeOff, 
  Key, 
  CheckCircle2, 
  AlertOctagon, 
  Wrench,
  CheckSquare,
  Square,
  Trash2,
  Zap,
  Filter
} from 'lucide-react';
import { SecurityAlert, SeverityLevel } from '../types';

interface SecurityVaultProps {
  alerts: SecurityAlert[];
  onRemediate: (alert: SecurityAlert) => void;
  onBulkRemediate?: (alerts: SecurityAlert[]) => void;
  onBulkDismiss?: (alertIds: string[]) => void;
}

export const SecurityVault: React.FC<SecurityVaultProps> = ({
  alerts,
  onRemediate,
  onBulkRemediate,
  onBulkDismiss
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);
  const [localAlerts, setLocalAlerts] = useState<SecurityAlert[]>(alerts);

  // Sync if props change
  React.useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-red-500/20 text-red-300 border border-red-500/40">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            MEDIUM
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            LOW
          </span>
        );
    }
  };

  const filteredAlerts = localAlerts.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.type === selectedCategory;
  });

  const isAllSelected = filteredAlerts.length > 0 && filteredAlerts.every(a => selectedAlertIds.includes(a.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(filteredAlerts.map(a => a.id));
    }
  };

  const toggleSelectAlert = (id: string) => {
    if (selectedAlertIds.includes(id)) {
      setSelectedAlertIds(selectedAlertIds.filter(i => i !== id));
    } else {
      setSelectedAlertIds([...selectedAlertIds, id]);
    }
  };

  const handleBulkDismiss = () => {
    if (selectedAlertIds.length === 0) return;
    setLocalAlerts(prev => prev.filter(a => !selectedAlertIds.includes(a.id)));
    if (onBulkDismiss) onBulkDismiss(selectedAlertIds);
    setSelectedAlertIds([]);
  };

  const handleBulkFix = () => {
    if (selectedAlertIds.length === 0) return;
    const selectedObj = localAlerts.filter(a => selectedAlertIds.includes(a.id));
    if (onBulkRemediate) {
      onBulkRemediate(selectedObj);
    } else {
      selectedObj.forEach(a => onRemediate(a));
    }
    setSelectedAlertIds([]);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FF3B3B]/10 text-[#FF3B3B] border border-[#FF3B3B]/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              SECURITY & SECRET VAULT
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Secret leak detection with auto-redaction & OWASP vulnerability monitoring
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#10131A] p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'secret', 'vulnerability', 'injection'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF3B3B] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Controls Bar */}
      <div className="p-3.5 rounded-xl bg-[#10131A] border border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer font-bold"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4 text-[#C8FF2E]" />
          ) : (
            <Square className="w-4 h-4 text-slate-500" />
          )}
          Select All ({selectedAlertIds.length} / {filteredAlerts.length} selected)
        </button>

        {selectedAlertIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDismiss}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Bulk Dismiss ({selectedAlertIds.length})
            </button>
            <button
              onClick={handleBulkFix}
              className="px-3.5 py-1.5 rounded-lg bg-[#C8FF2E] hover:bg-lime-400 text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(200,255,46,0.3)]"
            >
              <Zap className="w-3.5 h-3.5" />
              Bulk Remediate ({selectedAlertIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Secret Protection Banner */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-200 uppercase">Automatic Redaction Layer Active</h4>
            <p className="text-xs text-purple-300/80 font-sans">
              All detected API tokens & SSH credentials are redacted before LLM processing.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded border border-purple-500/40">
          ZERO LEAK POLICY
        </span>
      </div>

      {/* Security Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#10131A] border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Active Alerts</h4>
            <p className="text-xs text-slate-400 font-sans">
              Your repository security vault is currently clean of secrets and OWASP vulnerabilities.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isSelected = selectedAlertIds.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isSelected 
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_15px_rgba(255,59,59,0.15)]' 
                    : 'bg-[#10131A] border-slate-800 hover:border-[#FF3B3B]/40'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSelectAlert(alert.id)}
                      className="p-1 cursor-pointer text-slate-400 hover:text-white"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#C8FF2E]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>

                    <div className="p-2 rounded-lg bg-[#08090D] border border-slate-800 text-rose-400">
                      {alert.type === 'secret' ? <Key className="w-4 h-4 text-purple-400" /> : <AlertOctagon className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                      <p className="text-xs text-slate-400">File: {alert.file} {alert.line && `line ${alert.line}`}</p>
                    </div>
                  </div>

                  {getSeverityBadge(alert.severity)}
                </div>

                {/* Redacted Proof Box */}
                {alert.redactedProof && (
                  <div className="bg-[#050608] p-3 rounded-lg border border-slate-800 text-xs">
                    <span className="text-purple-400 font-bold">Redacted Proof Verification:</span>
                    <pre className="mt-1 text-slate-300 font-mono text-[11px]">{alert.redactedProof}</pre>
                  </div>
                )}

                {/* Remediation Guide */}
                <div className="bg-[#08090D] p-3 rounded-lg border border-slate-800 text-xs font-sans text-slate-300">
                  <span className="font-mono font-bold text-[#C8FF2E]">Remediation Action: </span>
                  {alert.remediation}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500">{alert.timestamp}</span>
                  <button
                    onClick={() => onRemediate(alert)}
                    className="px-4 py-1.5 rounded-lg bg-[#FF3B3B] hover:bg-rose-600 text-white font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,59,59,0.3)]"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Trigger Safe Fix
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
