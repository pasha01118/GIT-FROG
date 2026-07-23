import React, { useState } from 'react';
import { 
  Github, 
  Mail, 
  Lock, 
  X, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; avatar: string; provider: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleGithubLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess({
        name: 'Enterprise Security Lead',
        email: 'sec-lead@acme.corp',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        provider: 'GitHub OAuth 2.0'
      });
      onClose();
    }, 800);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess({
        name: email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        provider: 'Enterprise SSO'
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[#10131A] border border-[#C8FF2E]/40 shadow-[0_0_50px_rgba(200,255,46,0.2)] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#08090D] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">GIT-FROG AUTHENTICATION</h3>
              <p className="text-slate-400 font-sans text-xs">Enterprise SSO & GitHub App OAuth Authorization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* GitHub OAuth Button */}
          <button
            onClick={handleGithubLogin}
            disabled={isAuthenticating}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700 shadow-md"
          >
            <Github className="w-4 h-4 text-[#C8FF2E]" />
            {isAuthenticating ? 'Authenticating...' : 'Sign In with GitHub Enterprise'}
          </button>

          <div className="flex items-center gap-3 my-2 text-slate-600">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-bold uppercase">OR ENTERPRISE SSO</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-slate-300 text-xs font-bold block">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@acme.corp"
                required
                className="w-full bg-[#08090D] border border-slate-800 focus:border-[#C8FF2E] rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 text-xs font-bold block">SSO Token or Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#08090D] border border-slate-800 focus:border-[#C8FF2E] rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 rounded-xl bg-[#C8FF2E] hover:bg-[#b5eb1c] text-black font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(200,255,46,0.3)] mt-2"
            >
              <Key className="w-4 h-4" />
              {isAuthenticating ? 'Verifying Credentials...' : 'Authenticate Guardian Access'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
