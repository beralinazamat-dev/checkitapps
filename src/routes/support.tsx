import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Heart, Coffee, Star, Share2 } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support this project — CheckItApp" },
      { name: "description", content: "CheckItApp is free and independent. If it has helped your chess, here's how you can support the project." },
      { property: "og:title", content: "Support CheckItApp" },
      { property: "og:description", content: "Help keep CheckItApp free and independent." },
    ],
  }),
  component: SupportPage,
});

const WAYS = [
  { icon: Coffee, title: "Buy us a coffee", text: "One-time donations help cover hosting and development time.", href: "https://buymeacoffee.com/checkitapps", cta: "Donate" },
  { icon: Star, title: "Follow us", text: "A follow on social means a lot for a small independent project.", href: "https://www.instagram.com/checkitapps", cta: "Follow" },
  { icon: Share2, title: "Share with a friend", text: "Know someone learning chess? Share the link — that's the best support.", href: "https://checkitapps.lovable.app", cta: "Open" },
];

function SupportPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald">Support</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          Keep CheckItApp <span className="bg-gradient-to-r from-emerald to-sky bg-clip-text text-transparent">free forever</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          CheckItApp is built and maintained by a tiny independent team. No paywalls, no accounts, no VC. If the tool has helped you, here's how you can pay it forward.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {WAYS.map((w) => (
            <a key={w.title} href={w.href} target="_blank" rel="noopener noreferrer" className="glass-strong group flex flex-col rounded-2xl p-6 transition hover:bg-white/10">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald to-sky text-background"><w.icon className="h-4 w-4" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{w.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald">{w.cta} →</span>
            </a>
          ))}
        </div>

        <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-rose-400" /> Thank you for being part of this.
        </p>
      </section>
      <Footer />
    </main>
  );
}