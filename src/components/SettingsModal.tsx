import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  GitBranch, 
  ShieldCheck, 
  Key, 
  Sliders, 
  Bell, 
  Check, 
  Download,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { Repository } from '../types';

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
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoOwner, setNewRepoOwner] = useState('acme-corp');
  const [motionReduced, setMotionReduced] = useState(false);
  const [neonGlowEnabled, setNeonGlowEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    onAddRepo(newRepoName.trim(), newRepoOwner.trim());
    setNewRepoName('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
              <p className="text-slate-400 font-sans">Repository webhooks, permissions, policy preferences & UI motion controls</p>
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
          
          {/* Section 1: Connected Repositories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#C8FF2E]" />
              Connected GitHub Repositories ({repositories.length})
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

          {/* Section 2: Security & Governance */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Security & Approval Protections
            </h4>

            <div className="p-3 rounded-xl bg-[#08090D] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Require 2FA for High-Risk Actions</span>
                <p className="text-slate-400 font-sans text-xs">Sensitive PR refactors require secondary confirmation</p>
              </div>
              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-3 py-1 rounded-lg font-bold uppercase cursor-pointer ${
                  mfaEnabled ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {mfaEnabled ? 'ENFORCED' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Section 3: Visual & Motion Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#20E3FF]" />
              Interface Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#08090D] border border-slate-800 flex items-center justify-between">
                <span>Neon Rim Lighting</span>
                <button
                  onClick={() => setNeonGlowEnabled(!neonGlowEnabled)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase cursor-pointer ${
                    neonGlowEnabled ? 'bg-[#C8FF2E] text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {neonGlowEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#08090D] border border-slate-800 flex items-center justify-between">
                <span>Reduce Motion</span>
                <button
                  onClick={() => setMotionReduced(!motionReduced)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase cursor-pointer ${
                    motionReduced ? 'bg-[#20E3FF] text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {motionReduced ? 'YES' : 'NO'}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
