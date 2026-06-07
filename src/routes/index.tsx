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
      { title: "CheckItApp — Chess Game Analysis Tool" },
      {
        name: "description",
        content:
          "Import any Chess.com or Lichess game and get deep Stockfish analysis: evaluations, best moves, principal variations, and an AI coach.",
      },
      { name: "keywords", content: "checkitapp, chesslab, chess, stockfish analysis, chess engine, chess.com analysis, lichess analysis, game review" },
      { property: "og:title", content: "CheckItApp — Chess Game Analysis Tool" },
      {
        property: "og:description",
        content:
          "Stockfish-powered analysis, move-by-move annotations, and AI explanations for every level.",
      },
      { property: "og:url", content: "https://chesslab-analyzer.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://chesslab-analyzer.lovable.app/" }],
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
