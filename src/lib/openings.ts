export type OpeningLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Opening {
  name: string;
  eco: string;
  level: OpeningLevel;
  moves: string;
  color: "White" | "Black" | "Both";
  purpose: string;
  style: string;
}

export const OPENINGS: Opening[] = [
  {
    name: "Italian Game",
    eco: "C50",
    level: "Beginner",
    color: "White",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    style: "Classical • Open",
    purpose:
      "Develop quickly and aim the bishop at the weakest square in Black's camp — f7. The plan is fast development, central control, and early kingside pressure that beginners can immediately understand.",
  },
  {
    name: "Scandinavian Defense",
    eco: "B01",
    level: "Beginner",
    color: "Black",
    moves: "1. e4 d5",
    style: "Direct • Easy plans",
    purpose:
      "Challenge the center on move one and bypass huge amounts of theory. A perfect first defense for Black — clear development and a reliable structure on almost every move.",
  },
  {
    name: "London System",
    eco: "D02",
    level: "Beginner",
    color: "White",
    moves: "1. d4 d5 2. Nf3 Nf6 3. Bf4",
    style: "System • Solid",
    purpose:
      "A pre-planned setup you can play against almost anything. The goal is to reach a safe, harmonious position with the bishop outside the pawn chain — ideal for players who want structure over memorization.",
  },
  {
    name: "Queen's Gambit",
    eco: "D06",
    level: "Intermediate",
    color: "White",
    moves: "1. d4 d5 2. c4",
    style: "Classical • Strategic",
    purpose:
      "Offer a wing pawn to deflect Black's central pawn and dominate the center. Not a true sacrifice — White almost always recovers the pawn while building a long-term spatial advantage.",
  },
  {
    name: "Sicilian Defense",
    eco: "B20",
    level: "Intermediate",
    color: "Black",
    moves: "1. e4 c5",
    style: "Asymmetric • Fighting",
    purpose:
      "Refuse symmetry and play for the win as Black. The c-pawn fights for d4 from the side, creating unbalanced positions where Black plays for active counterplay rather than equality.",
  },
  {
    name: "Caro-Kann Defense",
    eco: "B10",
    level: "Intermediate",
    color: "Black",
    moves: "1. e4 c6",
    style: "Solid • Structural",
    purpose:
      "Prepare ...d5 with full pawn support, avoiding the weaknesses of the French. The reward is a sound structure and an unblocked light-squared bishop — strategic, mature chess.",
  },
  {
    name: "King's Indian Defense",
    eco: "E60",
    level: "Advanced",
    color: "Black",
    moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7",
    style: "Hypermodern • Dynamic",
    purpose:
      "Let White build a big center, then attack it with pieces and a delayed ...e5 break. A complete fighting weapon that aims for a kingside attack while White expands on the queenside.",
  },
  {
    name: "Nimzo-Indian Defense",
    eco: "E20",
    level: "Advanced",
    color: "Black",
    moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4",
    style: "Strategic • Pin-based",
    purpose:
      "Pin the knight on c3 and threaten to double White's pawns, fighting for the dark squares without committing the d-pawn. A perfect modern opening for players who love long-term structural concepts.",
  },
  {
    name: "Evans Gambit",
    eco: "C51",
    level: "Advanced",
    color: "White",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4",
    style: "Romantic • Sacrificial",
    purpose:
      "Sacrifice a wing pawn for a powerful central pawn duo and rapid development. The point: open lines, gain tempo on Black's bishop, and ignite an attack before Black completes development.",
  },
  {
    name: "King's Gambit",
    eco: "C30",
    level: "Advanced",
    color: "White",
    moves: "1. e4 e5 2. f4",
    style: "Romantic • Open lines",
    purpose:
      "Offer the f-pawn to dominate the center and open the f-file for an early attack. The most famous attacking opening in chess history — pure initiative in exchange for king safety.",
  },
];