import { useEffect, useState } from "react";
import { X, KeyRound, Trash2 } from "lucide-react";
import {
  clearAIConfig,
  defaultModelFor,
  loadAIConfig,
  saveAIConfig,
  type AIProvider,
} from "@/lib/ai-coach";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function AIKeyDialog({ open, onClose, onSaved }: Props) {
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(defaultModelFor("openai"));

  useEffect(() => {
    if (!open) return;
    const cfg = loadAIConfig();
    if (cfg) {
      setProvider(cfg.provider);
      setApiKey(cfg.apiKey);
      setModel(cfg.model);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <KeyRound className="h-4 w-4 text-emerald" />
            AI Coach — your key
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          CheckItApp is a static site — your API key is stored ONLY in this
          browser (localStorage) and is sent directly to the provider you
          choose. Nothing is uploaded to our servers.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              Provider
            </label>
            <div className="flex gap-2">
              {(["openai", "gemini"] as AIProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProvider(p);
                    setModel(defaultModelFor(p));
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
                    provider === p
                      ? "bg-emerald/15 text-emerald ring-1 ring-emerald/40"
                      : "bg-white/[0.04] text-foreground/80 hover:bg-white/10"
                  }`}
                >
                  {p === "openai" ? "OpenAI" : "Google Gemini"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              API Key
            </label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === "openai" ? "sk-..." : "AIza..."}
              type="password"
              className="w-full rounded-lg border border-glass-border bg-black/30 px-3 py-2 font-mono text-sm outline-none focus:border-emerald/60"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {provider === "openai"
                ? "Get one at platform.openai.com/api-keys"
                : "Get one at aistudio.google.com/apikey"}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              Model
            </label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-glass-border bg-black/30 px-3 py-2 font-mono text-sm outline-none focus:border-emerald/60"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              clearAIConfig();
              setApiKey("");
              onSaved?.();
            }}
            className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" /> Forget key
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!apiKey.trim()) return;
                saveAIConfig({ provider, apiKey: apiKey.trim(), model: model.trim() || defaultModelFor(provider) });
                onSaved?.();
                onClose();
              }}
              className="rounded-lg bg-gradient-to-r from-emerald to-sky px-4 py-2 text-sm font-medium text-background"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}