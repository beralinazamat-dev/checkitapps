import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SocialSection } from "@/components/site/SocialSection";

export const Route = createFileRoute("/social")({
  head: () => ({
    meta: [
      { title: "Social — CheckItApp (@checkitapps)" },
      {
        name: "description",
        content: "Follow CheckItApp on TikTok and Instagram — @checkitapps — for daily tactics, opening trivia and product updates.",
      },
      { property: "og:title", content: "Social — CheckItApp (@checkitapps)" },
      { property: "og:description", content: "Follow @checkitapps on TikTok and Instagram." },
    ],
  }),
  component: SocialPage,
});

function SocialPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-6" />
      <SocialSection />
      <Footer />
    </main>
  );
}