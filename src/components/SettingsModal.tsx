import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  GitBranch, 
  ShieldCheck, 
  Sliders, 
  Bell, 
  Check, 
  Sun,
  Moon,
  Send,
  Eye,
  Zap
} from 'lucide-react';
import { Repository } from '../types';
import { useUserSettings } from '../hooks/useUserSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositories: Repository[];
  onAddRepo: (name: string, owner: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  repositories,
  onAddRepo
}) => {
  const { settings, updateSettings, triggerSlackTestAlert } = useUserSettings();
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoOwner, setNewRepoOwner] = useState('acme-corp');
  const [added, setAdded] = useState(false);
  const [slackTestSent, setSlackTestSent] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    onAddRepo(newRepoName.trim(), newRepoOwner.trim());
    setNewRepoName('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleTestSlack = async () => {
    setSlackTestSent(true);
    await triggerSlackTestAlert(repositories[0]?.name || 'git-frog-demo', settings.healthAlertThreshold);
    setTimeout(() => setSlackTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-mono text-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#10131A] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#08090D] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">GIT-FROG GUARDIAN SETTINGS</h3>
              <p className="text-slate-400 font-sans text-xs">
                Theme customization, Slack webhooks, alert thresholds & connected repositories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Global Theme Switcher */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C8FF2E]" />
              1. Visual Theme Engine (Accessibility)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-purple-950/30 border-purple-500 text-white shadow-[0_0_15px_rgba(192,132,252,0.2)]'
                    : 'bg-[#08090D] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Moon className={`w-5 h-5 ${settings.theme === 'dark' ? 'text-purple-400' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs block">Deep Space Dark</span>
                  <span className="text-[10px] text-slate-500 font-sans">Cyberpunk high-contrast dark palette</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-amber-950/30 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-[#08090D] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sun className={`w-5 h-5 ${settings.theme === 'light' ? 'text-amber-400' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs block">High-Contrast Light</span>
                  <span className="text-[10px] text-slate-500 font-sans">Clean high-contrast light theme</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Alert Thresholds & Slack Webhook */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              2. Alert Thresholds & Slack Notification Webhook
            </h4>

            <div className="p-4 rounded-xl bg-[#08090D] border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                    Health Score Alert Trigger (&lt; {settings.healthAlertThreshold})
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="95"
                    value={settings.healthAlertThreshold}
                    onChange={(e) => updateSettings({ healthAlertThreshold: Number(e.target.value) })}
                    className="w-full bg-[#10131A] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                    Dependency Health Threshold (&lt; {settings.dependencyAlertThreshold}%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="95"
                    value={settings.dependencyAlertThreshold}
                    onChange={(e) => updateSettings({ dependencyAlertThreshold: Number(e.target.value) })}
                    className="w-full bg-[#10131A] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Slack Webhook URL (<span className="text-cyan-400">SLACK_WEBHOOK_URL</span>)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.slackWebhookUrl}
                    onChange={(e) => updateSettings({ slackWebhookUrl: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="flex-1 bg-[#10131A] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestSlack}
                    className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {slackTestSent ? 'Sent!' : 'Test'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Connected Repositories */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#C8FF2E]" />
              3. Connected Repositories ({repositories.length})
            </h4>

            <div className="space-y-2">
              {repositories.map((repo) => (
                <div key={repo.id} className="p-3 rounded-xl bg-[#08090D] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{repo.owner}/{repo.name}</span>
                    <span className="text-slate-500 ml-2">[{repo.branch}]</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Webhook Active
                  </span>
                </div>
              ))}
            </div>

            {/* Form to connect new repo */}
            <form onSubmit={handleAdd} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newRepoOwner}
                onChange={(e) => setNewRepoOwner(e.target.value)}
                placeholder="Owner / Org"
                className="w-28 bg-[#08090D] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#C8FF2E]"
              />
              <input
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder="repository-name"
                className="flex-1 bg-[#08090D] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#C8FF2E]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C8FF2E] text-black font-bold uppercase rounded-lg hover:bg-[#b5eb1c] transition-all cursor-pointer"
              >
                {added ? 'Added!' : 'Connect'}
              </button>
            </form>
          </div>

          {/* Section 4: Default Agent Visibility */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-[#08090D] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-bold text-white">Default Specialist Agent Pipeline Mesh</span>
                  <p className="text-slate-400 font-sans text-xs">Keep agent mesh visible across all repository views</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ defaultAgentVisibility: !settings.defaultAgentVisibility })}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase cursor-pointer ${
                  settings.defaultAgentVisibility 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.defaultAgentVisibility ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
