// Real Stockfish 16 NNUE engine (the same class used by chess.com's analyzer)
// running in a Web Worker. Loaded from jsdelivr CDN via a Blob+importScripts
// trick so it works cross-origin without COOP/COEP headers.
// Single-threaded WASM build — works in every modern browser.

export interface EngineLine {
  depth: number;
  scoreCp: number; // centipawns from side-to-move POV, normalized to White POV below
  scoreWhiteCp: number; // centipawns from White POV. ±100000 = mate
  mate: number | null; // moves to mate (signed, White POV)
  pv: string[]; // UCI moves
  bestMove: string | null;
}

type Listener = (line: EngineLine) => void;

const SF_BASE = "https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/";
const SF_JS = SF_BASE + "stockfish-nnue-16-single.js";

function createWorker(): Worker {
  // We boot a Worker that:
  //  1. Tells the Emscripten module where to fetch the .wasm and .nnue from (jsdelivr has CORS).
  //  2. Loads the Stockfish glue via importScripts (cross-origin allowed inside a Worker).
  //  3. Awaits the Stockfish() factory, then pipes UCI messages both directions.
  const src = `
    self.Module = {
      locateFile: function (path) { return ${JSON.stringify(SF_BASE)} + path; },
      print: function (line) { self.postMessage(line); },
      printErr: function (line) { self.postMessage(line); },
    };
    importScripts(${JSON.stringify(SF_JS)});
    var _sfReady = Stockfish().then(function (sf) {
      sf.addMessageListener(function (line) { self.postMessage(line); });
      return sf;
    });
    var _queue = [];
    self.onmessage = function (e) {
      _sfReady.then(function (sf) {
        if (_queue.length) { _queue.forEach(function (c) { sf.postMessage(c); }); _queue = []; }
        sf.postMessage(e.data);
      });
    };
  `;
  const blob = new Blob([src], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private ready = false;
  private readyPromise: Promise<void>;
  private listeners = new Set<Listener>();
  private currentSideToMove: "w" | "b" = "w";

  constructor() {
    this.readyPromise = this.init();
  }

  private init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = createWorker();
      } catch (e) {
        reject(e);
        return;
      }
      let initialized = false;
      this.worker.onmessage = (ev: MessageEvent) => {
        const line = typeof ev.data === "string" ? ev.data : String(ev.data);
        if (!initialized && line.startsWith("uciok")) {
          this.send("isready");
        } else if (!initialized && line.startsWith("readyok")) {
          initialized = true;
          this.ready = true;
          resolve();
        } else {
          this.handleMessage(line);
        }
      };
      this.worker.onerror = (err) => reject(err);
      this.send("uci");
    });
  }

  private send(cmd: string) {
    this.worker?.postMessage(cmd);
  }

  private latest: EngineLine | null = null;

  private handleMessage(line: string) {
    if (line.startsWith("info")) {
      // Parse: info depth N ... score cp X | score mate Y ... pv e2e4 e7e5 ...
      const depthMatch = line.match(/\bdepth (\d+)/);
      const cpMatch = line.match(/\bscore cp (-?\d+)/);
      const mateMatch = line.match(/\bscore mate (-?\d+)/);
      const pvMatch = line.match(/\bpv (.+?)(?:\s+bmc\s|$)/);
      if (!depthMatch || (!cpMatch && !mateMatch)) return;
      const depth = parseInt(depthMatch[1]!, 10);
      const stmSign = this.currentSideToMove === "w" ? 1 : -1;
      let scoreCp = 0;
      let mate: number | null = null;
      let scoreWhiteCp = 0;
      if (mateMatch) {
        mate = parseInt(mateMatch[1]!, 10) * stmSign;
        scoreWhiteCp = mate >= 0 ? 100000 - mate : -100000 - mate;
        scoreCp = parseInt(mateMatch[1]!, 10) >= 0 ? 99999 : -99999;
      } else if (cpMatch) {
        scoreCp = parseInt(cpMatch[1]!, 10);
        scoreWhiteCp = scoreCp * stmSign;
      }
      const pv = pvMatch ? pvMatch[1]!.trim().split(/\s+/) : [];
      this.latest = {
        depth,
        scoreCp,
        scoreWhiteCp,
        mate,
        pv,
        bestMove: pv[0] ?? this.latest?.bestMove ?? null,
      };
      this.emit(this.latest);
    } else if (line.startsWith("bestmove")) {
      const parts = line.split(/\s+/);
      const bm = parts[1] ?? null;
      if (this.latest) {
        this.latest = { ...this.latest, bestMove: bm };
        this.emit(this.latest);
      }
    }
  }

  private emit(line: EngineLine) {
    for (const l of this.listeners) l(line);
  }

  onUpdate(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async analyze(fen: string, depth = 16) {
    await this.readyPromise;
    if (!this.ready) return;
    // Determine side to move from FEN (2nd field).
    const parts = fen.split(" ");
    this.currentSideToMove = (parts[1] as "w" | "b") ?? "w";
    this.latest = null;
    this.send("stop");
    this.send("ucinewgame");
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
  }

  stop() {
    this.send("stop");
  }

  destroy() {
    this.send("quit");
    this.worker?.terminate();
    this.worker = null;
    this.listeners.clear();
  }
}