import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { RepositoryHealthCard } from './components/RepositoryHealthCard';
import { AgentPipeline } from './components/AgentPipeline';
import { ObserveStream } from './components/ObserveStream';
import { CodeReviewModal } from './components/CodeReviewModal';
import { SecurityVault } from './components/SecurityVault';
import { DependencyHealth } from './components/DependencyHealth';
import { RepairAssistance } from './components/RepairAssistance';
import { PolicyAndAudit } from './components/PolicyAndAudit';
import { GuardianChatDrawer } from './components/GuardianChatDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ExecutiveDigest } from './components/ExecutiveDigest';
import { HealthAnalytics } from './components/HealthAnalytics';
import { IssueBranchTracker } from './components/IssueBranchTracker';
import { MfaModal } from './components/MfaModal';
import { PolicyRuleModal } from './components/PolicyRuleModal';
import { LoginModal } from './components/LoginModal';
import { DeploymentChecklist } from './components/DeploymentChecklist';
import { MobileBottomNav } from './components/MobileBottomNav';

import {
  INITIAL_REPOSITORIES,
  INITIAL_AGENTS,
  INITIAL_ACTIVITY_STREAM,
  INITIAL_FINDINGS,
  INITIAL_PULL_REQUESTS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_DEPENDENCIES,
  INITIAL_POLICY_RULES,
  INITIAL_AUDIT_TRAIL,
  INITIAL_HEALTH_HISTORY
} from './data/mockData';

import {
  Repository,
  OperatingMode,
  SpecialistAgent,
  ActivityEvent,
  Finding,
  PullRequest,
  SecurityAlert,
  DependencyPackage,
  PolicyRule,
  AuditEvent,
  HealthMetricHistory
} from './types';

