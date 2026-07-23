import React, { useState } from 'react';
import { 
  Server, 
  Globe, 
  Cloud, 
  Box, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Code, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  ExternalLink,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { envConfig, DeploymentMode } from '../config/env';

interface Task {
  id: string;
  phase: 'Phase A' | 'Phase B' | 'Phase C' | 'Phase D';
  title: string;
  description: string;
  targets: ('vercel' | 'github_pages' | 'cloudflare' | 'docker')[];
  completed: boolean;
}

export const DeploymentChecklist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'matrix' | 'configs'>('checklist');
  const [selectedConfig, setSelectedConfig] = useState<'docker' | 'docker_compose' | 'vercel' | 'cloudflare' | 'env' | 'static'>('docker');
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [activeDeployMode, setActiveDeployMode] = useState<DeploymentMode>(envConfig.deployMode);

  const [tasks, setTasks] = useState<Task[]>([
    // Phase A
    { id: 'a1', phase: 'Phase A', title: 'Refactor app into frontend/backend boundaries', description: 'Isolate UI components from direct server execution & secret access.', targets: ['vercel', 'github_pages', 'cloudflare', 'docker'], completed: true },
    { id: 'a2', phase: 'Phase A', title: 'Define unified .env schema with VITE_ prefixes', description: 'Declare all public & secret env variables in .env.example.', targets: ['vercel', 'github_pages', 'cloudflare', 'docker'], completed: true },
    { id: 'a3', phase: 'Phase A', title: 'Create target deployment config files', description: 'Generate vercel.json, wrangler.toml, Dockerfile, docker-compose.yml & static.config.json.', targets: ['vercel', 'github_pages', 'cloudflare', 'docker'], completed: true },

    // Phase B
    { id: 'b1', phase: 'Phase B', title: 'Make auth portable across SSO & OAuth', description: 'Support GitHub OAuth callbacks & Enterprise SSO mock/live flows.', targets: ['vercel', 'cloudflare', 'docker'], completed: true },
    { id: 'b2', phase: 'Phase B', title: 'Move Gemini report generation server-side', description: 'Centralize Executive Digest synthesis in /api/generate-digest.', targets: ['vercel', 'cloudflare', 'docker'], completed: true },
    { id: 'b3', phase: 'Phase B', title: 'Make webhook ingestion & agent worker container-safe', description: 'Isolate GitHub webhook processing and background scan queues.', targets: ['docker', 'vercel'], completed: true },

    // Phase C
    { id: 'c1', phase: 'Phase C', title: 'Add Vercel serverless API routing config', description: 'Configure vercel.json rewrites and output directory.', targets: ['vercel'], completed: true },
    { id: 'c2', phase: 'Phase C', title: 'Add Cloudflare Pages/Workers edge configuration', description: 'Set up wrangler.toml and static site asset routing.', targets: ['cloudflare'], completed: true },
    { id: 'c3', phase: 'Phase C', title: 'Configure GitHub Pages static demo export', description: 'Enable graceful fallback mocks when backend is omitted.', targets: ['github_pages'], completed: true },
    { id: 'c4', phase: 'Phase C', title: 'Build multi-stage Dockerfile & compose stack', description: 'Set up Node.js 20 runner, Postgres, Redis, and health checks.', targets: ['docker'], completed: true },

    // Phase D
    { id: 'd1', phase: 'Phase D', title: 'Verify runtime behavior on all target platforms', description: 'Confirm SSO login, dashboard load, report generation, and audit logs.', targets: ['vercel', 'github_pages', 'cloudflare', 'docker'], completed: true }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getCompletedCount = (phase?: string) => {
    const list = phase ? tasks.filter(t => t.phase === phase) : tasks;
    return list.filter(t => t.completed).length;
  };

  const configFiles = {
    docker: `# Dockerfile (Multi-stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
CMD ["node", "dist/server.cjs"]`,

    docker_compose: `# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - DATABASE_URL=postgresql://gitfrog:gitfrogpass@postgres:5432/gitfrog_db
      - REDIS_URL=redis://redis:6379
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: gitfrog
      POSTGRES_PASSWORD: gitfrogpass
      POSTGRES_DB: gitfrog_db
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]`,

    vercel: `{
  "version": 2,
  "name": "git-frog-guardian",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`,

    cloudflare: `name = "git-frog-guardian"
type = "webpack"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
entry-point = "workers-site"

[build]
command = "npm run build"
output_dir = "dist"`,

    env: `# .env.example
VITE_APP_NAME="Git-Frog Guardian"
VITE_API_BASE_URL=""
VITE_DEPLOY_MODE="docker"

GEMINI_API_KEY=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
SLACK_WEBHOOK_URL=""
DATABASE_URL="postgresql://gitfrog:password@localhost:5432/gitfrog_db"
REDIS_URL="redis://localhost:6379"`,

    static: `{
  "target": "github-pages",
  "publicPath": "./",
  "staticDemoMode": true,
  "disabledFeaturesOnStatic": [
    "live_gemini_streaming",
    "real_oauth_callbacks",
    "live_slack_webhooks"
  ],
  "mockFallbackEnabled": true
}`
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(configFiles[selectedConfig]);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              DEPLOYMENT READINESS & MULTI-TARGET MATRIX
            </h3>
            <p className="text-slate-400 font-sans text-xs">
              Portable architecture for Vercel, GitHub Pages, Cloudflare Pages & Docker containers
            </p>
          </div>
        </div>

        {/* Live Deploy Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#10131A] p-1.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold pl-1">Target Mode:</span>
          {(['docker', 'vercel', 'cloudflare', 'static'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveDeployMode(mode)}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all cursor-pointer font-bold ${
                activeDeployMode === mode
                  ? 'bg-purple-400 text-black shadow-[0_0_10px_rgba(192,132,252,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
            activeTab === 'checklist' ? 'bg-[#10131A] text-white border border-slate-700' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-purple-400" />
          Implementation Task Checklist ({getCompletedCount()}/{tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
            activeTab === 'matrix' ? 'bg-[#10131A] text-white border border-slate-700' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          Platform Feature Compatibility Matrix
        </button>

        <button
          onClick={() => setActiveTab('configs')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
            activeTab === 'configs' ? 'bg-[#10131A] text-white border border-slate-700' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4 text-[#C8FF2E]" />
          Deployment Configuration Files
        </button>
      </div>

      {/* TAB 1: Implementation Task Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {(['Phase A', 'Phase B', 'Phase C', 'Phase D'] as const).map((phase) => {
            const phaseTasks = tasks.filter(t => t.phase === phase);
            const done = getCompletedCount(phase);
            return (
              <div key={phase} className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    {phase}: {phase === 'Phase A' ? 'Boundary Separation & Config' : phase === 'Phase B' ? 'Auth & Server-side Migration' : phase === 'Phase C' ? 'Target Deployment Specs' : 'Runtime Verification'}
                  </span>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30">
                    {done} / {phaseTasks.length} Tasks Complete
                  </span>
                </div>

                <div className="space-y-2">
                  {phaseTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        t.completed
                          ? 'bg-[#08090D] border-emerald-500/30 text-slate-300'
                          : 'bg-[#08090D] border-slate-800 hover:border-slate-700 text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button className="mt-0.5 text-emerald-400">
                          {t.completed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                        </button>
                        <div>
                          <span className={`font-bold block text-xs ${t.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {t.title}
                          </span>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">{t.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {t.targets.map(tg => (
                          <span key={tg} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-300 uppercase">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Platform Feature Compatibility Matrix */}
      {activeTab === 'matrix' && (
        <div className="p-4 rounded-xl bg-[#10131A] border border-slate-800 space-y-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="p-2.5">Feature Module</th>
                <th className="p-2.5">Vercel</th>
                <th className="p-2.5">GitHub Pages</th>
                <th className="p-2.5">Cloudflare Pages</th>
                <th className="p-2.5">Docker Container</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-2.5 font-bold text-white">Frontend Dashboard UI</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Full Support</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Static Export</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Edge Delivery</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Containerized</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">GitHub OAuth & SSO</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Serverless APIs</td>
                <td className="p-2.5 text-amber-400 font-bold">⚠ Mock Demo Only</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Edge Functions</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Full Auth Server</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Gemini AI Executive Digest</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Server Proxy</td>
                <td className="p-2.5 text-rose-400 font-bold">✗ Secrets Shielded</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Edge Worker AI</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Full Engine</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">GitHub Webhooks & Workers</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Serverless Queues</td>
                <td className="p-2.5 text-rose-400 font-bold">✗ Unsupported</td>
                <td className="p-2.5 text-amber-400 font-bold">⚠ Small Handlers</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Dedicated Queue</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Postgres & Redis Persistence</td>
                <td className="p-2.5 text-cyan-400 font-bold">Cloud Postgres</td>
                <td className="p-2.5 text-rose-400 font-bold">None</td>
                <td className="p-2.5 text-cyan-400 font-bold">Cloudflare D1 / KV</td>
                <td className="p-2.5 text-emerald-400 font-bold">✓ Full Docker Stack</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Deployment Configurations Code Viewer */}
      {activeTab === 'configs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-[#10131A] p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['docker', 'docker_compose', 'vercel', 'cloudflare', 'env', 'static'] as const).map((cfg) => (
                <button
                  key={cfg}
                  onClick={() => setSelectedConfig(cfg)}
                  className={`px-3 py-1.5 rounded-lg uppercase font-bold transition-all cursor-pointer ${
                    selectedConfig === cfg ? 'bg-[#C8FF2E] text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cfg.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyConfig}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer font-bold"
            >
              {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedConfig ? 'Copied!' : 'Copy Config'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#050608] border border-slate-800 text-slate-300 overflow-x-auto text-xs font-mono leading-relaxed max-h-96">
            {configFiles[selectedConfig]}
          </pre>
        </div>
      )}
    </div>
  );
};
