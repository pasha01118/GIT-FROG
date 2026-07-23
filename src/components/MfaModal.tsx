import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  X, 
  Key, 
  CheckCircle2, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { Finding, ActionRiskLevel } from '../types';

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionTitle: string;
  riskLevel: ActionRiskLevel;
}

export const MfaModal: React.FC<MfaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionTitle,
  riskLevel
}) => {
  const [code, setCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      setError(true);
      return;
    }

    setIsVerifying(true);
    setError(false);

    setTimeout(() => {
      setIsVerifying(false);
      onConfirm();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[#10131A] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-purple-950/30 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-purple-300">
            <Lock className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm uppercase">2-Step MFA Policy Verification</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleVerify} className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">Target Action:</span>
            <p className="font-bold text-white text-xs">{actionTitle}</p>
            <span className="text-[10px] text-purple-300/80 block mt-1">
              Risk Level: <strong className="text-rose-400 uppercase">{riskLevel}</strong> • Enforced by Policy Rule #pol-1
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-xs flex items-center gap-1.5 font-bold">
              <Smartphone className="w-4 h-4 text-[#C8FF2E]" />
              Enter 2FA Security Code or YubiKey Passcode
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="e.g. 849201"
              maxLength={8}
              className="w-full bg-[#08090D] border border-slate-800 focus:border-purple-400 rounded-xl p-3 text-center text-lg font-bold text-white tracking-widest focus:outline-none"
              autoFocus
            />
            {error && (
              <span className="text-rose-400 text-[10px] block font-bold">
                Invalid verification code. Please enter 6-digit MFA passcode.
              </span>
            )}
            <span className="text-slate-500 text-[10px] block text-center">
              Demo tip: Type any 6-digit code (e.g. 123456) to confirm.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              {isVerifying ? 'Verifying 2FA...' : 'Authorize Action'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
