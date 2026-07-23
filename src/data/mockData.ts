import {
  Repository,
  SpecialistAgent,
  ActivityEvent,
  Finding,
  PullRequest,
  SecurityAlert,
  DependencyPackage,
  PolicyRule,
  AuditEvent,
  HealthMetricHistory
} from '../types';

export const INITIAL_REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'payment-gateway-service',
    owner: 'acme-corp',
    branch: 'main',
    isPrivate: true,
    healthScore: 88,
    openPRs: 3,
    activeAlerts: 2,
    dependencyHealthScore: 92,
    ciStatus: 'passing',
    lastScanTime: '2 mins ago',
    language: 'TypeScript',
    stars: 1420
  },
  {
    id: 'repo-2',
    name: 'auth-vault-api',
    owner: 'acme-corp',
    branch: 'main',
    isPrivate: true,
    healthScore: 74,
    openPRs: 5,
    activeAlerts: 6,
    dependencyHealthScore: 68,
    ciStatus: 'failing',
    lastScanTime: '5 mins ago',
    language: 'Go',
    stars: 890
  },
  {
    id: 'repo-3',
    name: 'frontend-dashboard-app',
    owner: 'acme-corp',
    branch: 'release/v2.4',
    isPrivate: false,
    healthScore: 95,
    openPRs: 1,
    activeAlerts: 0,
    dependencyHealthScore: 98,
    ciStatus: 'passing',
    lastScanTime: '12 mins ago',
    language: 'React / TS',
    stars: 3100
  }
];

export const INITIAL_AGENTS: SpecialistAgent[] = [
  {
    id: 'scout',
    name: 'Scout Agent',
    role: 'Event Monitor & Router',
    description: 'Watches incoming webhooks, commits, PRs & CI jobs. Classifies event intent and dispatches tasks.',
    icon: 'Radar',
    status: 'watching',
    lastActive: 'Just now',
    findingsCount: 0,
    currentTask: 'Ingesting PR #142 event payload from payment-gateway-service',
    avatarGlow: 'from-lime-400 to-emerald-500'
  },
  {
    id: 'reviewer',
    name: 'Reviewer Agent',
    role: 'Code Review Intelligence',
    description: 'Analyses code diffs line-by-line for readability, maintainability, architecture, and edge cases.',
    icon: 'FileCode2',
    status: 'analyzing',
    lastActive: '1 min ago',
    findingsCount: 4,
    currentTask: 'Reviewing diff src/controllers/billing.ts in PR #142',
    avatarGlow: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'bug_finder',
    name: 'Bug Finder Agent',
    role: 'Logic & Regression Detector',
    description: 'Identifies unhandled promises, null pointer exceptions, boundary limits, and race conditions.',
    icon: 'Bug',
    status: 'analyzing',
    lastActive: '2 mins ago',
    findingsCount: 3,
    currentTask: 'Checking concurrent lock logic in auth token handler',
    avatarGlow: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'security',
    name: 'Security Agent',
    role: 'Vulnerability & Secret Scanner',
    description: 'Scans for exposed JWT secrets, API keys, SQL injections, OWASP risks, and unsafe deserialization.',
    icon: 'ShieldAlert',
    status: 'action_required',
    lastActive: '3 mins ago',
    findingsCount: 2,
    currentTask: 'FLAGGED: Unredacted hardcoded Stripe webhook secret in config.ts',
    avatarGlow: 'from-red-500 to-rose-600'
  },
  {
    id: 'dependency',
    name: 'Dependency Agent',
    role: 'Package Health & Drift',
    description: 'Tracks CVE security advisories, major version breaking risks, and transitive dependency health.',
    icon: 'Layers',
    status: 'watching',
    lastActive: '4 mins ago',
    findingsCount: 5,
    currentTask: 'Monitoring express 4.21 -> 5.0 migration advisories',
    avatarGlow: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'refiner',
    name: 'Refiner Agent',
    role: 'Automated Repair Patch Generator',
    description: 'Generates minimal, safe git patches and companion unit tests for detected defects.',
    icon: 'Wrench',
    status: 'completed',
    lastActive: '10 mins ago',
    findingsCount: 2,
    currentTask: 'Drafted unit test suite for billing rate limit patch',
    avatarGlow: 'from-teal-400 to-cyan-500'
  },
  {
    id: 'policy',
    name: 'Policy Agent',
    role: 'Governance & Safety Guard',
    description: 'Enforces repository rules, blocks unsafe auto-merges, requires 2FA or approval for high-risk actions.',
    icon: 'Lock',
    status: 'watching',
    lastActive: 'Just now',
    findingsCount: 1,
    currentTask: 'Verified PR #142 safety policy: Auto-merge blocked (High Risk)',
    avatarGlow: 'from-fuchsia-400 to-pink-500'
  },
  {
    id: 'reporter',
    name: 'Reporter Agent',
    role: 'Executive Digest & Summaries',
    description: 'Generates audit digests, PR code change summaries, and team slack/github reports.',
    icon: 'BarChart3',
    status: 'completed',
    lastActive: '15 mins ago',
    findingsCount: 0,
    currentTask: 'Generated daily security digest report',
    avatarGlow: 'from-blue-400 to-sky-500'
  },
  {
    id: 'health',
    name: 'Health Agent',
    role: 'Repo Quality Indexer',
    description: 'Computes multi-week repository health scores based on test coverage, CI pass rates, and security debt.',
    icon: 'Activity',
    status: 'watching',
    lastActive: '20 mins ago',
    findingsCount: 0,
    currentTask: 'Calculated health score: 88/100 (+3% this week)',
    avatarGlow: 'from-emerald-400 to-lime-500'
  }
];

