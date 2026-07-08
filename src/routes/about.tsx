import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Cpu, Sparkles, Globe, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CheckItApp" },
      {
        name: "description",
        content: "CheckItApp is a modern chess game analyzer powered by real Stockfish 16 NNUE and an AI coach. Fast, private, browser-native.",
      },
      { property: "og:title", content: "About — CheckItApp" },
      { property: "og:description", content: "Modern chess analyzer powered by Stockfish 16 NNUE and AI." },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  { icon: Cpu, title: "Real Stockfish 16 NNUE", text: "The full engine runs directly in your browser via WebAssembly — no server round-trip, no throttling." },
  { icon: Sparkles, title: "AI Coach (BYO key)", text: "Bring your own OpenAI or Gemini API key. Your key stays 100% local. Explanations are generated on demand." },
  { icon: Globe, title: "Chess.com & Lichess", text: "Paste a link, a username, or raw PGN. Every game is imported and re-analyzed move by move." },
  { icon: ShieldCheck, title: "Private by design", text: "CheckItApp is a static site. No accounts, no tracking, no server storage. Your games never leave your browser." },
];

function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          A modern chess lab, built in the open.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          CheckItApp exists for one reason: to make deep, honest chess analysis
          feel effortless. No paywalls in front of the engine. No mystery around
          what a "brilliant" or "blunder" actually means. Just the position,
          the truth, and the plan.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-strong rounded-2xl p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald to-sky text-background ring-glow">
                <f.icon className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/analyze" className="rounded-full bg-gradient-to-r from-emerald to-sky px-5 py-2.5 text-sm font-medium text-background ring-glow">
            Try the analyzer
          </Link>
          <Link to="/social" className="glass rounded-full px-5 py-2.5 text-sm font-medium">
            Follow @checkitapps
          </Link>
        </div>
      </section>
    </main>
  );
}