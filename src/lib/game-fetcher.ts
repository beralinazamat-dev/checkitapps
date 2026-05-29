import { Chess } from "chess.js";
import type { Annotation } from "./sample-game";

export interface ImportedMove {
  ply: number;
  san: string;
  side: "w" | "b";
  annotation: Annotation;
  evalCp: number;
  coach: string;
}

export interface ImportedGame {
  id: string;
  source: "chess.com" | "lichess" | "pgn";
  white: string;
  black: string;
  whiteRating?: number;
  blackRating?: number;
  result: string;
  event: string;
  opening: string;
  timeControl?: string;
  endedAt?: number; // unix ms
  url?: string;
  pgn: string;
  moves: ImportedMove[];
}

export interface GameSummary {
  id: string;
  source: "chess.com" | "lichess";
  white: string;
  black: string;
  whiteRating?: number;
  blackRating?: number;
  result: string;
  timeClass?: string;
  endedAt: number;
  url: string;
  pgn: string;
}

const HEADER_RE = /\[(\w+)\s+"([^"]*)"\]/g;

function parseHeaders(pgn: string): Record<string, string> {
  const out: Record<string, string> = {};
  let m: RegExpExecArray | null;
  HEADER_RE.lastIndex = 0;
  while ((m = HEADER_RE.exec(pgn))) out[m[1]!] = m[2]!;
  return out;
}

/** Parse a PGN string into an ImportedGame with neutral annotations. */
export function parsePgn(pgn: string, fallbackId = "pgn"): ImportedGame {
  const headers = parseHeaders(pgn);
  const chess = new Chess();
  // chess.js is lenient with PGN by default; throws on hard parse failures.
  chess.loadPgn(pgn);
  const history = chess.history({ verbose: true });
  const moves: ImportedMove[] = history.map((h, i) => ({
    ply: i + 1,
    san: h.san,
    side: h.color as "w" | "b",
    annotation: "good",
    evalCp: 0,
    coach: "",
  }));

  return {
    id: fallbackId,
    source: "pgn",
    white: headers.White ?? "White",
    black: headers.Black ?? "Black",
    whiteRating: headers.WhiteElo ? Number(headers.WhiteElo) : undefined,
    blackRating: headers.BlackElo ? Number(headers.BlackElo) : undefined,
    result: headers.Result ?? "*",
    event: headers.Event ?? "Imported game",
    opening: headers.Opening ?? headers.ECO ?? "—",
    timeControl: headers.TimeControl,
    url: headers.Site && headers.Site.startsWith("http") ? headers.Site : undefined,
    pgn,
    moves,
  };
}

/** Detect platform + extract identifiers from a URL or bare username. */
export function detectInput(raw: string): {
  kind: "chesscom-user" | "lichess-user" | "lichess-game" | "chesscom-game" | "username";
  value: string;
} {
  const s = raw.trim();
  // Lichess game URL: lichess.org/{8 or 12 chars}
  const lg = s.match(/lichess\.org\/([a-zA-Z0-9]{8,12})(?:\/(?:white|black))?/i);
  if (lg) return { kind: "lichess-game", value: lg[1]! };
  // Lichess user URL
  const lu = s.match(/lichess\.org\/@\/([\w-]+)/i);
  if (lu) return { kind: "lichess-user", value: lu[1]! };
  // Chess.com game URL (live/daily) — we can't fetch by id, fall back to player lookup
  const cg = s.match(/chess\.com\/(?:game|analysis)\/(?:live|daily)\/(\d+)/i);
  if (cg) return { kind: "chesscom-game", value: cg[1]! };
  // Chess.com user URL
  const cu = s.match(/chess\.com\/(?:member|stats|home)\/([\w-]+)/i);
  if (cu) return { kind: "chesscom-user", value: cu[1]! };
  // bare username
  return { kind: "username", value: s.replace(/^@/, "") };
}

interface ChessComGame {
  url: string;
  pgn?: string;
  end_time: number;
  time_class?: string;
  time_control?: string;
  white: { username: string; rating?: number; result: string };
  black: { username: string; rating?: number; result: string };
}

function chesscomResult(w: string, b: string): string {
  if (w === "win") return "1-0";
  if (b === "win") return "0-1";
  return "½-½";
}

