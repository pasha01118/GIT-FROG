import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bot, 
  Lock, 
  Settings, 
  Zap, 
  ChevronDown, 
  RefreshCw,
  GitBranch,
  Search,
  Eye,
  BarChart2,
  Wrench,
  HardDrive,
  Cpu,
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { Repository, OperatingMode } from '../types';

interface HeaderProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  activeMode: OperatingMode | 'digest' | 'health' | 'issues' | 'deploy';
  onChangeMode: (mode: OperatingMode | 'digest' | 'health' | 'issues' | 'deploy') => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  onOpenGuardianChat: () => void;
  onOpenPolicyModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenLoginModal: () => void;
  onOpenDriveModal?: () => void;
  onOpenAiEngineModal?: () => void;
  onReturnToSplash: () => void;
  user?: { name: string; avatar: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  activeMode,
  onChangeMode,
  onTriggerScan,
  isScanning,
  onOpenGuardianChat,
  onOpenPolicyModal,
  onOpenSettingsModal,
  onOpenLoginModal,
  onOpenDriveModal,
  onOpenAiEngineModal,
  onReturnToSplash,
  user
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    setShowExportMenu(false);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Repository,${selectedRepo.owner}/${selectedRepo.name}\n`
      + `Branch,${selectedRepo.branch}\n`
      + `Health Score,${selectedRepo.healthScore}/100\n`
      + `CI Status,${selectedRepo.ciStatus}\n`
      + `Open PRs,${selectedRepo.openPRs}\n`
      + `Active Alerts,${selectedRepo.activeAlerts}\n`
      + `Dependency Health,${selectedRepo.dependencyHealthScore}%\n`
      + `Export Timestamp,${new Date().toISOString()}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedRepo.name}_compliance_summary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Compliance Audit Report - ${selectedRepo.name}</title>
            <style>
              body { font-family: monospace; padding: 40px; background: #fff; color: #111; }
              h1 { color: #0284c7; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
              th { background: #f1f5f9; }
            </style>
          </head>
          <body>
            <h1>🐸 Git-Frog Guardian Compliance & Health Audit Report</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <table>
              <tr><th>Repository</th><td>${selectedRepo.owner}/${selectedRepo.name}</td></tr>
              <tr><th>Branch</th><td>${selectedRepo.branch}</td></tr>
              <tr><th>Health Index</th><td>${selectedRepo.healthScore}/100</td></tr>
              <tr><th>CI Pipeline Status</th><td>${selectedRepo.ciStatus.toUpperCase()}</td></tr>
              <tr><th>Dependency Health</th><td>${selectedRepo.dependencyHealthScore}%</td></tr>
              <tr><th>Active Security Alerts</th><td>${selectedRepo.activeAlerts}</td></tr>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `);
      reportWindow.document.close();
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-[#08090D]/95 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-3 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Repo Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={onReturnToSplash}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
            title="Return to Splash"
          >
            <div className="h-9 w-9 rounded-xl bg-[#10131A] border border-[#C8FF2E]/40 flex items-center justify-center shadow-[0_0_12px_rgba(200,255,46,0.2)] group-hover:border-[#C8FF2E] transition-all">
              <span className="text-lg">🐸</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wide group-hover:text-[#C8FF2E] transition-colors">
                  GIT-FROG
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
                  GUARDIAN
                </span>
              </div>
            </div>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Repository Selector Dropdown */}
          <div className="relative group">
            <select
              value={selectedRepo.id}
              onChange={(e) => {
                const found = repositories.find((r) => r.id === e.target.value);
                if (found) onSelectRepo(found);
              }}
              className="appearance-none bg-[#10131A] border border-slate-800 hover:border-[#C8FF2E]/40 text-xs font-mono text-slate-200 py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#C8FF2E] transition-all"
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.id} className="bg-[#10131A] text-slate-200">
                  {repo.owner}/{repo.name} ({repo.branch})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Operating Mode Navigation Pills */}
        <div className="hidden md:flex items-center bg-[#10131A] p-1.5 rounded-xl border border-slate-800/80 justify-center flex-wrap gap-1">
          <button
            onClick={() => onChangeMode('observe')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'observe'
                ? 'bg-[#C8FF2E] text-black font-bold shadow-[0_0_14px_rgba(200,255,46,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            Observe
          </button>

          <button
            onClick={() => onChangeMode('analyze')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'analyze'
                ? 'bg-[#20E3FF] text-black font-bold shadow-[0_0_14px_rgba(32,227,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Analyze
          </button>

          <button
            onClick={() => onChangeMode('act')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'act'
                ? 'bg-[#FF4FD8] text-black font-bold shadow-[0_0_14px_rgba(255,79,216,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Act & Repair
          </button>

          <button
            onClick={() => onChangeMode('digest')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'digest'
                ? 'bg-sky-400 text-black font-bold shadow-[0_0_14px_rgba(56,189,248,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Digest
          </button>

          <button
            onClick={() => onChangeMode('health')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'health'
                ? 'bg-emerald-400 text-black font-bold shadow-[0_0_14px_rgba(52,211,153,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Health
          </button>

          <button
            onClick={() => onChangeMode('issues')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'issues'
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_14px_rgba(34,211,238,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Issues
          </button>

          <button
            onClick={() => onChangeMode('deploy')}
            className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeMode === 'deploy'
                ? 'bg-purple-400 text-black font-bold shadow-[0_0_14px_rgba(192,132,252,0.4)]'
                : 'text-purple-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Deploy
          </button>
        </div>

        {/* Control Room Actions */}
        <div className="flex items-center gap-2">
          {/* Scan Button */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              isScanning
                ? 'bg-[#C8FF2E]/20 text-[#C8FF2E] border-[#C8FF2E]/50 animate-pulse'
                : 'bg-[#C8FF2E] text-black border-[#C8FF2E] hover:bg-[#b5eb1c] shadow-[0_0_15px_rgba(200,255,46,0.25)]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </button>

          {/* AI Guardian Assistant Trigger */}
          <button
            onClick={onOpenGuardianChat}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-semibold text-cyan-300 bg-[#10131A] hover:bg-[#1A1F2B] border border-cyan-500/30 hover:border-cyan-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Ask Git-Frog Guardian"
          >
            <Bot className="w-4 h-4 text-[#20E3FF]" />
            <span className="hidden lg:inline">Ask AI</span>
          </button>

          {/* Google Drive Storage Vault Button */}
          {onOpenDriveModal && (
            <button
              onClick={onOpenDriveModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-semibold text-cyan-300 bg-[#10131A] hover:bg-[#1A1F2B] border border-cyan-500/30 hover:border-cyan-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              title="Google Drive Cloud Vault"
            >
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Drive</span>
            </button>
          )}

          {/* AI Model Engine (Ollama + Cloud AI) Button */}
          {onOpenAiEngineModal && (
            <button
              onClick={onOpenAiEngineModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-semibold text-purple-300 bg-[#10131A] hover:bg-[#1A1F2B] border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              title="Configure Ollama & AI Models"
            >
              <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="hidden xl:inline">AI Config</span>
            </button>
          )}

          {/* Export Report Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-semibold text-emerald-300 bg-[#10131A] hover:bg-[#1A1F2B] border border-emerald-500/30 hover:border-emerald-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export Repository Compliance Summary"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#10131A] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-mono">
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Export as CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Print / Export PDF
                </button>
              </div>
            )}
          </div>

          {/* User Login Profile Button */}
          <button
            onClick={onOpenLoginModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono text-slate-300 bg-[#10131A] hover:bg-[#1A1F2B] border border-slate-800 hover:border-[#C8FF2E]/40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Auth SSO Login"
          >
            {user ? (
              <img src={user.avatar} alt="Avatar" className="w-4 h-4 rounded-full border border-[#C8FF2E]" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF2E]" />
            )}
            <span className="hidden xl:inline">{user ? user.name : 'Sign In'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 text-xs font-mono text-slate-400 hover:text-white bg-[#10131A] hover:bg-[#1A1F2B] border border-slate-800 rounded-lg transition-all cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
