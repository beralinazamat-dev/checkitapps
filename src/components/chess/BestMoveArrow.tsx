// SVG overlay that draws an arrow from `from` -> `to` on the chessboard,
// used to show Stockfish's best move recommendation.
import type { Square } from "chess.js";

interface Props {
  from: Square;
  to: Square;
  orientation: "white" | "black";
  color?: string;
}

function squareToCenter(sq: Square, orientation: "white" | "black") {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1]!, 10) - 1;
  const col = orientation === "white" ? file : 7 - file;
  const row = orientation === "white" ? 7 - rank : rank;
  return { x: (col + 0.5) * 12.5, y: (row + 0.5) * 12.5 };
}

export function BestMoveArrow({ from, to, orientation, color = "#34d399" }: Props) {
  const a = squareToCenter(from, orientation);
  const b = squareToCenter(to, orientation);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <marker
          id="bmhead"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        markerEnd="url(#bmhead)"
        opacity={0.9}
      />
    </svg>
  );
}