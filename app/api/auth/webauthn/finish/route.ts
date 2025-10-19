import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { PrismaSessionStore } from "@/lib/storage/adapters/prisma/SessionStore";

const sessionStore = new PrismaSessionStore();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { handle, credentialId } = body;

  if (!handle || !credentialId) {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Upsert user
  const user = await prisma.user.upsert({
    where: { handle },
    create: { handle },
    update: {},
  });

  // Enforce single device: check if device exists for this user
  const existingDevice = await prisma.userDevice.findUnique({
    where: { userId: user.id },
  });

  let device;
  if (existingDevice) {
    // Update credential if changed
    device = await prisma.userDevice.update({
      where: { id: existingDevice.id },
      data: { credentialId },
    });
  } else {
    // Create new device
    device = await prisma.userDevice.create({
      data: { userId: user.id, credentialId },
    });
  }

  // Create session with 1-hour TTL
  await sessionStore.createOrRefresh(device.id, 60 * 60 * 1000);

  return Response.json({ ok: true, deviceId: device.id, userId: user.id });
}


