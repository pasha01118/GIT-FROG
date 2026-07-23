import React, { useState } from 'react';
import { 
  Wrench, 
  GitPullRequest, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  FileCode2,
  Undo2
} from 'lucide-react';
import { Finding, ActionRiskLevel } from '../types';

interface RepairAssistanceProps {
  finding?: Finding;
  onApproveAndMerge: (finding: Finding) => void;
  onRejectPatch: (finding: Finding) => void;
  onClose?: () => void;
}

export const RepairAssistance: React.FC<RepairAssistanceProps> = ({
  finding,
  onApproveAndMerge,
  onRejectPatch,
  onClose
}) => {
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!finding) {
    return (
      <div className="p-8 text-center bg-[#10131A] rounded-2xl border border-slate-800 font-mono text-slate-400">
        <Wrench className="w-8 h-8 text-[#C8FF2E] mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a finding or security alert to launch the Automated Repair Studio.</p>
      </div>
    );
  }

  const handleCopyPatch = () => {
    if (finding.suggestedPatch) {
      navigator.clipboard.writeText(finding.suggestedPatch);
      setCopiedPatch(true);
      setTimeout(() => setCopiedPatch(false), 2000);
    }
  };

  const handleCopyTest = () => {
    if (finding.suggestedTest) {
      navigator.clipboard.writeText(finding.suggestedTest);
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2000);
    }
  };

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onApproveAndMerge(finding);
    }, 800);
  };

  const getRiskNotice = (risk: ActionRiskLevel) => {
    switch (risk) {
      case 'sensitive':
        return (
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-mono flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>SENSITIVE ACTION: Requires Policy Verification and 2-step approval. Cannot auto-merge by default.</span>
          </div>
        );
      case 'high':
        return (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>HIGH RISK ACTION: Blocked from auto-merge by Policy Rule #pol-1. Human approval required.</span>
          </div>
        );
      case 'medium':
        return (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>MEDIUM RISK: Draft Repair PR prepared. Unit test suite verified clean.</span>
          </div>
        );
      case 'low':
      default:
        return (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>SAFE LOW RISK: Refiner Agent patch verified. Ready for one-click merge.</span>
          </div>
        );
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#10131A] border border-slate-800 space-y-5 font-mono text-xs">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              REFINER AGENT REPAIR STUDIO
            </h3>
            <p className="text-slate-400 font-sans">
              Generating safe refactored patches & companion unit tests with rollback protection
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold uppercase">
          Target: {finding.file}
        </span>
      </div>

      {/* Risk Notice */}
      {getRiskNotice(finding.actionRisk)}

      {/* Target Finding Overview */}
      <div className="p-4 rounded-xl bg-[#08090D] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">{finding.title}</h4>
          <span className="text-rose-400 font-bold uppercase">{finding.severity} SEVERITY</span>
        </div>
        <p className="text-slate-300 font-sans text-xs leading-relaxed">{finding.summary}</p>
        <p className="text-slate-400 text-[11px]"><strong className="text-amber-400">Impact: </strong>{finding.impact}</p>
      </div>

      {/* Split View: Suggested Patch vs Companion Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Suggested Refactoring Patch */}
        <div className="p-4 rounded-xl bg-[#050608] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[#2BFF88]">
            <span className="font-bold flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4" />
              Proposed Code Refactor
            </span>
            <button
              onClick={handleCopyPatch}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copiedPatch ? <Check className="w-3.5 h-3.5 text-[#2BFF88]" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
          </div>
          <pre className="p-3 rounded-lg bg-[#08090D] border border-slate-800 text-[#2BFF88] overflow-x-auto text-[11px] leading-relaxed max-h-60">
            {finding.suggestedPatch || '// No automated patch provided'}
          </pre>
        </div>

        {/* Companion Unit Test */}
        <div className="p-4 rounded-xl bg-[#050608] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[#20E3FF]">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Companion Unit Test (Jest/Vitest)
            </span>
            <button
              onClick={handleCopyTest}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copiedTest ? <Check className="w-3.5 h-3.5 text-[#20E3FF]" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
          </div>
          <pre className="p-3 rounded-lg bg-[#08090D] border border-slate-800 text-[#20E3FF] overflow-x-auto text-[11px] leading-relaxed max-h-60">
            {finding.suggestedTest || '// No unit test suite generated'}
          </pre>
        </div>
      </div>

      {/* Rollback Guidance */}
      <div className="p-3 rounded-xl bg-[#08090D] border border-slate-800 flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-2">
          <Undo2 className="w-4 h-4 text-cyan-400" />
          Rollback Command: <code className="text-cyan-300">git revert HEAD -m "Git-Frog Refiner Rollback"</code>
        </span>
        <span className="text-[10px] uppercase font-bold text-emerald-400">REVERSIBLE BY DESIGN</span>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onRejectPatch(finding)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase transition-all cursor-pointer"
        >
          Reject Patch
        </button>

        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="px-6 py-2.5 rounded-xl bg-[#C8FF2E] hover:bg-[#b5eb1c] text-black font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(200,255,46,0.3)]"
        >
          <GitPullRequest className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Merging Repair PR...' : 'Approve & Merge Repair PR'}
        </button>
      </div>
    </div>
  );
};
