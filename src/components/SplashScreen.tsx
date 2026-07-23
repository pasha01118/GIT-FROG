import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Terminal, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  GitPullRequest,
  Bug,
  Lock,
  Bot
} from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isCatching, setIsCatching] = useState(false);
  const [capturedBugsCount, setCapturedBugsCount] = useState(3);

  const handleTriggerTongue = () => {
    setIsCatching(true);
    setTimeout(() => {
      setCapturedBugsCount((prev) => prev + 1);
      setIsCatching(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090D] text-slate-100 flex flex-col justify-between overflow-hidden font-sans selection:bg-[#C8FF2E] selection:text-black">
      {/* Background Animated Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(200,255,46,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(32,227,255,0.05),transparent_60%)] pointer-events-none" />
      
      {/* Hex Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C8FF2E 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#10131A] border border-[#C8FF2E]/30 flex items-center justify-center shadow-[0_0_15px_rgba(200,255,46,0.2)]">
            <span className="text-xl">🐸</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-wider text-white">GIT-FROG</span>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono font-semibold rounded bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
                v2.4 GUARDIAN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Continuous Repository Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#10131A] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-[#2BFF88] animate-pulse" />
            RIVER STREAM: ACTIVE
          </div>
          <button
            onClick={onEnter}
            className="px-5 py-2 text-xs font-mono uppercase font-semibold text-black bg-[#C8FF2E] hover:bg-[#b5eb1c] transition-all rounded-lg shadow-[0_0_20px_rgba(200,255,46,0.3)] hover:shadow-[0_0_30px_rgba(200,255,46,0.5)] flex items-center gap-2"
          >
            Enter Control Room
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Content Area */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-10 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Animated Frog Mascot Stage */}
        <div className="relative mb-8 group cursor-pointer" onClick={handleTriggerTongue}>
          {/* Neon Rim Aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#C8FF2E]/20 via-[#20E3FF]/20 to-[#FF4FD8]/20 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative w-40 h-40 rounded-full bg-[#10131A] border-2 border-[#C8FF2E] flex items-center justify-center shadow-[0_0_40px_rgba(200,255,46,0.25)] overflow-hidden">
            {/* Frog Mascot Eyes & Head Graphic */}
            <div className="relative flex flex-col items-center">
              {/* Eyes */}
              <div className="flex gap-6 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#C8FF2E] flex items-center justify-center border-2 border-[#08090D] shadow-[0_0_10px_#C8FF2E]">
                  <div className="w-3 h-3 rounded-full bg-[#08090D] animate-ping" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C8FF2E] flex items-center justify-center border-2 border-[#08090D] shadow-[0_0_10px_#C8FF2E]">
                  <div className="w-3 h-3 rounded-full bg-[#08090D] animate-ping" />
                </div>
              </div>
              
              {/* Mouth & Tongue */}
              <div className="w-16 h-3 rounded-full bg-[#1A1F2B] border border-[#C8FF2E]/50 flex items-center justify-center overflow-visible relative">
                {isCatching && (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: 120 }} 
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 -translate-x-1/2 h-2.5 bg-gradient-to-r from-[#FF4FD8] to-[#FF3B3B] rounded-full shadow-[0_0_15px_#FF4FD8] flex items-center justify-end px-1"
                  >
                    <span className="text-[10px]">🪲</span>
                  </motion.div>
                )}
              </div>

              <span className="text-4xl mt-1 select-none">🐸</span>
            </div>

            {/* Click hint */}
            <div className="absolute bottom-2 text-[9px] font-mono text-[#C8FF2E] opacity-70">
              [Click to catch bug]
            </div>
          </div>

          {/* Floating Target Bugs around the Frog */}
          <motion.div 
            animate={{ y: [0, -6, 0] }} 
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -top-2 -right-8 bg-[#10131A] border border-[#FF3B3B]/50 px-2.5 py-1 rounded-full text-xs font-mono text-[#FF3B3B] flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,59,59,0.3)]"
          >
            <Bug className="w-3.5 h-3.5" />
            CVE-2026-1029
          </motion.div>

          <motion.div 
            animate={{ y: [0, 6, 0] }} 
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-2 -left-10 bg-[#10131A] border border-[#FF4FD8]/50 px-2.5 py-1 rounded-full text-xs font-mono text-[#FF4FD8] flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,79,216,0.3)]"
          >
            <Lock className="w-3.5 h-3.5" />
            Secret Leak
          </motion.div>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          THE REPOSITORY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8FF2E] via-[#20E3FF] to-[#2BFF88]">GUARDIAN</span>
        </h1>

        <p className="max-w-2xl text-slate-300 text-base sm:text-lg mb-8 font-normal leading-relaxed">
          Git-Frog continuously watches your GitHub repositories, catches logic bugs & security vulnerabilities, reviews pull requests, and drafts safe automated repairs before defects reach production.
        </p>

        {/* Action Button Group */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          <button
            onClick={onEnter}
            className="px-8 py-4 text-sm font-mono uppercase font-bold text-black bg-[#C8FF2E] hover:bg-[#b3ea13] transition-all rounded-xl shadow-[0_0_25px_rgba(200,255,46,0.4)] hover:shadow-[0_0_35px_rgba(200,255,46,0.6)] hover:scale-[1.02] flex items-center gap-3 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-black" />
            Launch Control Room
          </button>

          <button
            onClick={handleTriggerTongue}
            className="px-6 py-4 text-sm font-mono uppercase font-semibold text-slate-200 bg-[#10131A] hover:bg-[#1A1F2B] border border-slate-700 transition-all rounded-xl hover:border-[#C8FF2E]/50 flex items-center gap-2 cursor-pointer"
          >
            <Bug className="w-4 h-4 text-[#FF3B3B]" />
            Test Bug Capture ({capturedBugsCount})
          </button>
        </div>

        {/* 4 Operating Model Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full text-left">
          <div className="p-4 rounded-xl bg-[#10131A]/80 border border-slate-800 backdrop-blur-sm hover:border-[#C8FF2E]/40 transition-all">
            <div className="flex items-center gap-2 text-[#C8FF2E] font-mono text-xs uppercase mb-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C8FF2E]" />
              01. OBSERVE
            </div>
            <p className="text-xs text-slate-300">
              Continuously watches commits, pull requests, issues, dependencies & CI events in real time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#10131A]/80 border border-slate-800 backdrop-blur-sm hover:border-[#20E3FF]/40 transition-all">
            <div className="flex items-center gap-2 text-[#20E3FF] font-mono text-xs uppercase mb-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#20E3FF]" />
              02. ANALYZE
            </div>
            <p className="text-xs text-slate-300">
              Deploys 9 specialist agents (Scout, Reviewer, Security, Bug Finder) for multi-angle code auditing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#10131A]/80 border border-slate-800 backdrop-blur-sm hover:border-[#FF4FD8]/40 transition-all">
            <div className="flex items-center gap-2 text-[#FF4FD8] font-mono text-xs uppercase mb-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF4FD8]" />
              03. ACT SAFELY
            </div>
            <p className="text-xs text-slate-300">
              Drafts safe repair PRs with companion unit tests, enforces policy rules, and maintains audit trails.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-[#08090D]/90 py-4 px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Git-Frog Guardian Platform • Enterprise Grade Code Governance</span>
          <span className="text-[#C8FF2E] font-bold">Safe by Design • Zero Unapproved Merges</span>
        </div>
      </footer>
    </div>
  );
};
