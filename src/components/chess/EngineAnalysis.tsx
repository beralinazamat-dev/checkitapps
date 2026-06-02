import { Cpu, Loader2 } from "lucide-react";
import { Chess } from "chess.js";
import { useMemo } from "react";
import { useStockfish } from "@/hooks/use-stockfish";

export function EngineAnalysis({ fen }: { fen: string }) {
  const { line, status, error } = useStockfish(fen, 16);

  // Convert UCI principal variation into readable SAN for humans.
  const sanPv = useMemo(() => {
    if (!line?.pv?.length) return [] as string[];
    try {
      const chess = new Chess(fen);
      const out: string[] = [];
      for (const uci of line.pv.slice(0, 5)) {
        const move = chess.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci.length > 4 ? uci[4] : undefined,
        });
        if (!move) break;
        out.push(move.san);
      }
      return out;
    } catch {
      return [];
    }
  }, [line?.pv, fen]);

  const evalDisplay = !line
    ? "…"
    : line.mate !== null
      ? `M${Math.abs(line.mate)}${line.mate < 0 ? " (Black)" : ""}`
      : `${line.scoreWhiteCp >= 0 ? "+" : ""}${(line.scoreWhiteCp / 100).toFixed(2)}`;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-emerald">
        <span className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5" />
          Stockfish 10 · Live Engine
        </span>
        <span className="font-mono text-muted-foreground">
          {status === "loading" && (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> loading…
            </span>
          )}
          {status === "thinking" && line && `depth ${line.depth}`}
          {status === "ready" && line && `depth ${line.depth} ✓`}
          {status === "error" && <span className="text-rose-400">error</span>}
        </span>
      </div>

      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}

      <div className="mt-3 flex items-baseline gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Evaluation</div>
          <div className="font-display text-2xl font-semibold tabular-nums">
            {evalDisplay}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Best move</div>
          <div className="font-display text-2xl font-semibold text-emerald">
            {sanPv[0] ?? "—"}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-muted-foreground">Principal variation</div>
        <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-sm">
          {sanPv.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            sanPv.map((san, i) => (
              <span
                key={i}
                className={`rounded-md px-1.5 py-0.5 ${
                  i === 0
                    ? "bg-emerald/15 text-emerald ring-1 ring-emerald/30"
                    : "bg-white/[0.04] text-foreground/85"
                }`}
              >
                {san}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}