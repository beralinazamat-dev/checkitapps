import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — CheckItApp" },
      { name: "description", content: "The terms under which you may use CheckItApp, a free chess analysis tool." },
      { property: "og:title", content: "Terms of Service — CheckItApp" },
      { property: "og:description", content: "Terms of Service for CheckItApp." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <S title="1. Acceptance">By accessing or using CheckItApp you agree to be bound by these Terms. If you do not agree, do not use the Site.</S>
        <S title="2. The service">CheckItApp is a free chess analysis tool that lets you import games from public services (Chess.com, Lichess) and analyze them with the Stockfish engine running in your browser.</S>
        <S title="3. Acceptable use">You agree not to (a) use the Site for unlawful purposes, (b) attempt to disrupt or reverse-engineer the Site, (c) scrape or overload third-party services through it, or (d) misuse it to violate the terms of Chess.com, Lichess, or any other third party.</S>
        <S title="4. Third-party services">CheckItApp interacts with Chess.com and Lichess public APIs and displays ads via Google AdSense. Your use of those services is governed by their own terms and privacy policies.</S>
        <S title="5. Intellectual property">The CheckItApp name, logo, and site design are owned by us. Stockfish is licensed under the GPL. Chess games belong to their players.</S>
        <S title="6. Disclaimer">The Site is provided "as is" and "as available" without warranties of any kind. Analysis output is informational and may contain errors.</S>
        <S title="7. Limitation of liability">To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Site.</S>
        <S title="8. Changes">We may update these Terms at any time. Continued use of the Site after changes constitutes acceptance.</S>
        <S title="9. Contact">For questions, use the Contact page.</S>
      </article>
      <Footer />
    </main>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 space-y-3 text-sm leading-relaxed text-foreground/85">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <p>{children}</p>
    </section>
  );
}