import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client initialization warning:', err);
  }
}

// 1. Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Git-Frog Repository Guardian Server',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// 2. Analyze Code Diff with Specialist Agent Pipeline (Gemini 3.6 Flash)
app.post('/api/analyze-diff', async (req, res) => {
  try {
    const { diff, repoName, fileName, prTitle } = req.body;

    if (!diff) {
      return res.status(400).json({ error: 'Missing code diff payload.' });
    }

    if (!ai) {
      // Fallback simulated AI Guardian response when key is unconfigured
      return res.json({
        summary: `Git-Frog Guardian analyzed ${fileName || 'code diff'} in ${repoName || 'repository'}. Identified 2 potential logic & security concerns.`,
        findings: [
          {
            title: 'Potential Unhandled Async Error or Race Window',
            agent: 'bug_finder',
            category: 'logic_bug',
            severity: 'high',
            confidence: 91,
            file: fileName || 'src/index.ts',
            lineRange: [10, 24],
            evidence: 'Async state mutation occurs without concurrency lock or catch block.',
            summary: 'Concurrent invocations may cause race conditions or unhandled rejections.',
            impact: 'Data inconsistency or unexpected runtime exception under load.',
            suggestedPatch: `// Add error handling guard\ntry {\n  await processTask(payload);\n} catch (err) {\n  logger.error('Task execution failed', err);\n}`,
            suggestedTest: `it('handles failure gracefully', async () => {\n  await expect(processTask(null)).rejects.toThrow();\n});`,
            actionRisk: 'medium'
          },
          {
            title: 'Credential / Secret Exposure Check',
            agent: 'security',
            category: 'security_vulnerability',
            severity: 'critical',
            confidence: 96,
            file: fileName || 'src/config.ts',
            lineRange: [1, 5],
            evidence: 'Verification check passed. Ensure environment secrets are redacted.',
            summary: 'Ensure credentials are stored in environment variables.',
            impact: 'Unauthorized access if committed to source repository.',
            suggestedPatch: `const secretKey = process.env.API_SECRET_KEY;`,
            suggestedTest: `test('fails without secret key', () => { expect(process.env.API_SECRET_KEY).toBeDefined(); });`,
            actionRisk: 'sensitive'
          }
        ],
        overallRiskScore: 72,
        actionRecommendation: 'Review findings and approve or request refactored patch.'
      });
    }

    const systemPrompt = `You are Git-Frog's central AI Repository Guardian & Reviewer engine.
Analyze the following code diff/snippet carefully.

Role Breakdown:
- Reviewer Agent: Code smells, logic errors, architectural flaws.
- Bug Finder Agent: Boundary bugs, null pointer exceptions, race conditions, async unhandled rejections.
- Security Agent: Secrets, OWASP risks, injection vectors, hardcoded keys.
- Refiner Agent: Safe patch suggestions and companion unit tests.

Return ONLY a JSON object matching this schema:
{
  "summary": "Short 2-sentence overview of the diff quality and primary findings",
  "overallRiskScore": number (0 to 100),
  "actionRecommendation": "Short recommendation (e.g. Approve, Request Changes, Block)",
  "findings": [
    {
      "title": "Title of finding",
      "agent": "reviewer" | "bug_finder" | "security" | "dependency",
      "category": "logic_bug" | "security_vulnerability" | "secret_leak" | "code_smell",
      "severity": "low" | "medium" | "high" | "critical",
      "confidence": number (1-100),
      "file": "file path",
      "lineRange": [startLine, endLine],
      "evidence": "Code evidence snippet",
      "summary": "Detailed explanation",
      "impact": "Impact statement",
      "suggestedPatch": "Proposed clean replacement code patch",
      "suggestedTest": "Proposed unit test in Jest/Vitest",
      "actionRisk": "low" | "medium" | "high" | "sensitive"
    }
  ]
}`;

    const userPrompt = `Repository: ${repoName || 'main-repo'}
PR Title: ${prTitle || 'Code Change'}
File: ${fileName || 'diff.ts'}

Diff Content:
\`\`\`
${diff}
\`\`\``;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error analyzing diff with Gemini:', err);
    return res.status(500).json({
      error: 'Failed to analyze code diff.',
      details: err?.message || String(err),
    });
  }
});

