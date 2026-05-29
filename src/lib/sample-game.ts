// Morphy vs Duke of Brunswick & Count Isouard, Paris Opera, 1858.
// Hand-annotated for the ChessLab Analyzer showcase.

export type Annotation =
  | "brilliant"
  | "great"
  | "best"
  | "excellent"
  | "good"
  | "book"
  | "inaccuracy"
  | "mistake"
  | "miss"
  | "blunder";

export interface AnnotatedMove {
  ply: number;
  san: string;
  side: "w" | "b";
  annotation: Annotation;
  evalCp: number; // centipawns from white's POV. Mate = ±10000.
  coach: string;
}

export const SAMPLE_GAME = {
  white: "Paul Morphy",
  black: "Duke Karl / Count Isouard",
  event: "Paris Opera, 1858",
  opening: "Philidor Defense",
  result: "1-0",
  moves: [
    { ply: 1, san: "e4", side: "w", annotation: "book", evalCp: 30,
      coach: "Morphy claims the center and frees the bishop and queen — the most principled opening move." },
    { ply: 2, san: "e5", side: "b", annotation: "book", evalCp: 25,
      coach: "Black mirrors and contests the center symmetrically." },
    { ply: 3, san: "Nf3", side: "w", annotation: "book", evalCp: 30,
      coach: "Develop a piece while attacking the e5 pawn — pure opening principles." },
    { ply: 4, san: "d6", side: "b", annotation: "book", evalCp: 40,
      coach: "The Philidor Defense. Solid, but it concedes space and the bishop's diagonal." },
    { ply: 5, san: "d4", side: "w", annotation: "best", evalCp: 55,
      coach: "Morphy strikes immediately in the center to open lines before Black is developed." },
    { ply: 6, san: "Bg4", side: "b", annotation: "inaccuracy", evalCp: 110,
      coach: "Premature pin. The bishop will be chased and exchanged, losing time and giving White the bishop pair." },
    { ply: 7, san: "dxe5", side: "w", annotation: "great", evalCp: 160,
      coach: "Tactical refutation: if Black recaptures with the bishop, Nxe5 wins material." },
    { ply: 8, san: "Bxf3", side: "b", annotation: "mistake", evalCp: 240,
      coach: "Forced choice but it just hands over the bishop pair on a clear board." },
    { ply: 9, san: "Qxf3", side: "w", annotation: "best", evalCp: 230,
      coach: "Recapture and centralize. The queen now eyes f7 — the most vulnerable square in the opening." },
    { ply: 10, san: "dxe5", side: "b", annotation: "good", evalCp: 220,
      coach: "Regain the pawn. Material is level, but Morphy has development and the bishop pair." },
    { ply: 11, san: "Bc4", side: "w", annotation: "great", evalCp: 260,
      coach: "Train the bishop directly at f7. Every developed piece now points at the black king." },
    { ply: 12, san: "Nf6", side: "b", annotation: "inaccuracy", evalCp: 360,
      coach: "Natural but slow. Qe7 was sturdier; Black urgently needs to defend f7 and finish development." },
    { ply: 13, san: "Qb3", side: "w", annotation: "excellent", evalCp: 410,
      coach: "Double attack on b7 and f7. Two threats — Black can only address one." },
    { ply: 14, san: "Qe7", side: "b", annotation: "best", evalCp: 420,
      coach: "The only move that holds material together by defending f7 with the queen." },
    { ply: 15, san: "Nc3", side: "w", annotation: "brilliant", evalCp: 460,
      coach: "A stunning quiet move — Morphy refuses the b7 pawn to keep every piece pouring into the attack." },
    { ply: 16, san: "c6", side: "b", annotation: "mistake", evalCp: 640,
      coach: "Defends b7 but blocks the knight's natural square. The kingside falls further behind." },
    { ply: 17, san: "Bg5", side: "w", annotation: "great", evalCp: 720,
      coach: "Develop with tempo, pinning the knight on f6 against the queen. Every piece is now active." },
    { ply: 18, san: "b5", side: "b", annotation: "blunder", evalCp: 1500,
      coach: "Desperate. This loses by force — the knight on c3 sacrifices itself to rip open the position." },
    { ply: 19, san: "Nxb5", side: "w", annotation: "brilliant", evalCp: 1600,
      coach: "A piece sacrifice to blast open the c-file and the long diagonal toward the black king." },
    { ply: 20, san: "cxb5", side: "b", annotation: "miss", evalCp: 1700,
      coach: "Accepting was forced, but now the c-file is wide open for the rooks to come." },
    { ply: 21, san: "Bxb5+", side: "w", annotation: "best", evalCp: 1800,
      coach: "Check! The bishop joins the attack with tempo and pins the knight that will appear on d7." },
    { ply: 22, san: "Nbd7", side: "b", annotation: "best", evalCp: 1900,
      coach: "The only legal block — but it places another piece on a pinned, defenseless square." },
    { ply: 23, san: "O-O-O", side: "w", annotation: "great", evalCp: 2200,
      coach: "Castles long with check on the pinned knight. Develops the rook directly into the attack." },
    { ply: 24, san: "Rd8", side: "b", annotation: "best", evalCp: 2400,
      coach: "Adds a defender to d7. Black is doing the only moves but the attack is already overwhelming." },
    { ply: 25, san: "Rxd7", side: "w", annotation: "brilliant", evalCp: 2800,
      coach: "Exchange sacrifice! Removes the most important defender and clears the path to the king." },
    { ply: 26, san: "Rxd7", side: "b", annotation: "best", evalCp: 2900,
      coach: "Forced recapture — but Black's pieces are now tangled and the king has no shelter." },
    { ply: 27, san: "Rd1", side: "w", annotation: "great", evalCp: 3500,
      coach: "Quiet but devastating. Doubles on the d-file and prepares the final combination." },
    { ply: 28, san: "Qe6", side: "b", annotation: "miss", evalCp: 9999,
      coach: "Tries to free the queen, but there is no defense — mate is now forced in three." },
    { ply: 29, san: "Bxd7+", side: "w", annotation: "best", evalCp: 9999,
      coach: "Remove the last defender with check. Every Morphy piece is doing maximum work." },
    { ply: 30, san: "Nxd7", side: "b", annotation: "best", evalCp: 9999,
      coach: "The only legal reply — and it walks into the immortal finish." },
    { ply: 31, san: "Qb8+", side: "w", annotation: "brilliant", evalCp: 9999,
      coach: "Queen sacrifice! The decoy forces the knight to abandon the back rank." },
    { ply: 32, san: "Nxb8", side: "b", annotation: "best", evalCp: 9999,
      coach: "Forced. The knight is dragged off d7 — and the d-file becomes a highway." },
    { ply: 33, san: "Rd8#", side: "w", annotation: "brilliant", evalCp: 10000,
      coach: "Checkmate. A textbook smothered finish — the Opera Game, immortalized." },
  ] satisfies AnnotatedMove[],
};