export default function App() {
  // Splash Screen View State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // App Core State
  const [repositories, setRepositories] = useState<Repository[]>(INITIAL_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState<Repository>(INITIAL_REPOSITORIES[0]);
  const [activeMode, setActiveMode] = useState<OperatingMode | 'digest' | 'health' | 'issues' | 'deploy'>('observe');

  // User Authentication State
  const [user, setUser] = useState<{ name: string; email: string; avatar: string; provider: string } | null>({
    name: 'Enterprise Security Lead',
    email: 'sec-lead@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    provider: 'GitHub OAuth 2.0'
  });

  // Intelligence Data State
  const [agents, setAgents] = useState<SpecialistAgent[]>(INITIAL_AGENTS);
  const [activityStream, setActivityStream] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_STREAM);
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(INITIAL_PULL_REQUESTS);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(INITIAL_SECURITY_ALERTS);
  const [dependencies, setDependencies] = useState<DependencyPackage[]>(INITIAL_DEPENDENCIES);
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICY_RULES);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  const [healthHistory, setHealthHistory] = useState<HealthMetricHistory[]>(INITIAL_HEALTH_HISTORY);

  // Modal & Drawer UI States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [selectedRepairFinding, setSelectedRepairFinding] = useState<Finding | null>(null);
  const [isGuardianChatOpen, setIsGuardianChatOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isPolicyRuleModalOpen, setIsPolicyRuleModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState<boolean>(false);
  const [pendingMfaFinding, setPendingMfaFinding] = useState<Finding | null>(null);

  // 1. Run Live Multi-Agent Repository Scan
  const handleTriggerScan = () => {
    setIsScanning(true);

    // Animate agents to analyzing state
    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'analyzing',
        currentTask: `Scanning ${selectedRepo.name} diffs and dependency trees...`
      }))
    );

    setTimeout(() => {
      setIsScanning(false);

      // Return agents to watching/completed state
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === 'security' || a.id === 'bug_finder') {
            return {
              ...a,
              status: 'action_required',
              lastActive: 'Just now',
              findingsCount: a.findingsCount + 1,
              currentTask: 'Generated new findings. Review required.'
            };
          }
          return {
            ...a,
            status: 'watching',
            lastActive: 'Just now',
            currentTask: 'Monitoring event stream...'
          };
        })
      );

      // Append new event to river
      const newEvent: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'pr',
        title: `Scan Completed on ${selectedRepo.name}`,
        author: 'Git-Frog Guardian',
        repo: selectedRepo.name,
        timestamp: 'Just now',
        status: 'Analyzed',
        summary: 'All 9 Specialist Agents completed continuous scan. 0 new critical secrets detected.',
        risk: 'low'
      };

      setActivityStream((prev) => [newEvent, ...prev]);

      // Add audit log
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        agent: 'scout',
        action: 'RUN_FULL_SCAN',
        target: selectedRepo.name,
        details: 'Manual trigger scan executed. All policy checks passed.',
        riskLevel: 'low',
        status: 'success'
      };

      setAuditTrail((prev) => [newAudit, ...prev]);
    }, 1500);
  };

  // 2. Run Gemini AI Code Review Tool on Custom Diff
  const handleRunLiveGeminiReview = async (diffText: string, titleName: string) => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/analyze-diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diff: diffText,
          repoName: selectedRepo.name,
          fileName: 'src/controllers/billing.ts',
          prTitle: titleName
        })
      });

      const data = await response.json();

      if (data.findings && Array.isArray(data.findings)) {
        const newFindings: Finding[] = data.findings.map((f: any, i: number) => ({
          id: `gemini-find-${Date.now()}-${i}`,
          title: f.title || 'AI Identified Code Finding',
          agent: f.agent || 'reviewer',
          category: f.category || 'logic_bug',
          severity: f.severity || 'high',
          confidence: f.confidence || 92,
          file: f.file || 'src/code.ts',
          lineRange: f.lineRange || [1, 20],
          evidence: f.evidence || 'Sample evidence code',
          summary: f.summary || 'Gemini Flash analysis finding.',
          impact: f.impact || 'Review recommended.',
          suggestedPatch: f.suggestedPatch || '// Refactored clean code',
          suggestedTest: f.suggestedTest || '// Companion test code',
          actionRisk: f.actionRisk || 'medium',
          status: 'open',
          createdAt: 'Just now'
        }));

        setFindings((prev) => [...newFindings, ...prev]);
      }
    } catch (err) {
      console.error('Failed to run Gemini live review:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // 3. Approve and Merge Repair PR (with MFA check for High/Sensitive actions)
  const handleApproveAndMerge = (finding: Finding) => {
    if (finding.actionRisk === 'high' || finding.actionRisk === 'sensitive') {
      setPendingMfaFinding(finding);
      setIsMfaModalOpen(true);
      return;
    }

    executeMerge(finding);
  };

  const executeMerge = (finding: Finding) => {
    // Update finding status
    setFindings((prev) =>
      prev.map((f) => (f.id === finding.id ? { ...f, status: 'resolved' } : f))
    );

    // Reduce alert count on repository
    setSelectedRepo((prev) => ({
      ...prev,
      activeAlerts: Math.max(0, prev.activeAlerts - 1),
      healthScore: Math.min(100, prev.healthScore + 3)
    }));

    // Add Audit Log
    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      agent: 'refiner',
      action: 'APPROVE_REPAIR_PR',
      target: finding.file,
      details: `Merged safe repair patch for finding "${finding.title}". Unit tests verified green. 2FA verified.`,
      riskLevel: finding.actionRisk,
      status: 'success'
    };

    setAuditTrail((prev) => [newAudit, ...prev]);
    setSelectedRepairFinding(null);
  };

  const handleTogglePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAddPolicyRule = (newRule: Omit<PolicyRule, 'id'>) => {
    const rule: PolicyRule = {
      ...newRule,
      id: `pol-${Date.now()}`
    };
    setPolicies((prev) => [...prev, rule]);
  };

  const handleAddRepo = (name: string, owner: string) => {
    const newR: Repository = {
      id: `repo-${Date.now()}`,
      name,
      owner,
      branch: 'main',
      isPrivate: true,
      healthScore: 92,
      openPRs: 0,
      activeAlerts: 0,
      dependencyHealthScore: 95,
      ciStatus: 'passing',
      lastScanTime: 'Just now',
      language: 'TypeScript',
      stars: 12
    };

    setRepositories((prev) => [...prev, newR]);
    setSelectedRepo(newR);
  };

  // Render Splash Screen if active
  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-[#C8FF2E] selection:text-black">
      
      {/* Top Header */}
      <Header
        repositories={repositories}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        activeMode={activeMode}
        onChangeMode={setActiveMode}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
        onOpenGuardianChat={() => setIsGuardianChatOpen(true)}
        onOpenPolicyModal={() => setIsPolicyRuleModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onReturnToSplash={() => setShowSplash(true)}
        user={user}
      />

      {/* Main Control Room Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 space-y-6">
        
        {/* Repository Health Hero Card */}
        <RepositoryHealthCard
          repository={selectedRepo}
          onOpenDiffInspector={() => setSelectedPR(pullRequests[0])}
          onOpenSecurityVault={() => setActiveMode('analyze')}
          onOpenDependencies={() => setActiveMode('analyze')}
        />

        {/* 9 Specialist Agent Pipeline Grid */}
        <AgentPipeline
          agents={agents}
          onSelectAgent={(agent) => {
            if (agent.id === 'security') setActiveMode('analyze');
            if (agent.id === 'refiner') setActiveMode('act');
            if (agent.id === 'reporter') setActiveMode('digest');
            if (agent.id === 'health') setActiveMode('health');
          }}
        />

        {/* MODE CONTROLLER LAYOUT */}

        {/* MODE 1: OBSERVE - Live River Stream */}
        {activeMode === 'observe' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ObserveStream
                events={activityStream}
                onInspectEvent={(e) => {
                  if (e.type === 'pr' && pullRequests[0]) {
                    setSelectedPR(pullRequests[0]);
                  }
                }}
              />
            </div>

            {/* Side Column: Recent Open PRs & Quick Security Highlights */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase">Active Pull Requests</span>
                  <span className="text-[#20E3FF]">{pullRequests.length} Open</span>
                </div>

                {pullRequests.map((pr) => (
                  <div
                    key={pr.id}
                    onClick={() => setSelectedPR(pr)}
                    className="p-3 rounded-lg bg-[#08090D] border border-slate-800 hover:border-[#20E3FF]/50 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>PR #{pr.number}</span>
                      <span className="text-amber-400">Risk: {pr.riskScore}/100</span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs truncate">{pr.title}</p>
                    <div className="text-[10px] text-slate-500">
                      Author: <strong className="text-slate-300">{pr.author}</strong> • {pr.changedFiles.length} files
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Alert Preview */}
              <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-[#FF3B3B] uppercase">Security Highlights</span>
                  <span className="text-rose-400">{securityAlerts.length} Active</span>
                </div>

                {securityAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="p-2.5 rounded-lg bg-[#08090D] border border-slate-800 space-y-1">
                    <span className="text-white font-bold block truncate">{alert.title}</span>
                    <span className="text-slate-400 text-[10px] block">{alert.file}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: ANALYZE - Security & Dependency Matrix */}
        {activeMode === 'analyze' && (
          <div className="space-y-6">
            <SecurityVault
              alerts={securityAlerts}
              onRemediate={(alert) => {
                const targetFinding = findings.find(f => f.category === 'secret_leak' || f.category === 'security_vulnerability');
                if (targetFinding) {
                  setSelectedRepairFinding(targetFinding);
                  setActiveMode('act');
                }
              }}
            />

            <DependencyHealth
              dependencies={dependencies}
              onOpenUpgradePr={(dep) => {
                const patchFinding: Finding = {
                  id: `dep-fix-${dep.id}`,
                  title: `Upgrade package ${dep.name} to ${dep.latestVersion}`,
                  agent: 'dependency',
                  category: 'dependency_drift',
                  severity: 'medium',
                  confidence: 98,
                  file: 'package.json',
                  lineRange: [15, 16],
                  evidence: `"${dep.name}": "${dep.currentVersion}"`,
                  summary: `Upgrades ${dep.name} to resolve security advisories and maintain package freshness.`,
                  impact: 'Eliminates known sub-dependency vulnerability vectors.',
                  suggestedPatch: `// package.json\n"${dep.name}": "^${dep.latestVersion}"`,
                  suggestedTest: `test('${dep.name} version update', () => { expect(require('${dep.name}/package.json').version).toBe('${dep.latestVersion}'); });`,
                  actionRisk: 'low',
                  status: 'open',
                  createdAt: 'Just now'
                };

                setSelectedRepairFinding(patchFinding);
                setActiveMode('act');
              }}
            />
          </div>
        )}

        {/* MODE 3: ACT & REPAIR - Refiner Studio & Governance */}
        {activeMode === 'act' && (
          <div className="space-y-6">
            <RepairAssistance
              finding={selectedRepairFinding || findings[0]}
              onApproveAndMerge={handleApproveAndMerge}
              onRejectPatch={(f) => setSelectedRepairFinding(null)}
            />

            <PolicyAndAudit
              policies={policies}
              onTogglePolicy={handleTogglePolicy}
              auditTrail={auditTrail}
            />
          </div>
        )}

        {/* MODE 4: DIGEST - Reporter Studio */}
        {activeMode === 'digest' && (
          <ExecutiveDigest
            repository={selectedRepo}
            findings={findings}
            securityAlerts={securityAlerts}
            dependencies={dependencies}
          />
        )}

        {/* MODE 5: HEALTH - Health Analytics */}
        {activeMode === 'health' && (
          <HealthAnalytics
            repository={selectedRepo}
            history={healthHistory}
          />
        )}

        {/* MODE 6: ISSUES & BRANCHES */}
        {activeMode === 'issues' && (
          <IssueBranchTracker
            repository={selectedRepo}
          />
        )}

        {/* MODE 7: DEPLOY MATRIX & CHECKLIST */}
        {activeMode === 'deploy' && (
          <DeploymentChecklist />
        )}

      </main>

      {/* Code Review Modal */}
      {selectedPR && (
        <CodeReviewModal
          pullRequest={selectedPR}
          findings={findings}
          onClose={() => setSelectedPR(null)}
          onApplyPatch={(finding) => {
            setSelectedRepairFinding(finding);
            setSelectedPR(null);
            setActiveMode('act');
          }}
          onRunLiveGeminiReview={handleRunLiveGeminiReview}
          isAnalyzing={isScanning}
        />
      )}

      {/* Slide-over AI Guardian Chat Drawer */}
      <GuardianChatDrawer
        isOpen={isGuardianChatOpen}
        onClose={() => setIsGuardianChatOpen(false)}
        selectedRepo={selectedRepo}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        repositories={repositories}
        onAddRepo={handleAddRepo}
      />

      {/* Custom Policy Rule Builder Modal */}
      <PolicyRuleModal
        isOpen={isPolicyRuleModalOpen}
        onClose={() => setIsPolicyRuleModalOpen(false)}
        onAddRule={handleAddPolicyRule}
      />

      {/* Login SSO Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* 2-Step MFA Modal */}
      <MfaModal
        isOpen={isMfaModalOpen}
        onClose={() => {
          setIsMfaModalOpen(false);
          setPendingMfaFinding(null);
        }}
        onConfirm={() => {
          if (pendingMfaFinding) {
            executeMerge(pendingMfaFinding);
          }
        }}
        actionTitle={pendingMfaFinding?.title || 'Merge Sensitive Security Patch'}
        riskLevel={pendingMfaFinding?.actionRisk || 'high'}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#08090D] py-4 px-6 text-center text-xs font-mono text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Git-Frog Repository Guardian • Powered by Gemini 3.6 Flash Server Engine</span>
          <span className="text-[#C8FF2E] font-bold">Continuous Protection • Audit Log Verified</span>
        </div>
      </footer>

      {/* Sticky Mobile Touch Screen Navigation Bar */}
      <MobileBottomNav
        activeMode={activeMode}
        onChangeMode={(mode) => setActiveMode(mode)}
        onOpenGuardianChat={() => setIsGuardianChatOpen(true)}
        isScanning={isScanning}
        onTriggerScan={handleTriggerScan}
      />

    </div>
  );
}
