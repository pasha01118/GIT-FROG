import React from 'react';
import { 
  Eye, 
  BarChart2, 
  Wrench, 
  Bot, 
  Layers, 
  HeartPulse, 
  FileText
} from 'lucide-react';
import { OperatingMode } from '../types';

interface MobileBottomNavProps {
  activeMode: OperatingMode | 'digest' | 'health' | 'issues' | 'deploy';
  onChangeMode: (mode: OperatingMode | 'digest' | 'health' | 'issues' | 'deploy') => void;
  onOpenGuardianChat: () => void;
  isScanning: boolean;
  onTriggerScan: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeMode,
  onChangeMode,
  onOpenGuardianChat,
}) => {
  const navItems = [
    { id: 'observe', label: 'Observe', icon: Eye, color: 'text-[#C8FF2E]', activeBg: 'bg-[#C8FF2E]/15 text-[#C8FF2E]' },
    { id: 'analyze', label: 'Analyze', icon: BarChart2, color: 'text-[#20E3FF]', activeBg: 'bg-[#20E3FF]/15 text-[#20E3FF]' },
    { id: 'act', label: 'Act', icon: Wrench, color: 'text-[#FF4FD8]', activeBg: 'bg-[#FF4FD8]/15 text-[#FF4FD8]' },
    { id: 'digest', label: 'Digest', icon: FileText, color: 'text-sky-400', activeBg: 'bg-sky-500/15 text-sky-400' },
    { id: 'health', label: 'Health', icon: HeartPulse, color: 'text-emerald-400', activeBg: 'bg-emerald-500/15 text-emerald-400' },
    { id: 'deploy', label: 'Deploy', icon: Layers, color: 'text-purple-400', activeBg: 'bg-purple-500/15 text-purple-400' }
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08090D]/95 border-t border-slate-800/90 backdrop-blur-xl px-1 py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.6)] font-mono max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between gap-0.5 w-full max-w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeMode(item.id as any)}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 py-1 px-0.5 rounded-lg transition-all active:scale-90 cursor-pointer ${
                isActive 
                  ? `${item.activeBg} font-bold shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-slate-700/60` 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'text-slate-400'}`} />
              <span className="text-[9px] tracking-tighter mt-0.5 leading-none truncate max-w-full">{item.label}</span>
            </button>
          );
        })}

        {/* Floating AI Chat Trigger on Mobile */}
        <button
          onClick={onOpenGuardianChat}
          className="flex flex-col items-center justify-center flex-1 min-w-0 py-1 px-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 transition-all active:scale-90 cursor-pointer shadow-[0_0_10px_rgba(32,227,255,0.2)]"
        >
          <Bot className="w-3.5 h-3.5 text-[#20E3FF] animate-pulse" />
          <span className="text-[9px] tracking-tighter mt-0.5 leading-none text-cyan-300 font-bold truncate max-w-full">Ask AI</span>
        </button>
      </div>
    </div>
  );
};
