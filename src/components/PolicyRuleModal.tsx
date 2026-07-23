import React, { useState } from 'react';
import { 
  Lock, 
  X, 
  Plus, 
  ShieldCheck, 
  Code2, 
  AlertTriangle 
} from 'lucide-react';
import { PolicyRule, ActionRiskLevel } from '../types';

interface PolicyRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRule: (rule: Omit<PolicyRule, 'id'>) => void;
}

export const PolicyRuleModal: React.FC<PolicyRuleModalProps> = ({
  isOpen,
  onClose,
  onAddRule
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PolicyRule['category']>('security');
  const [minRisk, setMinRisk] = useState<ActionRiskLevel>('high');
  const [ruleCode, setRuleCode] = useState('ENFORCE_TEST_COVERAGE()');
  const [actionOnViolation, setActionOnViolation] = useState<PolicyRule['actionOnViolation']>('block');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddRule({
      name,
      description,
      category,
      enabled: true,
      minRiskForApproval: minRisk,
      ruleCode,
      actionOnViolation
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#10131A] border border-fuchsia-500/40 shadow-[0_0_50px_rgba(232,121,249,0.2)] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-fuchsia-950/30 border-b border-fuchsia-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-fuchsia-300">
            <Lock className="w-5 h-5 text-fuchsia-400" />
            <h3 className="font-bold text-sm uppercase">Create Custom Governance Policy Rule</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Policy Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Enforce Minimum Test Coverage in Billing Modules"
              required
              className="w-full bg-[#08090D] border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what this policy enforces across repositories..."
              rows={2}
              className="w-full bg-[#08090D] border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-white focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#08090D] border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="security">Security</option>
                <option value="code_quality">Code Quality</option>
                <option value="dependencies">Dependencies</option>
                <option value="approvals">Approvals</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Action on Violation</label>
              <select
                value={actionOnViolation}
                onChange={(e) => setActionOnViolation(e.target.value as any)}
                className="w-full bg-[#08090D] border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="block">Block Auto-Merge</option>
                <option value="warn">Warn in PR Comment</option>
                <option value="require_mfa">Require 2FA MFA</option>
                <option value="create_issue">Create Issue</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Rule Code Identifier</label>
            <input
              type="text"
              value={ruleCode}
              onChange={(e) => setRuleCode(e.target.value)}
              placeholder="e.g. REQUIRE_UNIT_TESTS(threshold = 90)"
              className="w-full bg-[#08090D] border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-[#C8FF2E] font-mono focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold uppercase transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(232,121,249,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Save Policy Rule
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
