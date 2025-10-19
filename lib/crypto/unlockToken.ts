import { prisma } from "@/lib/db";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function mintUnlockToken(deviceId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  await prisma.unlockToken.create({ data: { token, deviceId, expiresAt } });
  return token;
}

export async function verifyUnlockToken(
  token: string,
  deviceId: string
): Promise<boolean> {
  const record = await prisma.unlockToken.findUnique({ where: { token } });
  if (!record) return false;
  if (record.deviceId !== deviceId) return false;
  if (record.expiresAt < new Date()) return false;
  // Single-use: delete after verification
  await prisma.unlockToken.delete({ where: { token } });
  return true;
}

