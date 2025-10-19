import { prisma } from "@/lib/db";

const GLOBAL_THREAD_ID = "global-chat-room";

export async function GET() {
  try {
    // Get or create the global thread
    let globalThread = await prisma.thread.findUnique({
      where: { id: GLOBAL_THREAD_ID },
    });

    if (!globalThread) {
      globalThread = await prisma.thread.create({
        data: { id: GLOBAL_THREAD_ID },
      });
    }

    return Response.json({ 
      ok: true, 
      threadId: globalThread.id,
      createdAt: globalThread.createdAt 
    });
  } catch (error) {
    console.error("Error getting global thread:", error);
    return Response.json({ ok: false, error: "Failed to get global thread" }, { status: 500 });
  }
}