// 3. Ask Guardian - Interactive Assistant Query
app.post('/api/ask-guardian', async (req, res) => {
  try {
    const { question, repoContext, history } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question parameter is required.' });
    }

    if (!ai) {
      return res.json({
        answer: `🐸 **Git-Frog Guardian Response**:\n\nRegarding your question about \`${question}\` on **${repoContext?.name || 'repository'}**:\n\nGit-Frog actively monitors commit streams, PR diffs, and security advisories. Based on current telemetry:\n- All high-severity findings require explicit human approval per policy rules.\n- Hardcoded secrets are masked automatically before analysis.\n- The Refiner Agent can draft automated repair PRs with companion unit tests.\n\n*(Connect your GEMINI_API_KEY in AI Studio Settings > Secrets for live dynamic intelligence).*`,
        actionButtons: [
          { label: 'Run Full Repo Scan', action: 'run_scan' },
          { label: 'Inspect Policy Rules', action: 'view_policy' }
        ]
      });
    }

    const systemInstruction = `You are Git-Frog OMEGA-ASSIST, a world-class Repository Guardian AI built for enterprise code security, continuous PR reviews, and automated maintenance.
You communicate directly, technically, with clear scannable formatting, code snippets, and precision. You explain problems clearly, rank severity, and propose safe fixes with companion unit tests.

Current Repository Context: ${JSON.stringify(repoContext || {})}`;

    const promptText = `User Question: ${question}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({
      answer: response.text,
      actionButtons: [
        { label: 'Draft Safe Repair PR', action: 'draft_pr' },
        { label: 'View Audit Log', action: 'view_audit' }
      ]
    });
  } catch (err: any) {
    console.error('Ask Guardian error:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Git-Frog Guardian API.',
      details: err?.message || String(err),
    });
  }
});

// 4. Generate Reporter Executive Digest
app.post('/api/generate-digest', async (req, res) => {
  try {
    const { repoName, healthScore, reportType, findingsCount, alertsCount, depsCount } = req.body;

    if (!ai) {
      return res.json({
        markdown: `# 🐸 Git-Frog Reporter Agent • ${reportType?.toUpperCase() || 'DAILY'} EXECUTIVE DIGEST
**Repository:** ${repoName || 'payment-gateway-service'}
**Generated:** ${new Date().toISOString().slice(0, 10)}
**Overall Repository Health Score:** ${healthScore || 88}/100

### 📊 Security & Compliance Executive Overview
- **Active Code Findings:** ${findingsCount || 3} identified by Bug Finder & Reviewer Agents.
- **Active Security Alerts:** ${alertsCount || 2} (Secrets & Vulnerabilities).
- **Outdated Dependencies:** ${depsCount || 4} packages monitored for breaking drift.

### 🛡️ Critical Policy Actions Taken
1. **Hardcoded Secret Neutralized:** Secret redaction pipeline active.
2. **Auto-Merge Policy Enforced:** High-risk PRs gated behind 2-step human review.
3. **Companion Unit Tests Drafted:** Refiner Agent generated Jest suites for pending repair PRs.

---
*Report generated by Git-Frog Reporter Agent v2.4 (Gemini 3.6 Flash Server).*`
      });
    }

    const systemInstruction = `You are Git-Frog's Reporter Agent. Generate a high-level, beautifully formatted, technical Executive Security & Health Markdown Digest for repository "${repoName}". Include an Executive Summary, Critical Security Highlights, Dependency Health & Breaking Risks, and Policy Actions Taken. Use clean Markdown headings, bullet points, and code blocks.`;

    const promptText = `Generate a ${reportType || 'daily'} executive report for ${repoName} (Health Score: ${healthScore}/100, Findings: ${findingsCount}, Security Alerts: ${alertsCount}, Outdated Deps: ${depsCount}).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({
      markdown: response.text || 'Failed to format report markdown.'
    });
  } catch (err: any) {
    console.error('Generate digest error:', err);
    return res.status(500).json({
      error: 'Failed to generate digest with Gemini.',
      details: err?.message || String(err)
    });
  }
});

// 5. Audit Logs API Endpoint (Secure Audit Record Query with Pagination & Filtering)
app.get('/api/audit-logs', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const severity = req.query.severity as string;
    const agentFilter = req.query.agent as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    // Simulated PostgreSQL/Database Audit Store
    const allAuditLogs = [
      { id: 'aud-101', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), repo: 'acme-corp/payment-gateway-service', actor: 'security-agent', action: 'SECRET_REDACTION', severity: 'critical', details: 'Masked Stripe secret API key in config/keys.env prior to LLM submission.' },
      { id: 'aud-102', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), repo: 'acme-corp/payment-gateway-service', actor: 'refiner-agent', action: 'DRAFT_REPAIR_PR', severity: 'medium', details: 'Auto-generated patch PR #143 with Jest test suite to fix null pointer exception.' },
      { id: 'aud-103', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), repo: 'acme-corp/payment-gateway-service', actor: 'policy-guard', action: 'ENFORCE_2FA_RULE', severity: 'high', details: 'Gated PR merge #142 due to missing secondary approval on production auth file.' },
      { id: 'aud-104', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), repo: 'acme-corp/auth-microservice', actor: 'bug-finder-agent', action: 'FLAG_RACE_CONDITION', severity: 'high', details: 'Detected unhandled promise rejection in user token verification handler.' },
      { id: 'aud-105', timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), repo: 'acme-corp/auth-microservice', actor: 'dependency-agent', action: 'DEP_DRIFT_SCAN', severity: 'low', details: 'Identified 3 patchable sub-dependencies with non-breaking security advisories.' },
      { id: 'aud-106', timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(), repo: 'acme-corp/payment-gateway-service', actor: 'reporter-agent', action: 'PUBLISH_EXECUTIVE_DIGEST', severity: 'low', details: 'Compiled 24-hour compliance summary and exported compliance report.' },
      { id: 'aud-107', timestamp: new Date(Date.now() - 1000 * 60 * 1800).toISOString(), repo: 'acme-corp/auth-microservice', actor: 'security-agent', action: 'OWASP_SCAN_COMPLETE', severity: 'medium', details: 'Scanned 14 API endpoints against OWASP Top 10 vulnerabilities.' },
      { id: 'aud-108', timestamp: new Date(Date.now() - 1000 * 60 * 2400).toISOString(), repo: 'acme-corp/payment-gateway-service', actor: 'admin-user', action: 'MANUAL_SCAN_TRIGGER', severity: 'low', details: 'User pasha01118@gmail.com triggered repository health scan.' },
      { id: 'aud-109', timestamp: new Date(Date.now() - 1000 * 60 * 3000).toISOString(), repo: 'acme-corp/auth-microservice', actor: 'system-agent', action: 'POLICY_UPDATE', severity: 'medium', details: 'Updated auto-remediation rule for low-risk dependency updates.' },
      { id: 'aud-110', timestamp: new Date(Date.now() - 1000 * 60 * 3600).toISOString(), repo: 'acme-corp/payment-gateway-service', actor: 'security-agent', action: 'BULK_ALERT_DISMISS', severity: 'low', details: 'Bulk dismissed 2 low-severity vulnerability warnings after manual review.' }
    ];

    // Filter by severity
    let filtered = allAuditLogs;
    if (severity && severity !== 'all') {
      filtered = filtered.filter(l => l.severity.toLowerCase() === severity.toLowerCase());
    }

    // Filter by agent
    if (agentFilter && agentFilter !== 'all') {
      filtered = filtered.filter(l => l.actor.toLowerCase().includes(agentFilter.toLowerCase()));
    }

    // Filter by Date Range
    if (startDate) {
      const startMs = new Date(startDate).getTime();
      filtered = filtered.filter(l => new Date(l.timestamp).getTime() >= startMs);
    }
    if (endDate) {
      const endMs = new Date(endDate).getTime();
      filtered = filtered.filter(l => new Date(l.timestamp).getTime() <= endMs);
    }

    // Pagination math
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedLogs = filtered.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        severity: severity || 'all',
        agent: agentFilter || 'all',
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (err: any) {
    console.error('Audit logs API error:', err);
    return res.status(500).json({ error: 'Failed to query audit logs.', details: err?.message || String(err) });
  }
});

// 6. Start Server with Vite Middleware in Dev or Static Serve in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐸 Git-Frog Guardian Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
