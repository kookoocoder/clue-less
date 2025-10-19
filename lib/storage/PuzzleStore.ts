export interface PuzzleSeedRecord {
  id: string;
  fen: string;
  target: string;
  difficulty: number;
}

export interface PuzzleStore {
  getRandomByDifficulty(difficulty: number): Promise<PuzzleSeedRecord | null>;
}


