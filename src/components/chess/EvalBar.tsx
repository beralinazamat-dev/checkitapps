export function EvalBar({ evalCp }: { evalCp: number }) {
  // Convert centipawns to a 0-100 white-perspective percent using a soft sigmoid.
  const clamped = Math.max(-1000, Math.min(1000, evalCp));
  const pct = 50 + 50 * (2 / (1 + Math.exp(-clamped / 350)) - 1);
  const whitePct = Math.min(96, Math.max(4, pct));

  const display =
    Math.abs(evalCp) >= 9000
      ? evalCp > 0
        ? "M"
        : "-M"
      : (evalCp / 100).toFixed(1);

  return (
    <div className="relative flex h-full w-7 flex-col overflow-hidden rounded-lg border border-glass-border bg-[#1a1a1f]">
      <div
        className="absolute inset-x-0 top-0 bg-[#f5f5f0] transition-[height] duration-500 ease-out"
        style={{ height: `${100 - whitePct}%` }}
      />
      <div
        className="absolute inset-x-0 bottom-0 bg-[#1a1a1f] transition-[height] duration-500 ease-out"
        style={{ height: `${whitePct}%` }}
      />
      <div className="absolute inset-x-0 top-1/2 h-px bg-emerald/40" />
      <span
        className={`absolute inset-x-0 text-center font-mono text-[10px] font-semibold ${
          evalCp >= 0 ? "bottom-1 text-[#1a1a1f]" : "top-1 text-[#f5f5f0]"
        }`}
        style={evalCp >= 0 ? { color: "#1a1a1f" } : { color: "#f5f5f0" }}
      >
        {display}
      </span>
    </div>
  );
}