import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  Key, 
  Server, 
  Check, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Zap
} from 'lucide-react';
import { AiModelSettings, loadAiSettings, saveAiSettings, aiProviderService } from '../lib/aiProvider';

interface AiModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AiModelSettingsModal: React.FC<AiModelSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [settings, setSettings] = useState<AiModelSettings>(loadAiSettings());
  const [ollamaStatus, setOllamaStatus] = useState<{ active: boolean; models: string[] }>({ active: false, models: [] });
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkOllama();
    }
  }, [isOpen]);

  const checkOllama = async () => {
    setIsCheckingOllama(true);
    const res = await aiProviderService.checkOllamaStatus(settings.ollamaEndpoint);
    setOllamaStatus(res);
    setIsCheckingOllama(false);
  };

  const handleSave = () => {
    saveAiSettings(settings);
    setSavedBanner(true);
    if (onSaved) onSaved();
    setTimeout(() => setSavedBanner(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-fadeIn">
      <div className="bg-[#0C0E14] border border-purple-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_40px_rgba(192,132,252,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#10131A] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wider flex items-center gap-2">
                AI MODEL ENGINE CONFIGURATION
                <span className="px-2 py-0.5 text-[10px] bg-purple-950 text-purple-300 rounded border border-purple-500/40">
                  OLLAMA + CLOUD AI
                </span>
              </h2>
              <p className="text-slate-400 font-sans text-xs">
                Configure local Ollama LLMs, Cloud AI Keys & automatic Gemini fallback cascade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {savedBanner && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              AI Model settings updated and saved locally!
            </div>
          )}

          {/* Primary Model Provider Selector */}
          <div className="space-y-3">
            <label className="font-bold text-white uppercase text-xs tracking-wider block">
              Primary AI Provider Selection
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'ollama', name: 'Ollama (Local)', icon: Server, badge: ollamaStatus.active ? 'ONLINE' : 'OFFLINE', badgeBg: ollamaStatus.active ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400' },
                { id: 'openai', name: 'OpenAI (GPT-4o)', icon: Bot, badge: 'CLOUD', badgeBg: 'bg-cyan-950 text-cyan-400' },
                { id: 'gemini', name: 'Gemini 3.6 (Proxy)', icon: Sparkles, badge: 'DEFAULT', badgeBg: 'bg-purple-950 text-purple-400' }
              ].map((prov) => {
                const Icon = prov.icon;
                const isSel = settings.primaryProvider === prov.id;
                return (
                  <button
                    key={prov.id}
                    onClick={() => setSettings({ ...settings, primaryProvider: prov.id as any })}
                    className={`p-3 rounded-xl border transition-all text-left cursor-pointer flex flex-col justify-between h-20 ${
                      isSel 
                        ? 'bg-purple-950/30 border-purple-500 text-white shadow-[0_0_15px_rgba(192,132,252,0.2)]' 
                        : 'bg-[#08090D] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSel ? 'text-purple-400' : 'text-slate-400'}`} />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${prov.badgeBg}`}>
                        {prov.badge}
                      </span>
                    </div>
                    <span className="font-bold text-xs">{prov.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: Local Ollama Configuration */}
          <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-[#C8FF2E]" />
                1. Local Ollama Server Setup
              </span>
              <button
                onClick={checkOllama}
                disabled={isCheckingOllama}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingOllama ? 'animate-spin' : ''}`} />
                Ping Ollama
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Ollama Endpoint URL
                </label>
                <input
                  type="text"
                  value={settings.ollamaEndpoint}
                  onChange={(e) => setSettings({ ...settings, ollamaEndpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full bg-[#050608] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Ollama Model Tag
                </label>
                <input
                  type="text"
                  value={settings.ollamaModel}
                  onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
                  placeholder="codellama, llama3, qwen2.5-coder"
                  className="w-full bg-[#050608] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#050608] border border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Detected Models ({ollamaStatus.models.length}):
              </span>
              <span className="text-[10px] text-slate-300 font-bold truncate max-w-xs">
                {ollamaStatus.models.length > 0 ? ollamaStatus.models.join(', ') : 'None detected'}
              </span>
            </div>
          </div>

          {/* SECTION 2: Cloud AI API Keys */}
          <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-3">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 block">
              <Key className="w-4 h-4 text-cyan-400" />
              2. Cloud AI Model Credentials (Optional)
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#050608] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={settings.anthropicApiKey}
                  onChange={(e) => setSettings({ ...settings, anthropicApiKey: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full bg-[#050608] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Gemini Fallback Toggle */}
          <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white text-xs block flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Automatic Gemini 3.6 Fallback Proxy
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                If local Ollama or Cloud APIs fail/timeout, route seamlessly through Gemini server proxy.
              </span>
            </div>

            <button
              onClick={() => setSettings({ ...settings, fallbackGeminiEnabled: !settings.fallbackGeminiEnabled })}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                settings.fallbackGeminiEnabled ? 'bg-purple-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                settings.fallbackGeminiEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#10131A] border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-sans">
            Keys are kept locally in browser session memory.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(192,132,252,0.3)]"
            >
              <Check className="w-4 h-4" />
              Save AI Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
