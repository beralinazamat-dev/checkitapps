import { motion } from "framer-motion";
import { Crown, Globe2 } from "lucide-react";

// A curated set of city "labs" plotted in equirectangular projection.
const LABS = [
  { city: "San Francisco", lat: 37.77, lon: -122.42 },
  { city: "New York", lat: 40.71, lon: -74.0 },
  { city: "Buenos Aires", lat: -34.6, lon: -58.38 },
  { city: "Reykjavik", lat: 64.13, lon: -21.94 },
  { city: "London", lat: 51.5, lon: -0.12 },
  { city: "Paris", lat: 48.85, lon: 2.35 },
  { city: "Berlin", lat: 52.52, lon: 13.4 },
  { city: "Oslo", lat: 59.91, lon: 10.75 },
  { city: "Moscow", lat: 55.75, lon: 37.61 },
  { city: "Lagos", lat: 6.52, lon: 3.38 },
  { city: "Cape Town", lat: -33.92, lon: 18.42 },
  { city: "Cairo", lat: 30.04, lon: 31.23 },
  { city: "Dubai", lat: 25.2, lon: 55.27 },
  { city: "Mumbai", lat: 19.07, lon: 72.87 },
  { city: "Singapore", lat: 1.35, lon: 103.81 },
  { city: "Tokyo", lat: 35.68, lon: 139.69 },
  { city: "Seoul", lat: 37.56, lon: 126.97 },
  { city: "Sydney", lat: -33.86, lon: 151.2 },
  { city: "Auckland", lat: -36.84, lon: 174.76 },
  { city: "Reykjanes", lat: 63.8, lon: -22.6 },
];

// Coarse equirectangular landmass mask: list of [lon, lat] approximations
// converted into a dot grid. We build dots inline below.
const W = 1000;
const H = 500;

