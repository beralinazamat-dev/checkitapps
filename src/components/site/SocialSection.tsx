import { motion } from "framer-motion";
import { Instagram, Music2, ExternalLink } from "lucide-react";

const LINKS = [
  {
    name: "TikTok",
    handle: "@checkitapps",
    url: "https://www.tiktok.com/@checkitapps",
    icon: Music2,
    accent: "from-rose to-sky",
    desc: "Short-form breakdowns of famous games, tactical puzzles and daily brilliancies.",
  },
  {
    name: "Instagram",
    handle: "@checkitapps",
    url: "https://www.instagram.com/checkitapps",
    icon: Instagram,
    accent: "from-amber to-rose",
    desc: "Position of the day, coach tips, product updates and community highlights.",
  },
];

export function SocialSection() {
  return (
    <section id="social" className="relative py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-emerald">Our social media</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
            Follow <span className="text-gradient">@checkitapps</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            One handle everywhere. Tap in for daily tactics, opening trivia, and
            behind-the-scenes updates from the CheckItApp lab.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {LINKS.map((l) => (
            <motion.a
              key={l.name}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="glass-strong group flex flex-col gap-4 rounded-3xl p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${l.accent} text-background ring-glow`}
                >
                  <l.icon className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div>
                  <div className="font-display text-lg font-semibold">{l.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{l.handle}</div>
                </div>
                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
              </div>
              <p className="text-sm text-foreground/85">{l.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}