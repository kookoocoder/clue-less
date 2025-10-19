import { NextRequest } from "next/server";
import { PrismaMessageStore } from "@/lib/storage/adapters/prisma/MessageStore";

const messageStore = new PrismaMessageStore();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { threadId, limit = 50, before } = body;

  if (!threadId) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const messages = await messageStore.listByThread(threadId, limit, before);
  return Response.json({ ok: true, messages });
}


