import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Play, 
  Plus, 
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import { Repository } from '../types';

interface IssueBranchTrackerProps {
  repository: Repository;
}

export const IssueBranchTracker: React.FC<IssueBranchTrackerProps> = ({
  repository
}) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'branches' | 'releases' | 'ci_runs'>('issues');
  const [newIssueTitle, setNewIssueTitle] = useState('');

  const [issues, setIssues] = useState([
    { id: 'iss-1', number: 88, title: 'Memory spike under concurrent Stripe webhooks', author: 'dev-alex', status: 'open', priority: 'high', labels: ['bug', 'performance'], createdAt: '2 hours ago' },
    { id: 'iss-2', number: 85, title: 'Upgrade express framework to 5.x ESM build', author: 'git-frog[bot]', status: 'open', priority: 'medium', labels: ['dependencies'], createdAt: '1 day ago' },
    { id: 'iss-3', number: 79, title: 'Add Prometheus metrics exporter endpoint', author: 'sarah-eng', status: 'closed', priority: 'low', labels: ['feature'], createdAt: '3 days ago' }
  ]);

  const branches = [
    { name: 'main', protected: true, lastCommit: '8f3a12b - Fix token refresh race', author: 'sarah-eng', time: '1 hour ago' },
    { name: 'feature/idempotency', protected: false, lastCommit: '90123f1 - Add idempotency lock check', author: 'dev-alex', time: '2 hours ago' },
    { name: 'git-frog/patch-express-sec', protected: false, lastCommit: '1029381 - Bump express dependency', author: 'git-frog[bot]', time: '4 hours ago' }
  ];

  const releases = [
    { tag: 'v2.4.0', name: 'v2.4.0 Idempotency & Security Patch Release', date: 'Yesterday', commitsCount: 18, author: 'sarah-eng', status: 'published' },
    { tag: 'v2.3.1', name: 'v2.3.1 Express patch update', date: '5 days ago', commitsCount: 6, author: 'git-frog[bot]', status: 'published' }
  ];

  const ciRuns = [
    { id: 'run-891', name: 'CI Suite #891 (main)', duration: '48s', status: 'passing', testsPassed: '142/142', coverage: '94.2%', commit: '8f3a12b' },
    { id: 'run-890', name: 'PR #142 Dry-Run Verification', duration: '52s', status: 'failing', testsPassed: '139/142', coverage: '91.8%', commit: '90123f1' }
  ];

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;

    setIssues(prev => [
      {
        id: `iss-${Date.now()}`,
        number: Math.floor(Math.random() * 50) + 90,
        title: newIssueTitle.trim(),
        author: 'You',
        status: 'open',
        priority: 'high',
        labels: ['user-report'],
        createdAt: 'Just now'
      },
      ...prev
    ]);
    setNewIssueTitle('');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              REPOS & BRANCH INTELLIGENCE
            </h3>
            <p className="text-slate-400 font-sans">
              Issue tracking, active branch security checks & CI pipeline logs
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-[#10131A] p-1 rounded-xl border border-slate-800">
          {(['issues', 'branches', 'releases', 'ci_runs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-cyan-400 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content 1: Issues */}
      {activeTab === 'issues' && (
        <div className="space-y-3">
          {/* Create Issue Bar */}
          <form onSubmit={handleCreateIssue} className="flex gap-2 bg-[#10131A] p-2 rounded-xl border border-slate-800">
            <input
              type="text"
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
              placeholder="Report issue or feature flaw to Git-Frog Guardian..."
              className="flex-1 bg-[#08090D] border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-400 text-black font-bold uppercase rounded-lg hover:bg-cyan-300 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              File Issue
            </button>
          </form>

          {/* Issues List */}
          <div className="space-y-2">
            {issues.map((iss) => (
              <div key={iss.id} className="p-3.5 rounded-xl bg-[#10131A] border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-4 h-4 ${iss.status === 'open' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">#{iss.number}: {iss.title}</span>
                      {iss.labels.map(l => (
                        <span key={l} className="px-1.5 py-0.5 text-[9px] rounded bg-slate-800 text-cyan-300">
                          {l}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400">Opened by {iss.author} • {iss.createdAt}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  iss.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {iss.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Branches */}
      {activeTab === 'branches' && (
        <div className="space-y-2">
          {branches.map((b) => (
            <div key={b.name} className="p-3.5 rounded-xl bg-[#10131A] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{b.name}</span>
                    {b.protected && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        PROTECTED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{b.lastCommit} • {b.author}</p>
                </div>
              </div>
              <span className="text-slate-500 text-[10px]">{b.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Releases */}
      {activeTab === 'releases' && (
        <div className="space-y-2">
          {releases.map((r) => (
            <div key={r.tag} className="p-3.5 rounded-xl bg-[#10131A] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-[#C8FF2E]" />
                <div>
                  <span className="font-bold text-white text-sm">{r.name}</span>
                  <p className="text-[10px] text-slate-400">{r.commitsCount} commits • Published {r.date} by {r.author}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: CI Runs */}
      {activeTab === 'ci_runs' && (
        <div className="space-y-2">
          {ciRuns.map((r) => (
            <div key={r.id} className="p-3.5 rounded-xl bg-[#10131A] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {r.status === 'passing' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2BFF88]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#FF3B3B]" />
                )}
                <div>
                  <span className="font-bold text-white">{r.name}</span>
                  <p className="text-[10px] text-slate-400">Tests: {r.testsPassed} • Coverage: {r.coverage} • Duration: {r.duration}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${
                r.status === 'passing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
