import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GameImporter } from "@/components/chess/GameImporter";
import { LiveBoardShowcase } from "@/components/chess/LiveBoardShowcase";
import type { ImportedGame } from "@/lib/game-fetcher";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyzer — CheckItApp" },
      {
        name: "description",
        content: "Full-screen Stockfish 16 NNUE analyzer with best-move arrows, real move classification and an optional AI coach.",
      },
      { property: "og:title", content: "Analyzer — CheckItApp" },
      { property: "og:description", content: "Full-screen Stockfish 16 NNUE analyzer with best-move arrows." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [game, setGame] = useState<ImportedGame | null>(null);
  return (
    <main className="min-h-screen">
      <Toaster theme="dark" position="top-center" />
      <Navbar />
      <div className="pt-8" />
      <GameImporter onGameSelected={setGame} />
      <LiveBoardShowcase game={game} />
      <Footer />
    </main>
  );
}