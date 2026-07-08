// Browser-side "Bring Your Own Key" AI coach.
// The user pastes an OpenAI-compatible API key that lives ONLY in their own
// browser localStorage — the site is 100% static, so there is no server to
// leak it from. Requests go directly from the browser to the provider.

const KEY_STORAGE = "checkitapp.ai.key";
const PROVIDER_STORAGE = "checkitapp.ai.provider";
const MODEL_STORAGE = "checkitapp.ai.model";

export type AIProvider = "openai" | "gemini";

export interface AICoachConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-1.5-flash",
};

export function loadAIConfig(): AICoachConfig | null {
  if (typeof window === "undefined") return null;
  const apiKey = window.localStorage.getItem(KEY_STORAGE);
  if (!apiKey) return null;
  const provider = (window.localStorage.getItem(PROVIDER_STORAGE) as AIProvider) || "openai";
  const model = window.localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODELS[provider];
  return { provider, apiKey, model };
}

export function saveAIConfig(cfg: AICoachConfig) {
  window.localStorage.setItem(KEY_STORAGE, cfg.apiKey);
  window.localStorage.setItem(PROVIDER_STORAGE, cfg.provider);
  window.localStorage.setItem(MODEL_STORAGE, cfg.model);
}

export function clearAIConfig() {
  window.localStorage.removeItem(KEY_STORAGE);
  window.localStorage.removeItem(PROVIDER_STORAGE);
  window.localStorage.removeItem(MODEL_STORAGE);
}

export function defaultModelFor(p: AIProvider) {
  return DEFAULT_MODELS[p];
}

export interface MoveContext {
  san: string;
  side: "w" | "b";
  fenBefore: string;
  fenAfter: string;
  annotation: string;
  evalCp: number;
  bestMoveSan?: string | null;
  cpLoss?: number;
  gameHeader: { white: string; black: string; opening: string };
}

function buildPrompt(m: MoveContext) {
  const player = m.side === "w" ? m.gameHeader.white : m.gameHeader.black;
  return [
    `You are a friendly chess coach explaining a single move in plain language.`,
    `Game: ${m.gameHeader.white} vs ${m.gameHeader.black}. Opening: ${m.gameHeader.opening}.`,
    `Position (FEN before move): ${m.fenBefore}`,
    `${player} played ${m.san} (classified "${m.annotation}"${
      m.bestMoveSan ? `, engine preferred ${m.bestMoveSan}` : ""
    }${m.cpLoss ? `, lost ~${(m.cpLoss / 100).toFixed(2)} pawns` : ""}).`,
    `Evaluation after the move: ${(m.evalCp / 100).toFixed(2)} (White POV).`,
    `Explain in 3–5 short sentences: what the idea is, why it is good/bad, and what the concrete threats or plans are for both sides. Skip fluff.`,
  ].join("\n");
}

export async function explainMove(cfg: AICoachConfig, ctx: MoveContext): Promise<string> {
  const prompt = buildPrompt(ctx);
  if (cfg.provider === "openai") {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: "system", content: "You are a concise, encouraging chess coach." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });
    if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim() ?? "(no reply)";
  }
  // Gemini
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      cfg.model,
    )}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    },
  );
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "(no reply)";
}