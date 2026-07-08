import { Fragment, useEffect, useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Cpu,
  KeyRound,
  Loader2,
} from "lucide-react";
import { SAMPLE_GAME } from "@/lib/sample-game";
import { ANNOTATION_META, ANNOTATION_ORDER } from "@/lib/annotations";
import type { Annotation } from "@/lib/sample-game";
import type { ImportedGame } from "@/lib/game-fetcher";
import { EvalBar } from "./EvalBar";
import { EvalGraph } from "./EvalGraph";
import { SectionHeading } from "./GameImporter";
import { EngineAnalysis } from "./EngineAnalysis";
import { BestMoveArrow } from "./BestMoveArrow";
import { useStockfish } from "@/hooks/use-stockfish";
import { analyzeGameWithStockfish, type ClassificationProgress } from "@/lib/stockfish-classifier";
import { toast } from "sonner";
import { AIKeyDialog } from "@/components/ai/AIKeyDialog";
import { explainMove, loadAIConfig } from "@/lib/ai-coach";

export function LiveBoardShowcase({ game }: { game?: ImportedGame | null }) {
  const initialGame = game ?? SAMPLE_GAME;
  const [analyzed, setAnalyzed] = useState<ImportedGame | null>(null);
  const displayGame = analyzed ?? initialGame;
  const gameKey = (analyzed ?? game)?.id ?? "sample-game";
  const moves = displayGame.moves;
  const [ply, setPly] = useState(0); // 0 = starting position
  const [playing, setPlaying] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState<ClassificationProgress | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setPly(0);
    setPlaying(false);
    setAnalyzed(null);
    setAiText(null);
  }, [gameKey]);

  // Build the position for the given ply by replaying SAN moves.
  const { fen, lastTo } = useMemo(() => {
    const chess = new Chess();
    let lastToSq: Square | null = null;
    for (let i = 0; i < ply; i++) {
      try {
        const m = chess.move(moves[i].san);
        if (m) lastToSq = m.to as Square;
      } catch {
        break;
      }
    }
    return { fen: chess.fen(), lastTo: lastToSq };
  }, [ply, moves]);

  const currentMove = ply > 0 ? moves[ply - 1] : null;
  const evalCp = currentMove?.evalCp ?? 20;
  const orientation: "white" | "black" =
    (displayGame as ImportedGame).viewerSide === "b" ? "black" : "white";

  // Live Stockfish for the current position — powers arrows + engine panel.
  const { line: liveLine, status: liveStatus, error: liveError } = useStockfish(fen, 20);

  const bestArrow = useMemo(() => {
    const uci = liveLine?.bestMove ?? liveLine?.pv?.[0];
    if (!uci || uci.length < 4) return null;
    return { from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square };
  }, [liveLine?.bestMove, liveLine?.pv]);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setPly((p) => {
        if (p >= moves.length) {
          setPlaying(false);
          return p;
        }
        return p + 1;
      });
    }, 1100);
    return () => clearTimeout(t);
  }, [playing, ply, moves.length]);

  const go = (delta: number) =>
    setPly((p) => Math.max(0, Math.min(moves.length, p + delta)));

  // Group moves into pairs for the move-list display.
  const pairs: { num: number; white?: typeof moves[number]; black?: typeof moves[number] }[] = [];
  moves.forEach((m, idx) => {
    const num = Math.floor(idx / 2) + 1;
    const slot = pairs[num - 1] ?? (pairs[num - 1] = { num });
    if (idx % 2 === 0) slot.white = m;
    else slot.black = m;
  });

  // Per-player tally of move classifications across the entire game.
  const tallies = useMemo(() => {
    const empty = () =>
      ANNOTATION_ORDER.reduce(
        (acc, k) => ((acc[k] = 0), acc),
        {} as Record<Annotation, number>,
      );
    const white = empty();
    const black = empty();
    for (const m of moves) {
      (m.side === "w" ? white : black)[m.annotation]++;
    }
    return { white, black };
  }, [moves]);

  async function runDeepAnalysis() {
    if (analyzing) return;
    const source = (initialGame as ImportedGame).pgn ? (initialGame as ImportedGame) : null;
    if (!source) {
      toast.error("Import a real game (URL / username / PGN) first — the sample game has no PGN.");
      return;
    }
    setAnalyzing(true);
    setProgress({ done: 0, total: moves.length, currentPly: 0 });
    try {
      const result = await analyzeGameWithStockfish(source, 14, (p) => setProgress(p));
      setAnalyzed(result);
      toast.success("Deep Stockfish analysis complete.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
      setProgress(null);
    }
  }

  async function askAI() {
    if (!currentMove) return;
    const cfg = loadAIConfig();
    if (!cfg) {
      setAiOpen(true);
      return;
    }
    setAiLoading(true);
    setAiText(null);
    try {
      // Compute FEN before the move.
      const chess = new Chess();
      for (let i = 0; i < ply - 1; i++) chess.move(moves[i].san);
      const fenBefore = chess.fen();
      const anyMove = currentMove as typeof currentMove & { bestMoveSan?: string; cpLoss?: number };
      const text = await explainMove(cfg, {
        san: currentMove.san,
        side: currentMove.side,
        fenBefore,
        fenAfter: fen,
        annotation: currentMove.annotation,
        evalCp: currentMove.evalCp,
        bestMoveSan: anyMove.bestMoveSan ?? null,
        cpLoss: anyMove.cpLoss,
        gameHeader: {
          white: displayGame.white,
          black: displayGame.black,
          opening: displayGame.opening,
        },
      });
      setAiText(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <section id="board" className="relative py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="02 · Live Analysis"
          title="A board that teaches you back"
          subtitle="Every move classified, every position evaluated, every decision explained — all synchronized in real time."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="glass-strong mt-10 grid gap-4 rounded-3xl p-4 sm:p-6 lg:grid-cols-[auto_1fr_22rem]"
        >
          {/* Board + eval bar */}
          <div className="flex items-start gap-3 self-start">
            <div className="hidden self-stretch sm:block" style={{ width: 28 }}>
              <EvalBar evalCp={evalCp} />
            </div>
            <div className="relative aspect-square w-full max-w-[540px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-glass-border lg:w-[440px]">
              <div className="absolute inset-0">
              <Chessboard
                options={{
                  position: fen,
                  allowDragging: false,
                  showNotation: true,
                  animationDurationInMs: 280,
                  boardOrientation: orientation,
                  darkSquareStyle: { backgroundColor: "#3a4d5c" },
                  lightSquareStyle: { backgroundColor: "#e8edf2" },
                  boardStyle: {
                    borderRadius: 12,
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1 / 1",
                  },
                }}
              />
              </div>
              {bestArrow && (
                <BestMoveArrow
                  from={bestArrow.from}
                  to={bestArrow.to}
                  orientation={orientation}
                />
              )}
              {currentMove && lastTo && (
                <SquareAnnotation
                  square={lastTo}
                  orientation={orientation}
                  annotation={currentMove.annotation}
                  keyId={`${currentMove.ply}-${currentMove.annotation}`}
                />
              )}
            </div>
          </div>

          {/* Center: header, controls, AI coach, eval graph */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {displayGame.event} · {displayGame.opening}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold sm:text-2xl">
                  {displayGame.white}{" "}
                  <span className="text-muted-foreground">vs</span> {displayGame.black}
                </h3>
              </div>
              <span className="self-start rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-1 font-mono text-xs text-emerald">
                {displayGame.result}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IconBtn onClick={() => setPly(0)} title="Reset">
                <RotateCcw className="h-4 w-4" />
              </IconBtn>
              <IconBtn onClick={() => go(-1)} title="Previous">
                <ChevronLeft className="h-4 w-4" />
              </IconBtn>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-sky px-4 py-2 text-sm font-medium text-background ring-glow transition hover:opacity-95"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Auto-play"}
              </button>
              <IconBtn onClick={() => go(1)} title="Next">
                <ChevronRight className="h-4 w-4" />
              </IconBtn>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                Move {ply} / {moves.length}
              </span>
            </div>

            {/* Deep-analysis + AI action row */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={runDeepAnalysis}
                disabled={analyzing}
                className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3.5 py-1.5 text-xs font-medium text-emerald transition hover:bg-emerald/20 disabled:opacity-60"
              >
                {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Cpu className="h-3.5 w-3.5" />}
                {analyzing
                  ? `Analyzing ${progress?.done ?? 0}/${progress?.total ?? "…"}`
                  : analyzed
                    ? "Re-run deep analysis"
                    : "Deep Stockfish analysis"}
              </button>
              <button
                onClick={askAI}
                disabled={aiLoading || !currentMove}
                className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-3.5 py-1.5 text-xs font-medium text-sky transition hover:bg-sky/20 disabled:opacity-60"
              >
                {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                Ask AI about this move
              </button>
              <button
                onClick={() => setAiOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                title="AI settings"
              >
                <KeyRound className="h-3.5 w-3.5" />
                AI key
              </button>
            </div>

            {aiText && (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sky">
                  <Sparkles className="h-3.5 w-3.5" /> AI explanation
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {aiText}
                </p>
              </div>
            )}

            {/* AI Coach panel */}
            <div className="glass min-h-[148px] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald">
                <Sparkles className="h-3.5 w-3.5" />
                AI Coach
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={ply}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3"
                >
                  {currentMove ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {Math.ceil(currentMove.ply / 2)}
                          {currentMove.side === "w" ? "." : "..."}
                        </span>
                        <span className="font-display text-lg font-semibold">{currentMove.san}</span>
                        <AnnotationChip annotation={currentMove.annotation} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                        {currentMove.coach}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Press <span className="text-foreground">Auto-play</span> or use the arrows to
                      step through the selected game. Every move is classified and explained in
                      plain language.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Real Stockfish engine, live */}
            <EngineAnalysis fen={fen} line={liveLine} status={liveStatus} error={liveError} />

            {/* Eval graph */}
            <div className="glass h-32 rounded-2xl p-3">
              <div className="flex items-center justify-between px-1 pb-1 text-xs text-muted-foreground">
                <span>Evaluation timeline</span>
                <span className="font-mono">
                  {Math.abs(evalCp) >= 9000
                    ? evalCp > 0
                      ? "Mate for White"
                      : "Mate for Black"
                    : `${evalCp >= 0 ? "+" : ""}${(evalCp / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="h-[88px]">
                <EvalGraph moves={moves} currentPly={ply} onSelect={setPly} />
              </div>
            </div>

            {/* Full-game classification summary */}
            <GameSummary
              whiteName={displayGame.white}
              blackName={displayGame.black}
              tallies={tallies}
            />
          </div>

          {/* Right: move list */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-1 pb-2 text-xs uppercase tracking-wider text-muted-foreground">
              <span>Move list</span>
              <span>Eval</span>
            </div>
            <div className="glass max-h-[520px] overflow-y-auto rounded-2xl p-2">
              <table className="w-full text-sm">
                <tbody>
                  {pairs.map((p) => (
                    <tr key={p.num} className="align-top">
                      <td className="w-10 py-1.5 pr-2 text-right font-mono text-xs text-muted-foreground">
                        {p.num}.
                      </td>
                      <MoveCell move={p.white} active={p.white?.ply === ply} onClick={setPly} />
                      <MoveCell move={p.black} active={p.black?.ply === ply} onClick={setPly} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AnnotationLegend />
          </div>
        </motion.div>
      </div>
      <AIKeyDialog open={aiOpen} onClose={() => setAiOpen(false)} />
    </section>
  );
}

function MoveCell({
  move,
  active,
  onClick,
}: {
  move?: { ply: number; san: string; annotation: keyof typeof ANNOTATION_META; evalCp: number };
  active: boolean;
  onClick: (ply: number) => void;
}) {
  if (!move) return <td />;
  const meta = ANNOTATION_META[move.annotation];
  return (
    <td className="py-0.5 pr-1">
      <button
        onClick={() => onClick(move.ply)}
        className={`group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition ${
          active ? "bg-white/10 text-foreground" : "hover:bg-white/[0.04] text-foreground/85"
        }`}
      >
        <span className="flex items-center gap-1.5 font-medium">
          {move.san}
          <span className="font-mono text-xs" style={{ color: meta.color }}>
            {meta.symbol}
          </span>
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {Math.abs(move.evalCp) >= 9000
            ? "M"
            : `${move.evalCp >= 0 ? "+" : ""}${(move.evalCp / 100).toFixed(1)}`}
        </span>
      </button>
    </td>
  );
}

function AnnotationChip({ annotation }: { annotation: keyof typeof ANNOTATION_META }) {
  const meta = ANNOTATION_META[annotation];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: meta.bg, color: meta.color, boxShadow: `inset 0 0 0 1px ${meta.ring}` }}
    >
      <span className="font-mono">{meta.symbol}</span>
      {meta.label}
    </span>
  );
}

function AnnotationBadge({
  annotation,
  san,
}: {
  annotation: keyof typeof ANNOTATION_META;
  san: string;
}) {
  const meta = ANNOTATION_META[annotation];
  return (
    <AnimatePresence>
      <motion.div
        key={san + annotation}
        initial={{ opacity: 0, scale: 0.6, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md"
        style={{
          background: meta.bg,
          color: meta.color,
          boxShadow: `inset 0 0 0 1px ${meta.ring}`,
        }}
      >
        <span className="font-mono">{meta.symbol}</span>
        {san} · {meta.label}
      </motion.div>
    </AnimatePresence>
  );
}

function SquareAnnotation({
  square,
  orientation,
  annotation,
  keyId,
}: {
  square: Square;
  orientation: "white" | "black";
  annotation: keyof typeof ANNOTATION_META;
  keyId: string;
}) {
  const meta = ANNOTATION_META[annotation];
  const file = square.charCodeAt(0) - 97; // a=0..h=7
  const rank = parseInt(square[1]!, 10) - 1; // 1=0..8=7
  const col = orientation === "white" ? file : 7 - file;
  const row = orientation === "white" ? 7 - rank : rank;
  return (
    <AnimatePresence>
      <motion.div
        key={keyId}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.4 }}
        transition={{ type: "spring", bounce: 0.45, duration: 0.45 }}
        className="pointer-events-none absolute"
        style={{
          left: `${(col / 8) * 100}%`,
          top: `${(row / 8) * 100}%`,
          width: "12.5%",
          height: "12.5%",
        }}
      >
        <div
          className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] font-bold shadow-lg"
          style={{
            background: meta.color,
            color: "#0b0f14",
            boxShadow: `0 0 0 2px ${meta.ring}, 0 4px 10px rgb(0 0 0 / 0.4)`,
          }}
          title={meta.label}
        >
          {meta.symbol}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="grid h-9 w-9 place-items-center rounded-full border border-glass-border bg-white/[0.04] text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function AnnotationLegend() {
  const order: (keyof typeof ANNOTATION_META)[] = [
    "brilliant",
    "great",
    "best",
    "excellent",
    "good",
    "book",
    "inaccuracy",
    "mistake",
    "miss",
    "blunder",
  ];
  return (
    <div className="glass mt-3 rounded-2xl p-3">
      <div className="px-1 pb-2 text-xs uppercase tracking-wider text-muted-foreground">
        Move classification
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {order.map((k) => {
          const m = ANNOTATION_META[k];
          return (
            <div
              key={k}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs"
              style={{ background: m.bg, color: m.color }}
            >
              <span className="font-mono">{m.symbol}</span>
              <span className="text-foreground/90">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GameSummary({
  whiteName,
  blackName,
  tallies,
}: {
  whiteName: string;
  blackName: string;
  tallies: { white: Record<Annotation, number>; black: Record<Annotation, number> };
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between px-1 pb-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span>Game report</span>
        <span>Move totals</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1.5 text-sm">
        <div className="text-right font-medium text-foreground/90 truncate">{whiteName}</div>
        <div className="text-center text-xs text-muted-foreground">●</div>
        <div className="text-left font-medium text-foreground/90 truncate">{blackName}</div>
        {ANNOTATION_ORDER.map((k) => {
          const m = ANNOTATION_META[k];
          const w = tallies.white[k];
          const b = tallies.black[k];
          if (w === 0 && b === 0) return null;
          return (
            <Fragment key={k}>
              <div
                className="text-right font-mono tabular-nums"
                style={{ color: m.color }}
              >
                {w}
              </div>
              <div
                className="flex items-center justify-center gap-1.5 rounded-md px-2 py-0.5 text-xs"
                style={{ background: m.bg, color: m.color }}
                title={m.label}
              >
                <span className="font-mono">{m.symbol}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </div>
              <div
                className="text-left font-mono tabular-nums"
                style={{ color: m.color }}
              >
                {b}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}