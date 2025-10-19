import { NextRequest } from "next/server";
import { PrismaMessageStore } from "@/lib/storage/adapters/prisma/MessageStore";
import type { CiphertextEnvelope } from "@/lib/domain/types";

const messageStore = new PrismaMessageStore();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { threadId, senderId, header, ciphertext, nonce, ephemeral } = body;

  if (!threadId || !senderId || !header || !ciphertext || !nonce) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const envelope: CiphertextEnvelope = {
    threadId,
    messageId: crypto.randomUUID(),
    senderId,
    createdAtHash: new Date().toISOString(),
    header,
    ciphertext,
    nonce,
    ephemeral: ephemeral ?? false,
  };

  const messageId = await messageStore.put(envelope);
  return Response.json({ ok: true, messageId });
}