export const INITIAL_ACTIVITY_STREAM: ActivityEvent[] = [
  {
    id: 'act-1',
    type: 'pr',
    title: 'PR #142: Add idempotency lock to payment charge API',
    author: 'dev-alex',
    repo: 'payment-gateway-service',
    timestamp: '2 mins ago',
    branch: 'feature/idempotency',
    status: 'Reviewing',
    summary: 'Scout Agent routed PR diff to Reviewer & Security Agents. 2 potential bugs identified.',
    risk: 'high'
  },
  {
    id: 'act-2',
    type: 'security',
    title: 'Hardcoded Secret Detected in `src/config/stripe.ts`',
    author: 'Security Agent',
    repo: 'auth-vault-api',
    timestamp: '5 mins ago',
    status: 'Action Required',
    summary: 'Detected test API key `sk_test_51Mz...` committed directly. Secret redacted immediately.',
    risk: 'sensitive'
  },
  {
    id: 'act-3',
    type: 'ci',
    title: 'CI Build #891 Passed on main',
    author: 'github-actions',
    repo: 'frontend-dashboard-app',
    timestamp: '12 mins ago',
    branch: 'main',
    status: 'Passed',
    summary: 'All 142 unit tests passed in 48s. Code coverage at 94.2%.',
    risk: 'low'
  },
  {
    id: 'act-4',
    type: 'dependency',
    title: 'CVE-2026-1029 Advisory: Axios sub-dependency vulnerability',
    author: 'Dependency Agent',
    repo: 'payment-gateway-service',
    timestamp: '25 mins ago',
    status: 'Patch Available',
    summary: 'Transitive dependency risk in axios@1.6.2. Refiner Agent drafted bump to v1.7.4.',
    risk: 'medium'
  },
  {
    id: 'act-5',
    type: 'commit',
    title: 'Commit 8f3a12b: Fix token refresh race condition',
    author: 'sarah-eng',
    repo: 'auth-vault-api',
    timestamp: '1 hour ago',
    branch: 'main',
    status: 'Analyzed',
    summary: 'Bug Finder confirmed deadlock risk is resolved with atomic swap.',
    risk: 'low'
  }
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'find-101',
    title: 'Missing Idempotency Re-Entrancy Lock in Charge Processing',
    agent: 'bug_finder',
    category: 'logic_bug',
    severity: 'high',
    confidence: 94,
    file: 'src/controllers/billing.ts',
    lineRange: [42, 58],
    evidence: 'async processCharge(req, res) does not await Redis lock release before responding to client, leading to duplicate billing on high-concurrency retries.',
    summary: 'A race condition occurs when concurrent payment retries arrive within 50ms. The lock is checked asynchronously without transactional guarantee.',
    impact: 'Customers may be double-charged during API network timeouts or client auto-retries.',
    suggestedPatch: `// Correct atomic lock reservation pattern
const acquired = await redis.set(\`lock:charge:\${idempotencyKey}\`, '1', 'NX', 'EX', 10);
if (!acquired) {
  return res.status(409).json({ error: 'Concurrent transaction in progress' });
}`,
    suggestedTest: `describe('processCharge idempotency', () => {
  it('should reject simultaneous double-submit with 409 Conflict', async () => {
    const [res1, res2] = await Promise.all([
      request(app).post('/charge').send({ key: 'idem_123', amount: 5000 }),
      request(app).post('/charge').send({ key: 'idem_123', amount: 5000 })
    ]);
    expect([res1.status, res2.status]).toContain(409);
  });
});`,
    actionRisk: 'medium',
    status: 'open',
    createdAt: '10 mins ago'
  },
  {
    id: 'find-102',
    title: 'Exposed Hardcoded Secret in Stripe Config File',
    agent: 'security',
    category: 'secret_leak',
    severity: 'critical',
    confidence: 99,
    file: 'src/config/stripe.ts',
    lineRange: [12, 14],
    evidence: 'const STRIPE_WEBHOOK_SECRET = "whsec_9a18f273b42c12ef093847123984";',
    summary: 'Live/test webhook signing secret committed directly to codebase.',
    impact: 'Attacker can forge Stripe webhook events and trigger unauthorized subscription activations.',
    suggestedPatch: `// Pull secret safely from process.env with runtime guard
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET env variable is required');
}`,
    suggestedTest: `test('throws error when STRIPE_WEBHOOK_SECRET is missing', () => {
  delete process.env.STRIPE_WEBHOOK_SECRET;
  expect(() => loadStripeConfig()).toThrow('STRIPE_WEBHOOK_SECRET env variable is required');
});`,
    actionRisk: 'sensitive',
    status: 'open',
    createdAt: '15 mins ago'
  },
  {
    id: 'find-103',
    title: 'Uncaught Promise Rejection in Async Route Handler',
    agent: 'reviewer',
    category: 'code_smell',
    severity: 'medium',
    confidence: 88,
    file: 'src/routes/user.ts',
    lineRange: [88, 96],
    evidence: 'router.get("/profile", async (req, res) => { const user = await fetchProfile(req.user.id); res.json(user); });',
    summary: 'Missing try/catch block or express-async-handler wrapper around async DB call.',
    impact: 'Failed database calls cause Node.js unhandled rejection and server process crash.',
    suggestedPatch: `router.get("/profile", async (req, res, next) => {
  try {
    const user = await fetchProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
    suggestedTest: `it('passes error to next middleware when fetchProfile fails', async () => {
  jest.spyOn(userService, 'fetchProfile').mockRejectedValue(new Error('DB Timeout'));
  const res = await request(app).get('/profile');
  expect(res.status).toBe(500);
});`,
    actionRisk: 'low',
    status: 'open',
    createdAt: '30 mins ago'
  }
];

export const INITIAL_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr-142',
    number: 142,
    title: 'Add idempotency lock & webhook signature verification',
    author: 'dev-alex',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    sourceBranch: 'feature/idempotency',
    targetBranch: 'main',
    status: 'open',
    additions: 184,
    deletions: 42,
    changedFiles: ['src/controllers/billing.ts', 'src/config/stripe.ts', 'src/routes/user.ts'],
    findingsCount: 3,
    riskScore: 78,
    reviewStatus: 'action_needed',
    summary: 'Implements Redis-backed idempotency lock to prevent duplicate charges and adds webhook HMAC validation.',
    diffContent: `diff --git a/src/controllers/billing.ts b/src/controllers/billing.ts
index 83a12bc..90123f1 100644
--- a/src/controllers/billing.ts
+++ b/src/controllers/billing.ts
@@ -40,12 +40,22 @@ export async function processCharge(req: Request, res: Response) {
   const { idempotencyKey, amount, currency } = req.body;

-  // Direct charge call
-  const result = await stripe.paymentIntents.create({
-    amount,
-    currency,
-  });
-  return res.json({ success: true, chargeId: result.id });
+  // Added redis lock check
+  const isLocked = await redis.get(\`lock:\${idempotencyKey}\`);
+  if (isLocked) {
+    // ISSUE: Async non-blocking return allows race window before lock set!
+    res.status(409).json({ error: 'Duplicate charge request' });
+  }
+  
+  redis.set(\`lock:\${idempotencyKey}\`, 'true');
+  
+  const result = await stripe.paymentIntents.create({ amount, currency });
+  return res.json({ success: true, chargeId: result.id });
 }

diff --git a/src/config/stripe.ts b/src/config/stripe.ts
index 213ab11..445123a 100644
--- a/src/config/stripe.ts
+++ b/src/config/stripe.ts
@@ -10,5 +10,5 @@ export const stripeConfig = {
   apiVersion: '2023-10-16',
-  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
+  webhookSecret: "whsec_9a18f273b42c12ef093847123984", // BUG: Hardcoded secret!
 };`
  },
  {
    id: 'pr-141',
    number: 141,
    title: 'Bump express from 4.21.0 to 4.21.2 & update security headers',
    author: 'git-frog[bot]',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    sourceBranch: 'git-frog/patch-express-sec',
    targetBranch: 'main',
    status: 'open',
    additions: 12,
    deletions: 4,
    changedFiles: ['package.json', 'src/server.ts'],
    findingsCount: 0,
    riskScore: 12,
    reviewStatus: 'approved',
    summary: 'Automated repair PR drafted by Refiner Agent. Zero breaking changes detected.',
    diffContent: `diff --git a/package.json b/package.json
index 1029381..4920192 100644
--- a/package.json
+++ b/package.json
@@ -15,3 +15,3 @@
-    "express": "^4.21.0"
+    "express": "^4.21.2"
`
  }
];

export const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'sec-001',
    type: 'secret',
    title: 'Exposed Stripe API Secret Key in codebase',
    severity: 'critical',
    file: 'src/config/stripe.ts',
    line: 12,
    snippet: 'webhookSecret: "whsec_9a18f273b42c12ef093847123984"',
    remediation: 'Remove key from git history, revoke token in Stripe Dashboard, and inject via environment variables.',
    redactedProof: 'webhookSecret: "whsec_************************"',
    status: 'active',
    timestamp: '15 mins ago'
  },
  {
    id: 'sec-002',
    cveId: 'CVE-2026-1029',
    type: 'vulnerability',
    title: 'Prototype Pollution in lodash sub-dependency',
    severity: 'high',
    file: 'package-lock.json',
    remediation: 'Upgrade lodash to >=4.17.21 in all package sub-dependencies.',
    status: 'active',
    timestamp: '2 hours ago'
  },
  {
    id: 'sec-003',
    type: 'injection',
    title: 'Potential SQL Query Concatenation in searchUsers()',
    severity: 'medium',
    file: 'src/db/queries.ts',
    line: 74,
    snippet: 'SELECT * FROM users WHERE name LIKE %user_input%',
    remediation: 'Use parameterized parameterized queries or ORM query builder to eliminate SQL injection vectors.',
    status: 'active',
    timestamp: '1 day ago'
  }
];

