import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Terminal, 
  User, 
  Wrench, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, Repository } from '../types';

interface GuardianChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRepo: Repository;
}

export const GuardianChatDrawer: React.FC<GuardianChatDrawerProps> = ({
  isOpen,
  onClose,
  selectedRepo
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'guardian',
      text: `Greetings! I am **Git-Frog OMEGA-ASSIST**, your Repository Guardian. I am actively watching **${selectedRepo.owner}/${selectedRepo.name}**.\n\nHow can I assist you with code reviews, security remediation, or policy enforcement today?`,
      timestamp: 'Just now',
      actionButtons: [
        { label: 'Explain PR #142 Risk', action: 'explain_pr' },
        { label: 'Check Security Vault', action: 'check_security' },
        { label: 'Draft Safe Refactor', action: 'draft_refactor' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ask-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          repoContext: selectedRepo,
        })
      });

      const data = await response.json();

      const guardianMsg: ChatMessage = {
        id: `guardian-${Date.now()}`,
        sender: 'guardian',
        text: data.answer || 'Git-Frog Guardian completed the repository check.',
        timestamp: 'Just now',
        actionButtons: data.actionButtons || []
      };

      setMessages((prev) => [...prev, guardianMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'guardian',
        text: '⚠️ Communication issue contacting Git-Frog Guardian API. Retrying connection...',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#08090D] border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col font-mono text-xs">
      
      {/* Drawer Header */}
      <div className="p-4 bg-[#10131A] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#20E3FF]/10 text-[#20E3FF] border border-[#20E3FF]/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              GIT-FROG GUARDIAN AI
              <span className="w-2 h-2 rounded-full bg-[#2BFF88] animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400">Context: {selectedRepo.name} ({selectedRepo.branch})</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
              {msg.sender === 'user' ? (
                <span>You</span>
              ) : (
                <span className="text-[#20E3FF] font-bold flex items-center gap-1">
                  <Bot className="w-3 h-3" /> Git-Frog OMEGA-ASSIST
                </span>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed font-sans text-xs whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#20E3FF] text-black font-semibold rounded-tr-none'
                  : 'bg-[#10131A] border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {msg.text}

              {/* Action Chip Suggestions */}
              {msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-800/60">
                  {msg.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(btn.label)}
                      className="px-2.5 py-1 rounded-lg bg-[#08090D] hover:bg-slate-800 text-[#C8FF2E] border border-[#C8FF2E]/30 font-mono text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {btn.label}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
            <Sparkles className="w-4 h-4 text-[#C8FF2E] animate-spin" />
            Git-Frog Guardian analyzing code intelligence...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-[#10131A] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Git-Frog Guardian about PRs, security, or fixes..."
            className="flex-1 bg-[#08090D] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#20E3FF] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-xl bg-[#20E3FF] hover:bg-cyan-300 disabled:opacity-50 text-black font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(32,227,255,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
