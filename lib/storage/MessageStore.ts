import { type CiphertextEnvelope, type ThreadId, type MessageId } from "@/lib/domain/types";

export interface MessageStore {
  put(envelope: CiphertextEnvelope): Promise<MessageId>;
  listByThread(threadId: ThreadId, limit: number, before?: string): Promise<CiphertextEnvelope[]>;
}