export const INITIAL_DEPENDENCIES: DependencyPackage[] = [
  {
    id: 'dep-1',
    name: 'express',
    currentVersion: '4.21.0',
    latestVersion: '4.21.2',
    wantedVersion: '4.21.2',
    type: 'direct',
    ecosystem: 'npm',
    advisoriesCount: 0,
    breakingRiskScore: 'low',
    upgradePrStatus: 'opened'
  },
  {
    id: 'dep-2',
    name: 'axios',
    currentVersion: '1.6.2',
    latestVersion: '1.7.4',
    wantedVersion: '1.7.4',
    type: 'direct',
    ecosystem: 'npm',
    advisoriesCount: 1,
    breakingRiskScore: 'low',
    upgradePrStatus: 'drafted'
  },
  {
    id: 'dep-3',
    name: 'lodash',
    currentVersion: '4.17.15',
    latestVersion: '4.17.21',
    wantedVersion: '4.17.21',
    type: 'transitive',
    ecosystem: 'npm',
    advisoriesCount: 2,
    breakingRiskScore: 'moderate',
    upgradePrStatus: 'none'
  },
  {
    id: 'dep-4',
    name: 'pg',
    currentVersion: '8.11.3',
    latestVersion: '8.13.0',
    wantedVersion: '8.12.0',
    type: 'direct',
    ecosystem: 'npm',
    advisoriesCount: 0,
    breakingRiskScore: 'low',
    upgradePrStatus: 'none'
  }
];

