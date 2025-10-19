import { prisma } from "@/lib/db";
import type { TrustStore } from "@/lib/storage/TrustStore";

export class PrismaTrustStore implements TrustStore {
  async append(userId: string, type: string, value: number): Promise<void> {
    await prisma.trustEvent.create({ data: { userId, type, value } });
  }

  async getRecentScore(userId: string, windowMs: number): Promise<number> {
    const since = new Date(Date.now() - windowMs);
    const events = await prisma.trustEvent.findMany({
      where: { userId, createdAt: { gte: since } },
    });
    return events.reduce((sum, e) => sum + e.value, 0);
  }
}

