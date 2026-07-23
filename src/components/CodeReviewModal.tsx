import React, { useState } from 'react';
import { 
  GitPullRequest, 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Bug, 
  Wrench, 
  Bot, 
  Play, 
  Copy, 
  Check,
  FileCode2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { PullRequest, Finding } from '../types';

interface CodeReviewModalProps {
  pullRequest: PullRequest;
  findings: Finding[];
  onClose: () => void;
  onApplyPatch: (finding: Finding) => void;
  onRunLiveGeminiReview: (diff: string, repoName: string) => Promise<void>;
  isAnalyzing: boolean;
}

export const CodeReviewModal: React.FC<CodeReviewModalProps> = ({
  pullRequest,
  findings,
  onClose,
  onApplyPatch,
  onRunLiveGeminiReview,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'diff' | 'findings' | 'live_ai'>('diff');
  const [customDiffText, setCustomDiffText] = useState<string>(pullRequest.diffContent);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#10131A] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#08090D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#20E3FF]/10 text-[#20E3FF] border border-[#20E3FF]/30">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base sm:text-lg">
                  PR #{pullRequest.number}: {pullRequest.title}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Risk Score: {pullRequest.riskScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {pullRequest.sourceBranch} → {pullRequest.targetBranch} • {pullRequest.additions} additions, {pullRequest.deletions} deletions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#08090D]/50 border-b border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-[#20E3FF] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Diff Inspector ({pullRequest.changedFiles.length} files)
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'findings'
                ? 'bg-[#FF3B3B] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Agent Findings ({findings.length})
          </button>

          <button
            onClick={() => setActiveTab('live_ai')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'live_ai'
                ? 'bg-[#C8FF2E] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Live Gemini Review Tool
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs">
          
          {/* TAB 1: Diff Inspector */}
          {activeTab === 'diff' && (
            <div className="space-y-4">
              <div className="bg-[#08090D] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Changed Files:</span>
                <div className="flex gap-2 flex-wrap">
                  {pullRequest.changedFiles.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Diff Box */}
              <div className="rounded-xl bg-[#050608] border border-slate-800 p-4 font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                {pullRequest.diffContent.split('\n').map((line, idx) => {
                  let lineStyle = 'text-slate-400';
                  if (line.startsWith('+') && !line.startsWith('+++')) lineStyle = 'text-[#2BFF88] bg-[#2BFF88]/5 px-1 rounded';
                  if (line.startsWith('-') && !line.startsWith('---')) lineStyle = 'text-[#FF3B3B] bg-[#FF3B3B]/5 px-1 rounded';
                  if (line.startsWith('@@')) lineStyle = 'text-cyan-400 font-bold bg-cyan-950/30 px-1 py-0.5 rounded';

                  return (
                    <div key={idx} className={`py-0.5 ${lineStyle}`}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Agent Findings */}
          {activeTab === 'findings' && (
            <div className="space-y-4">
              {findings.map((finding, idx) => (
                <div
                  key={finding.id}
                  className="p-4 rounded-xl bg-[#08090D] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <Bug className="w-4 h-4" />
                      </span>
                      <h4 className="font-bold text-white text-sm">{finding.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        {finding.severity}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Confidence: {finding.confidence}%
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {finding.summary}
                  </p>

                  <div className="bg-[#10131A] p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-[#C8FF2E] font-bold">Evidence ({finding.file} lines {finding.lineRange.join('-')}):</span>
                    <pre className="mt-1 text-slate-200 overflow-x-auto text-[11px] font-mono">{finding.evidence}</pre>
                  </div>

                  {finding.suggestedPatch && (
                    <div className="bg-[#050608] p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between text-emerald-400 mb-1">
                        <span className="font-bold">Suggested Refiner Patch:</span>
                        <button
                          onClick={() => handleCopy(finding.suggestedPatch!, idx)}
                          className="text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Copy Patch
                        </button>
                      </div>
                      <pre className="text-[#2BFF88] overflow-x-auto text-[11px] font-mono">{finding.suggestedPatch}</pre>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => onApplyPatch(finding)}
                      className="px-4 py-2 rounded-lg bg-[#C8FF2E] hover:bg-[#b5eb1c] text-black font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4" />
                      Open Repair Studio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Live Gemini AI Reviewer Tool */}
          {activeTab === 'live_ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#08090D] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[#C8FF2E]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold uppercase">Live Gemini 3.6 Flash Review Pipeline</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">
                  Paste or edit any code diff snippet below and invoke Git-Frog's server-side Gemini AI engine to perform instant multi-agent bug finding & patch generation.
                </p>
              </div>

              <textarea
                value={customDiffText}
                onChange={(e) => setCustomDiffText(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-[#050608] border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#C8FF2E] transition-all resize-none"
                placeholder="Paste unified code diff here..."
              />

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Model: <strong className="text-white">gemini-3.6-flash (Server-side)</strong></span>
                <button
                  onClick={() => onRunLiveGeminiReview(customDiffText, pullRequest.title)}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-[#C8FF2E] hover:bg-[#b5eb1c] text-black font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(200,255,46,0.3)]"
                >
                  <Play className={`w-4 h-4 fill-black ${isAnalyzing ? 'animate-spin' : ''}`} />
                  {isAnalyzing ? 'Analyzing Diff...' : 'Execute AI Review'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