export const INITIAL_POLICY_RULES: PolicyRule[] = [
  {
    id: 'pol-1',
    name: 'Block Auto-Merge on High/Critical Risks',
    description: 'Any PR with a High or Critical security finding or risk score > 70 requires explicit human approval.',
    category: 'approvals',
    enabled: true,
    minRiskForApproval: 'high',
    ruleCode: 'REQUIRE_HUMAN_APPROVAL(risk >= HIGH)',
    actionOnViolation: 'block'
  },
  {
    id: 'pol-2',
    name: 'Redact & Block Hardcoded Secrets',
    description: 'Automatically mask API keys, JWT tokens, and private SSH keys in diff reviews and log outputs.',
    category: 'security',
    enabled: true,
    minRiskForApproval: 'sensitive',
    ruleCode: 'REDACT_SECRETS_ALWAYS()',
    actionOnViolation: 'block'
  },
  {
    id: 'pol-3',
    name: 'Enforce Companion Unit Tests for Bug Fixes',
    description: 'Refiner Agent must generate companion Jest or Vitest unit tests when drafting repair PRs.',
    category: 'code_quality',
    enabled: true,
    minRiskForApproval: 'medium',
    ruleCode: 'REQUIRE_TEST_COVERAGE_ON_REPAIR()',
    actionOnViolation: 'warn'
  },
  {
    id: 'pol-4',
    name: 'Flag Vulnerable Transitive Dependencies',
    description: 'Alert and draft patch PRs when CVE security advisories affect any direct or indirect package.',
    category: 'dependencies',
    enabled: true,
    minRiskForApproval: 'low',
    ruleCode: 'SCAN_CVE_ADVISORIES(frequency = CONTINUOUS)',
    actionOnViolation: 'create_issue'
  }
];

