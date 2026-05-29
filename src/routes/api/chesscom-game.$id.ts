import { createFileRoute } from "@tanstack/react-router";
import { chessComCallbackToGame } from "@/lib/game-fetcher";

export const Route = createFileRoute("/api/chesscom-game/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        if (!/^\d{4,}$/.test(id)) return new Response("Invalid Chess.com game id.", { status: 400 });

        const response = await fetch(`https://www.chess.com/callback/live/game/${encodeURIComponent(id)}`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "ChessLab Analyzer",
          },
        });

        if (!response.ok) return new Response("Chess.com game not found.", { status: response.status });

        const payload = await response.json();
        return Response.json(chessComCallbackToGame(payload));
      },
    },
  },
});