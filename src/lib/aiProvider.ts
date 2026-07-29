// AI Model Provider Coordinator: Local Ollama + Cloud AI Models + Fallback Gemini

export interface AiModelSettings {
  primaryProvider: 'ollama' | 'openai' | 'anthropic' | 'groq' | 'gemini';
  ollamaEndpoint: string;
  ollamaModel: string;
  openaiApiKey: string;
  openaiModel: string;
  anthropicApiKey: string;
  anthropicModel: string;
  groqApiKey: string;
  deepseekApiKey: string;
  fallbackGeminiEnabled: boolean;
}

export const DEFAULT_AI_SETTINGS: AiModelSettings = {
  primaryProvider: 'ollama',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModel: 'codellama',
  openaiApiKey: '',
  openaiModel: 'gpt-4o-mini',
  anthropicApiKey: '',
  anthropicModel: 'claude-3-5-sonnet-20241022',
  groqApiKey: '',
  deepseekApiKey: '',
  fallbackGeminiEnabled: true
};

export const loadAiSettings = (): AiModelSettings => {
  try {
    const saved = localStorage.getItem('git_frog_ai_settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_AI_SETTINGS;
};

export const saveAiSettings = (settings: AiModelSettings) => {
  try {
    localStorage.setItem('git_frog_ai_settings', JSON.stringify(settings));
  } catch {}
};

export const aiProviderService = {
  /**
   * Ping Ollama endpoint to verify local connectivity
   */
  async checkOllamaStatus(endpoint: string = 'http://localhost:11434'): Promise<{ active: boolean; models: string[] }> {
    try {
      const res = await fetch(`${endpoint}/api/tags`, { method: 'GET' });
      if (!res.ok) return { active: false, models: [] };
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name);
      return { active: true, models };
    } catch {
      return { active: false, models: [] };
    }
  },

  /**
   * Generate completion with configured AI Cascade (Ollama -> Custom Cloud API -> Gemini Fallback)
   */
  async generateCompletion(prompt: string, settings: AiModelSettings): Promise<{ text: string; providerUsed: string }> {
    // 1. Try Ollama if selected
    if (settings.primaryProvider === 'ollama') {
      try {
        const res = await fetch(`${settings.ollamaEndpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: settings.ollamaModel || 'codellama',
            prompt,
            stream: false
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.response) {
            return { text: data.response, providerUsed: `Ollama (${settings.ollamaModel})` };
          }
        }
      } catch (err) {
        console.warn('Ollama unavailable, falling back...', err);
      }
    }

    // 2. Try OpenAI if selected and API key is present
    if (settings.primaryProvider === 'openai' && settings.openaiApiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.openaiApiKey}`
          },
          body: JSON.stringify({
            model: settings.openaiModel || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return { text, providerUsed: `OpenAI (${settings.openaiModel})` };
        }
      } catch (err) {
        console.warn('OpenAI error, falling back...', err);
      }
    }

    // 3. Fallback / Server Proxy via Gemini
    try {
      const res = await fetch('/api/ask-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, repoName: 'git-frog-guardian', activeFindingsCount: 3 })
      });
      const data = await res.json();
      return { text: data.reply || data.answer || 'Gemini Guardian online.', providerUsed: 'Gemini 3.6 Flash (Server Proxy)' };
    } catch {
      return {
        text: `🐸 **OLLAMA / GUARDIAN AGENT**: Generated response for prompt.\n\nRunning in local mode. Connect Ollama at ${settings.ollamaEndpoint} or provide Cloud API Key in AI Settings for live multi-model execution.`,
        providerUsed: 'Local Fallback Engine'
      };
    }
  }
};
