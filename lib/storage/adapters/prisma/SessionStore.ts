import { prisma } from "@/lib/db";
import type { SessionStore, SessionRecord } from "@/lib/storage/SessionStore";

export class PrismaSessionStore implements SessionStore {
  async createOrRefresh(deviceId: string, ttlMs: number): Promise<SessionRecord> {
    const expiresAt = new Date(Date.now() + ttlMs);
    const session = await prisma.session.upsert({
      where: { deviceId },
      create: { deviceId, expiresAt },
      update: { expiresAt },
    });
    return {
      id: session.id,
      deviceId: session.deviceId,
      expiresAt: session.expiresAt.getTime(),
    };
  }

  async revokeByDevice(deviceId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { deviceId } });
  }

  async isValid(deviceId: string): Promise<boolean> {
    const session = await prisma.session.findUnique({ where: { deviceId } });
    if (!session) return false;
    return session.expiresAt > new Date();
  }
}

