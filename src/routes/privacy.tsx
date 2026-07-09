import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CheckItApp" },
      { name: "description", content: "How CheckItApp handles data, cookies, and third-party advertising (Google AdSense). Your rights under GDPR and CCPA." },
      { property: "og:title", content: "Privacy Policy — CheckItApp" },
      { property: "og:description", content: "Privacy, cookies, GDPR & CCPA at CheckItApp." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <Section title="1. Introduction">
          <p>CheckItApp ("we", "our", "the Site") is a free chess analysis tool. This Privacy Policy explains what information we collect when you use the Site and how it is handled. By using CheckItApp you agree to the terms below.</p>
        </Section>

        <Section title="2. Information we collect">
          <p>CheckItApp does not require an account and does not ask for personal information. The Site runs almost entirely inside your browser. We may indirectly receive:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong>Usage data</strong> collected by our hosting provider (IP address, browser, referring page, timestamps) for security and abuse prevention.</li>
            <li><strong>Games you import</strong> from Chess.com or Lichess. These requests are made from your browser directly to those services; we do not store the resulting games on our servers.</li>
            <li><strong>Cookies and identifiers</strong> set by third-party advertising partners (see Section 4).</li>
          </ul>
        </Section>

        <Section title="3. How we use information">
          <p>Information is used solely to operate, secure, and improve the Site. We do not sell your personal information.</p>
        </Section>

        <Section title="4. Advertising — Google AdSense">
          <p>The Site displays advertisements delivered by Google AdSense. Google and its partners use cookies and similar technologies to serve ads based on your prior visits to this and other websites.</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits.</li>
            <li>You can opt out of personalized advertising by visiting <a className="text-emerald underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>You can also opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a className="text-emerald underline" href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</li>
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
          </ul>
          <p>For more information, see <a className="text-emerald underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google's Advertising Policies</a>.</p>
        </Section>

        <Section title="5. Cookies">
          <p>Cookies are small text files stored on your device. We use only strictly necessary local storage for user preferences (e.g., last-loaded game). Advertising and analytics cookies are set by Google as described above. You can control cookies through your browser settings.</p>
        </Section>

        <Section title="6. Children's privacy">
          <p>CheckItApp is not directed to children under 13. We do not knowingly collect information from children under 13.</p>
        </Section>

        <Section title="7. Your rights (GDPR / CCPA)">
          <p>If you are located in the EEA, UK, or California, you have the right to access, correct, delete, or restrict processing of your personal information, and to object to processing or request data portability. Because CheckItApp does not maintain user accounts, most requests concern advertising identifiers set by third parties; please use their opt-out tools above, or contact us to escalate.</p>
        </Section>

        <Section title="8. Data security">
          <p>The Site is served over HTTPS. We take reasonable technical measures to protect information, but no online service can be guaranteed 100% secure.</p>
        </Section>

        <Section title="9. Changes">
          <p>We may update this Privacy Policy from time to time. Updates will be posted on this page with a new "Last updated" date.</p>
        </Section>

        <Section title="10. Contact">
          <p>Questions? Reach us via the <a className="text-emerald underline" href="/contact">Contact page</a>.</p>
        </Section>
      </article>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 space-y-3 text-sm leading-relaxed text-foreground/85">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}