/** Fetch up to `limit` most recent Chess.com games for a username. */
export async function fetchChessComGames(
  username: string,
  limit = 100,
): Promise<GameSummary[]> {
  const u = username.toLowerCase();
  const archivesRes = await fetch(
    `https://api.chess.com/pub/player/${encodeURIComponent(u)}/games/archives`,
  );
  if (archivesRes.status === 404)
    throw new Error(`Chess.com user "${username}" not found.`);
  if (!archivesRes.ok)
    throw new Error(`Chess.com responded ${archivesRes.status}.`);
  const { archives } = (await archivesRes.json()) as { archives: string[] };
  if (!archives?.length) return [];

  // Walk months newest → oldest until we have enough games.
  const out: GameSummary[] = [];
  for (let i = archives.length - 1; i >= 0 && out.length < limit; i--) {
    const monthUrl = archives[i]!;
    const r = await fetch(monthUrl);
    if (!r.ok) continue;
    const { games } = (await r.json()) as { games: ChessComGame[] };
    // Sort newest first within month
    games.sort((a, b) => b.end_time - a.end_time);
    for (const g of games) {
      if (!g.pgn) continue;
      out.push({
        id: g.url.split("/").pop() ?? g.url,
        source: "chess.com",
        white: g.white.username,
        black: g.black.username,
        whiteRating: g.white.rating,
        blackRating: g.black.rating,
        result: chesscomResult(g.white.result, g.black.result),
        timeClass: g.time_class,
        endedAt: g.end_time * 1000,
        url: g.url,
        pgn: g.pgn,
      });
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Fetch up to `limit` most recent Lichess games for a username (NDJSON). */
export async function fetchLichessGames(
  username: string,
  limit = 100,
): Promise<GameSummary[]> {
  const url = `https://lichess.org/api/games/user/${encodeURIComponent(
    username,
  )}?max=${limit}&pgnInJson=true&clocks=false&evals=false&opening=false`;
  const r = await fetch(url, { headers: { Accept: "application/x-ndjson" } });
  if (r.status === 404)
    throw new Error(`Lichess user "${username}" not found.`);
  if (!r.ok) throw new Error(`Lichess responded ${r.status}.`);
  const text = await r.text();
  const out: GameSummary[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    try {
      const g = JSON.parse(line);
      const winner = g.winner as "white" | "black" | undefined;
      const result = winner === "white" ? "1-0" : winner === "black" ? "0-1" : "½-½";
      out.push({
        id: g.id,
        source: "lichess",
        white: g.players?.white?.user?.name ?? g.players?.white?.userId ?? "Anonymous",
        black: g.players?.black?.user?.name ?? g.players?.black?.userId ?? "Anonymous",
        whiteRating: g.players?.white?.rating,
        blackRating: g.players?.black?.rating,
        result,
        timeClass: g.speed,
        endedAt: g.lastMoveAt ?? g.createdAt ?? Date.now(),
        url: `https://lichess.org/${g.id}`,
        pgn: g.pgn ?? "",
      });
    } catch {
      /* skip malformed line */
    }
  }
  return out.filter((g) => g.pgn);
}

/** Try Chess.com first, then Lichess. Returns the platform that responded. */
export async function fetchUserGamesAuto(
  username: string,
  limit = 100,
): Promise<{ games: GameSummary[]; platform: "chess.com" | "lichess" }> {
  try {
    const games = await fetchChessComGames(username, limit);
    if (games.length) return { games, platform: "chess.com" };
  } catch {
    /* fall through to lichess */
  }
  const games = await fetchLichessGames(username, limit);
  return { games, platform: "lichess" };
}

/** Fetch a single Lichess game by id and return as a full ImportedGame. */
export async function fetchLichessGame(id: string): Promise<ImportedGame> {
  const r = await fetch(
    `https://lichess.org/game/export/${encodeURIComponent(id)}?pgnInJson=true&clocks=false&evals=false`,
    { headers: { Accept: "application/json" } },
  );
  if (!r.ok) throw new Error(`Lichess game ${id} not found.`);
  const g = await r.json();
  return parsePgn(g.pgn, `lichess-${id}`);
}

/** Convert a summary into a fully parsed game ready for the board. */
export function summaryToGame(s: GameSummary): ImportedGame {
  const parsed = parsePgn(s.pgn, `${s.source}-${s.id}`);
  return {
    ...parsed,
    source: s.source,
    url: s.url,
    white: s.white,
    black: s.black,
    whiteRating: s.whiteRating,
    blackRating: s.blackRating,
    result: s.result,
    endedAt: s.endedAt,
  };
}