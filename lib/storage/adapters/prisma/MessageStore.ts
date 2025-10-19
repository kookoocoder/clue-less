import { prisma } from "@/lib/db";
import type { MessageStore } from "@/lib/storage/MessageStore";
import type { CiphertextEnvelope, MessageId, ThreadId } from "@/lib/domain/types";
import type { Prisma } from "@prisma/client";

export class PrismaMessageStore implements MessageStore {
  async put(envelope: CiphertextEnvelope): Promise<MessageId> {
    const msg = await prisma.message.create({
      data: {
        id: envelope.messageId,
        threadId: envelope.threadId,
        senderId: envelope.senderId,
        header: envelope.header as Prisma.InputJsonValue,
        ciphertext: envelope.ciphertext,
        nonce: envelope.nonce,
        ephemeral: envelope.ephemeral ?? false,
      },
    });
    return msg.id;
  }

  async listByThread(
    threadId: ThreadId,
    limit: number,
    before?: string
  ): Promise<CiphertextEnvelope[]> {
    const messages = await prisma.message.findMany({
      where: {
        threadId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return messages.map((m) => ({
      threadId: m.threadId,
      messageId: m.id,
      senderId: m.senderId,
      createdAtHash: m.createdAt.toISOString(),
      header: m.header,
      ciphertext: m.ciphertext,
      nonce: m.nonce,
      ephemeral: m.ephemeral,
    }));
  }
}