function project(lat: number, lon: number) {
  const x = ((lon + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return { x, y };
}

// Rough continent polygons (very simplified) used as a hit-test mask for the dotted globe.
// Each polygon is in lon/lat. This avoids any external data dependency.
const LAND: number[][][] = [
  // North America
  [
    [-168, 65], [-140, 70], [-95, 80], [-75, 80], [-60, 60], [-55, 50],
    [-65, 45], [-75, 35], [-82, 25], [-97, 17], [-105, 22], [-115, 30],
    [-125, 40], [-130, 55], [-150, 60], [-168, 65],
  ],
  // Central America
  [
    [-92, 17], [-85, 15], [-80, 9], [-77, 8], [-83, 12], [-90, 14], [-92, 17],
  ],
  // South America
  [
    [-80, 12], [-70, 10], [-55, 5], [-50, -5], [-40, -10], [-38, -20],
    [-45, -30], [-55, -40], [-65, -50], [-72, -53], [-75, -45], [-78, -30],
    [-80, -15], [-80, 12],
  ],
  // Europe
  [
    [-10, 36], [0, 38], [10, 36], [18, 40], [28, 41], [40, 45], [50, 50],
    [55, 60], [40, 65], [25, 70], [10, 65], [-5, 58], [-10, 50], [-10, 36],
  ],
  // Africa
  [
    [-17, 14], [-10, 28], [10, 32], [25, 32], [35, 30], [42, 18], [50, 12],
    [50, 0], [42, -12], [38, -22], [28, -32], [18, -35], [10, -25], [0, -10],
    [-10, 0], [-17, 14],
  ],
  // Middle East / West Asia
  [
    [30, 28], [45, 32], [55, 38], [65, 38], [72, 35], [75, 25], [60, 22],
    [50, 22], [40, 22], [30, 28],
  ],
  // Asia (broad)
  [
    [40, 50], [60, 62], [90, 72], [130, 72], [160, 68], [175, 65], [170, 55],
    [150, 45], [140, 38], [122, 30], [108, 22], [100, 14], [95, 18], [85, 22],
    [78, 28], [70, 35], [60, 40], [50, 45], [40, 50],
  ],
  // SE Asia islands (lumped)
  [
    [95, 5], [110, 6], [125, 8], [135, 0], [130, -8], [115, -10], [100, -2], [95, 5],
  ],
  // Australia
  [
    [113, -22], [125, -15], [140, -12], [150, -18], [153, -28], [148, -38],
    [135, -38], [120, -34], [115, -32], [113, -22],
  ],
  // New Zealand
  [
    [170, -40], [175, -38], [178, -42], [173, -46], [168, -45], [170, -40],
  ],
  // Iceland
  [
    [-25, 63], [-15, 64], [-13, 66], [-20, 66], [-25, 63],
  ],
];

function pointInPolygon(px: number, py: number, poly: number[][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]!;
    const [xj, yj] = poly[j]!;
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lon: number, lat: number) {
  return LAND.some((poly) => pointInPolygon(lon, lat, poly));
}

// Pre-compute dot grid once at module load.
const STEP = 4; // degrees between dots
const DOTS: { x: number; y: number }[] = [];
for (let lat = -56; lat <= 78; lat += STEP) {
  for (let lon = -170; lon <= 180; lon += STEP) {
    if (isLand(lon, lat)) {
      const p = project(lat, lon);
      DOTS.push(p);
    }
  }
}

export function WorldFootprint() {
  return (
    <section id="footprint" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5 text-emerald" />
            Our footprint
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            CheckItApp is{" "}
            <span className="text-gradient">everywhere</span> and is making everything to make chess
            more developed.
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            From beginners studying their first opening to grandmasters polishing endgames — a
            growing network of players, coaches, and labs powered by one engine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong relative mt-12 overflow-hidden rounded-3xl p-4 sm:p-8"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
            <defs>
              <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.78 0.16 152)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="oklch(0.78 0.16 152)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="oklch(0.78 0.16 152)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="oklch(0.16 0.018 250)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width={W} height={H} fill="url(#bgGlow)" />

            {/* Land dots */}
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={1.1} fill="oklch(1 0 0 / 0.28)" />
            ))}

            {/* Lab connections (animated arcs between hubs) */}
            {[
              [0, 4], [4, 11], [11, 13], [13, 15], [15, 17],
              [4, 7], [7, 8], [1, 2], [0, 16], [15, 16],
            ].map(([a, b], idx) => {
              const A = project(LABS[a].lat, LABS[a].lon);
              const B = project(LABS[b].lat, LABS[b].lon);
              const midX = (A.x + B.x) / 2;
              const midY = (A.y + B.y) / 2 - Math.abs(B.x - A.x) * 0.15 - 20;
              return (
                <g key={idx}>
                  <path
                    d={`M ${A.x} ${A.y} Q ${midX} ${midY} ${B.x} ${B.y}`}
                    fill="none"
                    stroke="oklch(0.78 0.16 152)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-24"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}

            {/* Lab nodes */}
            {LABS.map((l, i) => {
              const p = project(l.lat, l.lon);
              return (
                <g key={l.city}>
                  <circle cx={p.x} cy={p.y} r={12} fill="url(#pulse)">
                    <animate
                      attributeName="r"
                      values="6;16;6"
                      dur="3s"
                      begin={`${(i * 0.2) % 3}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;0;0.9"
                      dur="3s"
                      begin={`${(i * 0.2) % 3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={p.x} cy={p.y} r={2.4} fill="oklch(0.92 0.12 152)" />
                  <title>{l.city}</title>
                </g>
              );
            })}
          </svg>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: "68", v: "Countries" },
              { k: "24 / 7", v: "Engine uptime" },
              { k: "40k+", v: "Active players / month" },
            ].map((s) => (
              <div
                key={s.v}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="font-display text-2xl font-semibold text-foreground">{s.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-emerald to-sky text-background">
              <Crown className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="text-sm">
              <span className="font-semibold">CheckItApp</span>{" "}
              <span className="text-muted-foreground">· © {new Date().getFullYear()}</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="#analyze">Analyze</a>
            <a className="hover:text-foreground" href="#openings">Openings</a>
            <a className="hover:text-foreground" href="#footprint">Footprint</a>
            <a className="hover:text-foreground" href="#">Privacy</a>
          </div>
        </footer>
      </div>
    </section>
  );
}