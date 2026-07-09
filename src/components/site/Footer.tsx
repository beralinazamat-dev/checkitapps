import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-glass-border/60 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald to-sky text-background ring-glow">
              <Crown className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-semibold">CheckItApp</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Deep Stockfish 16 analysis for your Chess.com and Lichess games — free, private, browser-native.
          </p>
        </div>

        <FooterCol title="Product" links={[
          { to: "/analyze", label: "Analyze" },
          { to: "/openings", label: "Openings" },
          { to: "/about", label: "About" },
        ]} />
        <FooterCol title="Community" links={[
          { to: "/social", label: "Social media" },
          { to: "/support", label: "Support this project" },
          { to: "/contact", label: "Contact" },
        ]} />
        <FooterCol title="Legal" links={[
          { to: "/privacy", label: "Privacy Policy" },
          { to: "/terms", label: "Terms of Service" },
        ]} />
      </div>
      <div className="border-t border-glass-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CheckItApp. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="transition hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}