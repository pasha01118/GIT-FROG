import { envConfig } from '../config/env';

interface AnalyzeDiffParams {
  file: string;
  patch: string;
  findingTitle: string;
}

interface GenerateDigestParams {
  repoName: string;
  healthScore: number;
  reportType: 'daily' | 'weekly' | 'security_audit';
  findingsCount: number;
  alertsCount: number;
  depsCount: number;
}

export const api = {
  async getHealthCheck() {
    if (envConfig.isStaticDemo) {
      return { status: 'ok', mode: 'static-demo' };
    }
    try {
      const res = await fetch(`${envConfig.apiBaseUrl}/api/health`);
      return await res.json();
    } catch {
      return { status: 'fallback', mode: 'static-fallback' };
    }
  },

  async analyzeDiff(params: AnalyzeDiffParams) {
    if (envConfig.isStaticDemo) {
      return {
        explanation: 'STATIC DEMO MODE: Analysis simulated for static GitHub Pages export.',
        remediationPatch: params.patch || '// Static patch fallback'
      };
    }
    try {
      const res = await fetch(`${envConfig.apiBaseUrl}/api/analyze-diff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err) {
      return {
        explanation: 'Backend connection unreachable. Using cached agent analysis.',
        remediationPatch: params.patch
      };
    }
  },

  async askGuardian(prompt: string, repoName: string, activeFindingsCount: number) {
    if (envConfig.isStaticDemo) {
      return {
        reply: `🐸 **Git-Frog Static Guardian**: You asked "${prompt}". In static mode, real-time Gemini AI queries are disabled to protect API keys on static hosts.`
      };
    }
    try {
      const res = await fetch(`${envConfig.apiBaseUrl}/api/ask-guardian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, repoName, activeFindingsCount })
      });
      return await res.json();
    } catch {
      return {
        reply: 'The AI server is currently offline or starting up. Please check backend container logs.'
      };
    }
  },

  async generateDigest(params: GenerateDigestParams) {
    if (envConfig.isStaticDemo) {
      return {
        markdown: `# 🐸 Git-Frog Guardian • STATIC EXPORT DIGEST
**Repository:** ${params.repoName}
**Generated:** ${new Date().toISOString().slice(0, 10)}
**Mode:** Static GitHub Pages Demo

### 📊 Summary
- Health Score: ${params.healthScore}/100
- Active Findings: ${params.findingsCount}
- Security Alerts: ${params.alertsCount}
- Outdated Dependencies: ${params.depsCount}`
      };
    }
    try {
      const res = await fetch(`${envConfig.apiBaseUrl}/api/generate-digest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch {
      return {
        markdown: `# 🐸 Git-Frog Guardian • OFFLINE DIGEST FALLBACK
**Repository:** ${params.repoName}`
      };
    }
  }
};
