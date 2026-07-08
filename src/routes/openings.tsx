import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { OpeningsExplorer } from "@/components/chess/OpeningsExplorer";

export const Route = createFileRoute("/openings")({
  head: () => ({
    meta: [
      { title: "Openings — CheckItApp" },
      {
        name: "description",
        content: "Explore chess openings and gambits, grouped by level and strategic idea. Not memorization — meaning.",
      },
      { property: "og:title", content: "Openings — CheckItApp" },
      { property: "og:description", content: "Explore chess openings and gambits by level and idea." },
    ],
  }),
  component: OpeningsPage,
});

function OpeningsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-8" />
      <OpeningsExplorer />
    </main>
  );
}