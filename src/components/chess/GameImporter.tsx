import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, User, FileCode2, ArrowRight, Loader2, Search, Swords } from "lucide-react";
import { toast } from "sonner";
import {
  detectInput,
  fetchChessComGame,
  fetchChessComGames,
  fetchLichessGame,
  fetchLichessGames,
  fetchUserGamesAuto,
  parsePgn,
  summaryToGame,
  type GameSummary,
  type ImportedGame,
} from "@/lib/game-fetcher";

type Tab = "url" | "username" | "pgn";

const TABS: { id: Tab; label: string; icon: typeof Link2; hint: string }[] = [
  { id: "url", label: "Game URL", icon: Link2, hint: "Paste a Chess.com or Lichess game link" },
  { id: "username", label: "Username", icon: User, hint: "Fetch recent games from Chess.com" },
  { id: "pgn", label: "Paste PGN", icon: FileCode2, hint: "Drop in raw PGN notation" },
];

export function GameImporter({ onGameSelected }: { onGameSelected: (game: ImportedGame) => void }) {
  const [tab, setTab] = useState<Tab>("url");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [platform, setPlatform] = useState<"chess.com" | "lichess" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const input = value.trim();
    if (!input) {
      toast.error("Add a link, username, or PGN first.");
      return;
    }
    setLoading(true);
    try {
      if (tab === "pgn") {
        const game = parsePgn(input, "pgn-import");
        onGameSelected(game);
        setGames([]);
        toast.success("PGN loaded into the analysis board.");
        document.querySelector("#board")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const detected = detectInput(input);
      if (detected.kind === "chesscom-game") {
        const game = await fetchChessComGame(detected.value);
        onGameSelected(game);
        setGames([]);
        toast.success("Chess.com game loaded for analysis.");
        document.querySelector("#board")?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (detected.kind === "lichess-game") {
        const game = await fetchLichessGame(detected.value);
        onGameSelected(game);
        setGames([]);
        toast.success("Lichess game loaded for analysis.");
        document.querySelector("#board")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const username = detected.value;
      const result = detected.kind === "chesscom-user"
        ? { games: await fetchChessComGames(username, 100), platform: "chess.com" as const }
        : detected.kind === "lichess-user"
          ? { games: await fetchLichessGames(username, 100), platform: "lichess" as const }
          : await fetchUserGamesAuto(username, 100);

      setGames(result.games);
      setPlatform(result.platform);
      setSelectedId(null);
      if (result.games.length) {
        toast.success(`Found ${result.games.length} recent ${result.platform} games. Choose one below.`);
      } else {
        toast.error("No recent public games found for that player.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch games right now.");
    } finally {
      setLoading(false);
    }
  }

  function analyzeGame(game: GameSummary) {
    setSelectedId(game.id);
    onGameSelected(summaryToGame(game));
    toast.success("Game loaded into the analysis board.");
    document.querySelector("#board")?.scrollIntoView({ behavior: "smooth" });
  }

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <section id="analyze" className="relative py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="01 · Import"
          title="Bring any game into the lab"
          subtitle="Three frictionless ways to get a position on the board — pick whichever fits how you play."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-strong mt-10 rounded-3xl p-2"
        >
          <div className="flex flex-col gap-1 rounded-2xl bg-background/40 p-1 sm:flex-row">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setValue("");
                  }}
                  className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="importer-tab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.03] ring-1 ring-white/15"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="px-4 pt-5 pb-4 sm:px-6 sm:pb-6">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              {active.hint}
            </label>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-2 flex flex-col gap-3 sm:flex-row"
              >
                {tab === "pgn" ? (
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={5}
                    placeholder={'[Event "Casual Game"]\n1. e4 e5 2. Nf3 Nc6 ...'}
                    className="w-full resize-none rounded-xl border border-glass-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald/60 focus:outline-none focus:ring-2 focus:ring-emerald/30"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={
                      tab === "url"
                        ? "https://www.chess.com/game/live/..."
                        : "e.g. magnuscarlsen"
                    }
                    className="w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald/60 focus:outline-none focus:ring-2 focus:ring-emerald/30"
                  />
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-sky px-5 py-3 text-sm font-semibold text-background ring-glow transition hover:opacity-95 disabled:opacity-60 sm:self-stretch"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                    </>
                  ) : (
                    <>
                      Analyze
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="opacity-70">Try:</span>
              {(tab === "url"
                ? ["https://www.chess.com/game/live/169333448884", "lichess.org/abcd1234"]
                : tab === "username"
                  ? ["hikaru", "danielnaroditsky", "anishgiri"]
                  : ["Opera Game 1858", "Immortal Game 1851"]
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue(s)}
                  className="rounded-full border border-glass-border bg-white/[0.03] px-2.5 py-1 transition hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>

          <AnimatePresence>
            {games.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="border-t border-glass-border px-4 pb-5 sm:px-6 sm:pb-6"
              >
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald">
                      <Search className="h-3.5 w-3.5" /> Latest games from {platform}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Showing up to 100 public games. Pick one to load it into the analysis board.</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{games.length} games</span>
                </div>
                <div className="glass max-h-[420px] overflow-y-auto rounded-2xl p-2">
                  {games.map((game) => (
                    <button
                      key={`${game.source}-${game.id}`}
                      type="button"
                      onClick={() => analyzeGame(game)}
                      className={`mb-2 flex w-full flex-col gap-2 rounded-xl border px-3 py-3 text-left transition last:mb-0 sm:flex-row sm:items-center sm:justify-between ${
                        selectedId === game.id ? "border-emerald/50 bg-emerald/10" : "border-glass-border bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                          <Swords className="h-4 w-4 text-emerald" />
                          {game.white} <span className="text-muted-foreground">vs</span> {game.black}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {game.whiteRating ?? "—"} · {game.result} · {game.blackRating ?? "—"}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-glass-border px-2 py-1">{game.timeClass ?? "game"}</span>
                        <span>{new Date(game.endedAt).toLocaleDateString()}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald">{kicker}</span>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-balance text-muted-foreground sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}