export interface TrustEventRecord {
  id: string;
  userId: string;
  type: string;
  value: number;
  createdAt: number;
}

export interface TrustStore {
  append(userId: string, type: string, value: number): Promise<void>;
  getRecentScore(userId: string, windowMs: number): Promise<number>;
}

