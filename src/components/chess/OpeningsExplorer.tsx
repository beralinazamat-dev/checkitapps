import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowUpRight, Filter } from "lucide-react";
import { OPENINGS, type OpeningLevel } from "@/lib/openings";
import { SectionHeading } from "./GameImporter";

const LEVELS: ("All" | OpeningLevel)[] = ["All", "Beginner", "Intermediate", "Advanced"];

const LEVEL_STYLE: Record<OpeningLevel, { dot: string; ring: string }> = {
  Beginner: { dot: "bg-emerald", ring: "ring-emerald/40" },
  Intermediate: { dot: "bg-amber", ring: "ring-amber/40" },
  Advanced: { dot: "bg-rose", ring: "ring-rose/40" },
};

export function OpeningsExplorer() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const filtered = level === "All" ? OPENINGS : OPENINGS.filter((o) => o.level === level);

  return (
    <section id="openings" className="relative py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="03 · Theory"
          title="Openings & gambits, explained"
          subtitle="Not memorization — meaning. Understand why each opening exists, who it's for, and the strategic question it answers."
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Level
          </span>
          {LEVELS.map((lv) => {
            const active = lv === level;
            return (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                className={`relative rounded-full px-4 py-1.5 text-sm transition ${
                  active ? "text-background" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="level-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                  />
                )}
                <span className="relative font-medium">{lv}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((o) => {
              const lv = LEVEL_STYLE[o.level];
              return (
                <motion.article
                  layout
                  key={o.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="group glass relative flex flex-col gap-3 rounded-2xl p-5 transition hover:bg-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${lv.dot}`} />
                        <span>{o.level}</span>
                        <span>·</span>
                        <span className="font-mono">{o.eco}</span>
                        <span>·</span>
                        <span>{o.color}</span>
                      </div>
                      <h3 className="mt-1.5 font-display text-lg font-semibold">{o.name}</h3>
                    </div>
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full ring-1 ${lv.ring} bg-white/[0.04] text-muted-foreground transition group-hover:text-foreground`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </span>
                  </div>

                  <code className="rounded-md bg-background/60 px-2 py-1.5 font-mono text-xs text-foreground/85">
                    {o.moves}
                  </code>

                  <p className="text-sm leading-relaxed text-foreground/85">{o.purpose}</p>

                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>{o.style}</span>
                    <span className="inline-flex items-center gap-1 text-foreground/80 transition group-hover:text-foreground">
                      Explore lines <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}