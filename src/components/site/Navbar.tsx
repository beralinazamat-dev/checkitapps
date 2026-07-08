import { motion } from "framer-motion";
import { Crown, Instagram, Music2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/analyze", label: "Analyze" },
  { to: "/openings", label: "Openings" },
  { to: "/social", label: "Social" },
  { to: "/about", label: "About" },
] as const;

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
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald to-sky text-background ring-glow">
              <Crown className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              CheckItApp
            </span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="transition hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/analyze"
              className="hidden rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90 sm:inline-flex"
            >
              Start analyzing
            </Link>
            <a
              href="https://www.tiktok.com/@checkitapps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="grid h-9 w-9 place-items-center rounded-full border border-glass-border text-muted-foreground transition hover:text-foreground"
            >
              <Music2 className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/checkitapps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-glass-border text-muted-foreground transition hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}