import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Mail, Instagram, Music2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CheckItApp" },
      { name: "description", content: "Get in touch with the CheckItApp team — feedback, partnerships, and support." },
      { property: "og:title", content: "Contact — CheckItApp" },
      { property: "og:description", content: "Contact CheckItApp for feedback, partnerships, and support." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Say hello</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have feedback, a bug report, a partnership idea, or just want to chat about chess? We'd love to hear from you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a href="mailto:hello@checkitapp.com" className="glass-strong flex items-start gap-3 rounded-2xl p-5 transition hover:bg-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald to-sky text-background"><Mail className="h-4 w-4" /></span>
            <div>
              <h3 className="font-display font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">hello@checkitapp.com</p>
            </div>
          </a>
          <a href="https://www.instagram.com/checkitapps" target="_blank" rel="noopener noreferrer" className="glass-strong flex items-start gap-3 rounded-2xl p-5 transition hover:bg-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald to-sky text-background"><Instagram className="h-4 w-4" /></span>
            <div>
              <h3 className="font-display font-semibold">Instagram</h3>
              <p className="text-sm text-muted-foreground">@checkitapps</p>
            </div>
          </a>
          <a href="https://www.tiktok.com/@checkitapps" target="_blank" rel="noopener noreferrer" className="glass-strong flex items-start gap-3 rounded-2xl p-5 transition hover:bg-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald to-sky text-background"><Music2 className="h-4 w-4" /></span>
            <div>
              <h3 className="font-display font-semibold">TikTok</h3>
              <p className="text-sm text-muted-foreground">@checkitapps</p>
            </div>
          </a>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">We usually reply within 2–3 business days.</p>
      </section>
      <Footer />
    </main>
  );
}