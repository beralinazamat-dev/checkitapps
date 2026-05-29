import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { GameImporter } from "@/components/chess/GameImporter";
import { LiveBoardShowcase } from "@/components/chess/LiveBoardShowcase";
import { OpeningsExplorer } from "@/components/chess/OpeningsExplorer";
import { WorldFootprint } from "@/components/site/WorldFootprint";
import type { ImportedGame } from "@/lib/game-fetcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChessLab Analyzer — Understand every move you play" },
      {
        name: "description",
        content:
          "Modern AI chess analysis. Import any Chess.com or Lichess game, get Stockfish evaluations, classified annotations, and a personal AI coach.",
      },
      { property: "og:title", content: "ChessLab Analyzer" },
      {
        property: "og:description",
        content:
          "Stockfish-powered analysis, move-by-move annotations, and AI explanations for every level.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedGame, setSelectedGame] = useState<ImportedGame | null>(null);

  return (
    <main className="min-h-screen">
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.205 0.022 252)",
            color: "oklch(0.97 0.01 250)",
            border: "1px solid oklch(1 0 0 / 0.1)",
          },
        }}
      />
      <Navbar />
      <Hero />
      <GameImporter onGameSelected={setSelectedGame} />
      <LiveBoardShowcase game={selectedGame} />
      <OpeningsExplorer />
      <WorldFootprint />
    </main>
  );
}
