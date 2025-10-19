import { prisma } from "@/lib/db";
import type { PuzzleStore, PuzzleSeedRecord } from "@/lib/storage/PuzzleStore";

export class PrismaPuzzleStore implements PuzzleStore {
  async getRandomByDifficulty(difficulty: number): Promise<PuzzleSeedRecord | null> {
    const count = await prisma.puzzle.count({ where: { difficulty } });
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const puzzle = await prisma.puzzle.findFirst({
      where: { difficulty },
      skip,
    });
    if (!puzzle) return null;
    return {
      id: puzzle.id,
      fen: puzzle.fen,
      target: puzzle.target,
      difficulty: puzzle.difficulty,
    };
  }
}

