export type DeploymentMode = 'docker' | 'vercel' | 'cloudflare' | 'static';

export interface AppEnvConfig {
  appName: string;
  apiBaseUrl: string;
  deployMode: DeploymentMode;
  isStaticDemo: boolean;
  hasServerBackend: boolean;
  supportsWebhooks: boolean;
  supportsLiveAi: boolean;
}

const getDeploymentMode = (): DeploymentMode => {
  const envMode = ((import.meta as any).env?.VITE_DEPLOY_MODE) as string;
  if (envMode === 'vercel') return 'vercel';
  if (envMode === 'cloudflare') return 'cloudflare';
  if (envMode === 'static') return 'static';
  return 'docker';
};

export const envConfig: AppEnvConfig = {
  appName: ((import.meta as any).env?.VITE_APP_NAME) || 'Git-Frog Guardian',
  apiBaseUrl: ((import.meta as any).env?.VITE_API_BASE_URL) || '',
  deployMode: getDeploymentMode(),
  isStaticDemo: getDeploymentMode() === 'static',
  hasServerBackend: getDeploymentMode() !== 'static',
  supportsWebhooks: getDeploymentMode() === 'docker' || getDeploymentMode() === 'vercel',
  supportsLiveAi: getDeploymentMode() !== 'static'
};
