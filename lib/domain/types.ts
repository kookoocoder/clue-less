export type ThreadId = string;
export type MessageId = string;
export type DeviceId = string;

export interface CiphertextEnvelope {
  threadId: ThreadId;
  messageId: MessageId;
  senderId: string;
  createdAtHash: string;
  header: unknown;
  ciphertext: string;
  nonce: string;
  attachmentRefs?: Array<{ id: string; size: number }>;
  ephemeral?: boolean;
}

export type PuzzleKind = "chess" | "logic" | "pattern";

export interface PuzzleSeed {
  id: string;
  kind: PuzzleKind;
  spec: unknown;
  nonce: string;
  expiresAt: number;
}

export interface UnlockToken {
  token: string;
  deviceId: DeviceId;
  issuedAt: number;
  expiresAt: number;
  scopes: Array<"chat">;
}


