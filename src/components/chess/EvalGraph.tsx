import type { AnnotatedMove } from "@/lib/sample-game";

export function EvalGraph({
  moves,
  currentPly,
  onSelect,
}: {
  moves: AnnotatedMove[];
  currentPly: number;
  onSelect: (ply: number) => void;
}) {
  const W = 600;
  const H = 120;
  const pad = 4;

  const norm = (cp: number) => {
    const c = Math.max(-1000, Math.min(1000, cp));
    return 2 / (1 + Math.exp(-c / 350)) - 1; // -1..1
  };

  const stepX = (W - pad * 2) / Math.max(1, moves.length - 1);
  const yOf = (v: number) => H / 2 - v * (H / 2 - pad);

  const points = moves
    .map((m, i) => `${pad + i * stepX},${yOf(norm(m.evalCp))}`)
    .join(" ");
  const area = `M${pad},${H / 2} L${points} L${pad + (moves.length - 1) * stepX},${H / 2} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.16 152)" stopOpacity="0.55" />
          <stop offset="50%" stopColor="oklch(0.78 0.16 152)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="oklch(0.7 0.21 22)" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <line
        x1={pad}
        x2={W - pad}
        y1={H / 2}
        y2={H / 2}
        stroke="oklch(1 0 0 / 0.15)"
        strokeDasharray="4 4"
      />
      <path d={area} fill="url(#evalGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="oklch(0.97 0.01 250)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {moves.map((m, i) => {
        const cx = pad + i * stepX;
        const cy = yOf(norm(m.evalCp));
        const isCurrent = m.ply === currentPly;
        return (
          <g key={m.ply} onClick={() => onSelect(m.ply)} className="cursor-pointer">
            <rect x={cx - stepX / 2} y={0} width={stepX} height={H} fill="transparent" />
            {isCurrent && (
              <circle cx={cx} cy={cy} r={6} fill="oklch(0.82 0.17 80)" opacity={0.25} />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={isCurrent ? 3.5 : 2}
              fill={isCurrent ? "oklch(0.82 0.17 80)" : "oklch(0.97 0.01 250)"}
            />
          </g>
        );
      })}
    </svg>
  );
}