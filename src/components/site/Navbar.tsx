import { motion } from "framer-motion";
import { Crown, Github } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="glass-strong flex items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald to-sky text-background ring-glow">
              <Crown className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              CheckItApp
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#analyze" className="transition hover:text-foreground">Analyze</a>
            <a href="#board" className="transition hover:text-foreground">Live Board</a>
            <a href="#openings" className="transition hover:text-foreground">Openings</a>
            <a href="#footprint" className="transition hover:text-foreground">Global</a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#analyze"
              className="hidden rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90 sm:inline-flex"
            >
              Start analyzing
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="grid h-9 w-9 place-items-center rounded-full border border-glass-border text-muted-foreground transition hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}