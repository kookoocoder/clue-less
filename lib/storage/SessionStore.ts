export interface SessionRecord {
  id: string;
  deviceId: string;
  expiresAt: number;
}

export interface SessionStore {
  createOrRefresh(deviceId: string, ttlMs: number): Promise<SessionRecord>;
  revokeByDevice(deviceId: string): Promise<void>;
  isValid(deviceId: string): Promise<boolean>;
}


