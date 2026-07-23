export type OperatingMode = 'observe' | 'analyze' | 'act';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ActionRiskLevel = 'low' | 'medium' | 'high' | 'sensitive';
export type AgentType = 
  | 'scout'
  | 'reviewer'
  | 'bug_finder'
  | 'security'
  | 'dependency'
  | 'refiner'
  | 'policy'
  | 'reporter'
  | 'health';

export interface SpecialistAgent {
  id: AgentType;
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'idle' | 'watching' | 'analyzing' | 'action_required' | 'completed';
  lastActive: string;
  findingsCount: number;
  currentTask?: string;
  avatarGlow: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  branch: string;
  isPrivate: boolean;
  healthScore: number;
  openPRs: number;
  activeAlerts: number;
  dependencyHealthScore: number;
  ciStatus: 'passing' | 'failing' | 'running';
  lastScanTime: string;
  language: string;
  stars: number;
}

export interface ActivityEvent {
  id: string;
  type: 'pr' | 'commit' | 'issue' | 'ci' | 'dependency' | 'security';
  title: string;
  author: string;
  repo: string;
  timestamp: string;
  branch?: string;
  status?: string;
  summary: string;
  risk?: ActionRiskLevel;
}

export interface Finding {
  id: string;
  title: string;
  agent: AgentType;
  category: 'logic_bug' | 'security_vulnerability' | 'secret_leak' | 'dependency_drift' | 'test_gap' | 'code_smell';
  severity: SeverityLevel;
  confidence: number; // 0 - 100%
  file: string;
  lineRange: [number, number];
  evidence: string;
  summary: string;
  impact: string;
  suggestedPatch?: string;
  suggestedTest?: string;
  actionRisk: ActionRiskLevel;
  status: 'open' | 'fixing' | 'approved' | 'rejected' | 'resolved';
  createdAt: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  author: string;
  authorAvatar?: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed' | 'changes_requested';
  additions: number;
  deletions: number;
  changedFiles: string[];
  findingsCount: number;
  riskScore: number; // 0 - 100
  diffContent: string;
  reviewStatus: 'pending' | 'reviewing' | 'approved' | 'action_needed';
  summary?: string;
}

export interface SecurityAlert {
  id: string;
  cveId?: string;
  type: 'secret' | 'vulnerability' | 'permission' | 'injection' | 'policy_violation';
  title: string;
  severity: SeverityLevel;
  file: string;
  line?: number;
  snippet?: string;
  remediation: string;
  redactedProof?: string;
  status: 'active' | 'mitigated' | 'ignored';
  timestamp: string;
}

export interface DependencyPackage {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  wantedVersion: string;
  type: 'direct' | 'transitive';
  ecosystem: 'npm' | 'pypi' | 'cargo' | 'go';
  advisoriesCount: number;
  breakingRiskScore: 'low' | 'moderate' | 'high';
  upgradePrStatus?: 'none' | 'drafted' | 'opened' | 'merged';
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'code_quality' | 'dependencies' | 'approvals';
  enabled: boolean;
  minRiskForApproval: ActionRiskLevel;
  ruleCode: string;
  actionOnViolation: 'block' | 'warn' | 'require_mfa' | 'create_issue';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  agent: AgentType | 'user' | 'system';
  action: string;
  target: string;
  details: string;
  riskLevel: ActionRiskLevel;
  approvedBy?: string;
  status: 'success' | 'blocked' | 'flagged';
}

export interface HealthMetricHistory {
  date: string;
  score: number;
  vulnerabilities: number;
  ciPassRate: number;
  dependencyFreshness: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'guardian' | 'agent';
  agentName?: string;
  text: string;
  timestamp: string;
  codeSnippet?: string;
  actionButtons?: { label: string; action: string }[];
}
