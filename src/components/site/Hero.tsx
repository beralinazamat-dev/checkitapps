import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-10 sm:pt-24 sm:pb-16">
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-emerald" />
            Powered by Stockfish 16 · AI Coach Explanations
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Understand <span className="text-gradient">every move</span> you play.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            Import any Chess.com or Lichess game and get deep Stockfish analysis,
            classified move annotations, and a personal AI coach that explains the
            ideas in plain language.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#analyze"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-sky px-5 py-2.5 text-sm font-medium text-background ring-glow transition hover:opacity-95"
            >
              Analyze a game
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#board"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/10"
            >
              <Cpu className="h-4 w-4 text-amber" />
              See it in action
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <Stat label="Games analyzed" value="2.4M+" />
            <Stat label="Avg accuracy gain" value="+14%" />
            <Stat label="Openings indexed" value="3,400" />
            <Stat label="Active labs" value="68 countries" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-lg font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}