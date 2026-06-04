import { useEffect, useRef, useState } from "react";
import { StockfishEngine, type EngineLine } from "@/lib/stockfish-engine";

export interface UseStockfishResult {
  line: EngineLine | null;
  status: "loading" | "ready" | "thinking" | "error";
  error: string | null;
}

/**
 * Spin up a Stockfish Web Worker once and re-analyze whenever the FEN changes.
 * Returns live engine output: depth, evaluation, best move, principal variation.
 */
export function useStockfish(fen: string, depth = 22): UseStockfishResult {
  const engineRef = useRef<StockfishEngine | null>(null);
  const [line, setLine] = useState<EngineLine | null>(null);
  const [status, setStatus] = useState<UseStockfishResult["status"]>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let engine: StockfishEngine;
    try {
      engine = new StockfishEngine();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start engine");
      setStatus("error");
      return;
    }
    engineRef.current = engine;
    const unsub = engine.onUpdate((l) => {
      if (cancelled) return;
      setLine(l);
    });
    return () => {
      cancelled = true;
      unsub();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !fen) return;
    setLine(null);
    setStatus("thinking");
    let cancelled = false;
    engine
      .analyze(fen, depth)
      .then(() => {
        if (!cancelled) setStatus("ready");
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Engine error");
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
      engine.stop();
    };
  }, [fen, depth]);

  return { line, status, error };
}