export const INITIAL_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: 'aud-901',
    timestamp: '2026-07-22 18:55:12',
    agent: 'scout',
    action: 'INGEST_WEBHOOK',
    target: 'PR #142 (payment-gateway-service)',
    details: 'Received pull_request.opened event from GitHub app webhook.',
    riskLevel: 'low',
    status: 'success'
  },
  {
    id: 'aud-902',
    timestamp: '2026-07-22 18:55:15',
    agent: 'security',
    action: 'FLAG_SECRET_LEAK',
    target: 'src/config/stripe.ts',
    details: 'Detected Stripe secret in diff. Redacted proof logged.',
    riskLevel: 'sensitive',
    status: 'flagged'
  },
  {
    id: 'aud-903',
    timestamp: '2026-07-22 18:55:18',
    agent: 'policy',
    action: 'ENFORCE_POLICY_BLOCK',
    target: 'PR #142 Auto-Merge',
    details: 'Blocked auto-merge due to policy pol-1 (High Risk score 78). Human approval required.',
    riskLevel: 'high',
    status: 'blocked'
  },
  {
    id: 'aud-904',
    timestamp: '2026-07-22 18:40:02',
    agent: 'refiner',
    action: 'DRAFT_REPAIR_PR',
    target: 'PR #141 (Bump express to 4.21.2)',
    details: 'Opened patch PR with unit tests. Policy check passed (Low Risk).',
    riskLevel: 'low',
    status: 'success'
  }
];

export const INITIAL_HEALTH_HISTORY: HealthMetricHistory[] = [
  { date: 'Mon', score: 82, vulnerabilities: 5, ciPassRate: 91, dependencyFreshness: 84 },
  { date: 'Tue', score: 84, vulnerabilities: 4, ciPassRate: 94, dependencyFreshness: 85 },
  { date: 'Wed', score: 83, vulnerabilities: 4, ciPassRate: 92, dependencyFreshness: 88 },
  { date: 'Thu', score: 86, vulnerabilities: 3, ciPassRate: 96, dependencyFreshness: 90 },
  { date: 'Fri', score: 88, vulnerabilities: 2, ciPassRate: 98, dependencyFreshness: 92 },
  { date: 'Sat', score: 88, vulnerabilities: 2, ciPassRate: 98, dependencyFreshness: 92 },
  { date: 'Sun', score: 88, vulnerabilities: 2, ciPassRate: 98, dependencyFreshness: 92 }
];
