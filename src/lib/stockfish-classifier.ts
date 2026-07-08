// Real Stockfish-based game classifier.
// Walks every position in the game with a fresh engine analysis, computes the
// centipawn loss for each played move, and assigns a chess.com-style label.

import { Chess } from "chess.js";
import { StockfishEngine } from "./stockfish-engine";
import type { AnnotatedMove, Annotation } from "./sample-game";
import type { ImportedGame } from "./game-fetcher";

export interface ClassifiedMove extends AnnotatedMove {
  bestMoveUci: string | null;
  bestMoveSan: string | null;
  playedUci: string;
  cpLoss: number; // centipawn loss vs engine best (>=0)
}

export interface ClassificationProgress {
  done: number;
  total: number;
  currentPly: number;
}

function classifyByCpl(
  cpl: number,
  ply: number,
  isMateThreat: boolean,
  playedIsBest: boolean,
  san: string,
): Annotation {
  if (ply <= 10) return "book";
  if (san.includes("#")) return "brilliant";
  if (playedIsBest && isMateThreat) return "brilliant";
  if (playedIsBest) return "best";
  if (cpl <= 15) return "excellent";
  if (cpl <= 40) return "good";
  if (cpl <= 90) return "inaccuracy";
  if (cpl <= 200) return "mistake";
  if (cpl <= 400) return "miss";
  return "blunder";
}

function coachFor(a: Annotation, san: string, bestSan: string | null, cpl: number, side: "w" | "b") {
  const player = side === "w" ? "White" : "Black";
  const loss = cpl > 0 ? ` (loses ~${(cpl / 100).toFixed(2)} pawns)` : "";
  const suggest = bestSan && bestSan !== san ? ` Engine preferred ${bestSan}.` : "";
  const map: Record<Annotation, string> = {
    brilliant: `${san} — a spectacular move by ${player}. Hard to find and completely decisive.`,
    great: `${san} is a great practical decision by ${player}.${suggest}`,
    best: `${san} matches the engine's top choice — precise and principled.`,
    excellent: `${san} is nearly perfect${loss}. ${player} keeps the position under control.${suggest}`,
    good: `${san} is a solid choice${loss}.${suggest}`,
    book: `${san} — a known theoretical move. Fight for the center, develop, and keep the king safe.`,
    inaccuracy: `${san} is imprecise${loss}. There was something a bit better.${suggest}`,
    mistake: `${san} is a mistake${loss}. ${player} gives the opponent a clear chance to improve.${suggest}`,
    miss: `${san} misses a stronger continuation${loss}. Scan forcing moves first: checks, captures, threats.${suggest}`,
    blunder: `${san} is a blunder${loss}. This is a turning point in the game.${suggest}`,
  };
  return map[a];
}

/** Convert UCI to SAN in the given position. Returns null if invalid. */
function uciToSan(fen: string, uci: string): string | null {
  try {
    const c = new Chess(fen);
    const m = c.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.length > 4 ? uci[4] : undefined,
    });
    return m?.san ?? null;
  } catch {
    return null;
  }
}

/**
 * Run real Stockfish analysis on every position in the game and return a new
 * game object with corrected classifications, evaluations and coach text.
 */
export async function analyzeGameWithStockfish(
  game: ImportedGame,
  depth = 14,
  onProgress?: (p: ClassificationProgress) => void,
  signal?: AbortSignal,
): Promise<ImportedGame> {
  const engine = new StockfishEngine();
  try {
    const chess = new Chess();
    // Load headers/moves from the PGN so we get the same SAN sequence.
    chess.loadPgn(game.pgn);
    const history = chess.history({ verbose: true });
    const total = history.length;
    const classified: ClassifiedMove[] = [];

    for (let i = 0; i < history.length; i++) {
      if (signal?.aborted) throw new Error("Analysis cancelled");
      const h = history[i]!;
      const fenBefore = h.before;
      const fenAfter = h.after;
      const side = h.color as "w" | "b";
      const stmSign = side === "w" ? 1 : -1;

      // Best line from the position BEFORE the move.
      const best = await engine.analyzePosition(fenBefore, depth);
      const bestUci = best.bestMove ?? best.pv[0] ?? null;
      const bestSan = bestUci ? uciToSan(fenBefore, bestUci) : null;
      const bestScoreStm = best.scoreWhiteCp * stmSign; // from side-to-move POV

      // Actual eval after the move played.
      const after = await engine.analyzePosition(fenAfter, depth);
      // after.scoreWhiteCp is from White POV, but side-to-move flipped. Convert to
      // played-side POV: since opponent is now to move, White eval * stmSign
      // still gives the played-side's evaluation of the resulting position.
      const playedScoreStm = after.scoreWhiteCp * stmSign;

      const cpLossRaw = bestScoreStm - playedScoreStm;
      const cpLoss = Math.max(0, cpLossRaw);

      const playedUci = `${h.from}${h.to}${h.promotion ?? ""}`;
      const playedIsBest = !!bestUci && playedUci === bestUci;
      const isMateThreat = best.mate !== null && Math.abs(best.mate) <= 3;

      const annotation = classifyByCpl(cpLoss, i + 1, isMateThreat, playedIsBest, h.san);

      classified.push({
        ply: i + 1,
        san: h.san,
        side,
        annotation,
        evalCp: after.scoreWhiteCp,
        coach: coachFor(annotation, h.san, bestSan, cpLoss, side),
        bestMoveUci: bestUci,
        bestMoveSan: bestSan,
        playedUci,
        cpLoss,
      });

      onProgress?.({ done: i + 1, total, currentPly: i + 1 });
    }

    return { ...game, moves: classified };
  } finally {
    engine.destroy();
  }
}