import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { addConnection, removeConnection } from "../broadcast/route";

const GLOBAL_THREAD_ID = "global-chat-room";

export async function GET(req: NextRequest) {
  // Set up Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Add this connection to the broadcast system
      addConnection(controller);
      
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", message: "Connected to chat" })}\n\n`;
      controller.enqueue(new TextEncoder().encode(data));

      // Set up polling for new messages with faster polling
      let lastMessageId: string | null = null;
      
      const pollForMessages = async () => {
        try {
          const latestMessage = await prisma.message.findFirst({
            where: { threadId: GLOBAL_THREAD_ID },
            orderBy: { createdAt: "desc" },
            include: {
              thread: {
                include: {
                  participants: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          });

          if (latestMessage && latestMessage.id !== lastMessageId) {
            lastMessageId = latestMessage.id;
            
            const participant = latestMessage.thread.participants.find(p => p.userId === latestMessage.senderId);
            const senderHandle = participant?.user.handle || "Unknown";
            
            const formattedMessage = {
              id: latestMessage.id,
              body: latestMessage.ciphertext,
              senderId: latestMessage.senderId,
              senderHandle: senderHandle,
              timestamp: latestMessage.createdAt.getTime(),
              createdAt: latestMessage.createdAt,
            };

            const data = `data: ${JSON.stringify({ type: "message", message: formattedMessage })}\n\n`;
            controller.enqueue(new TextEncoder().encode(data));
          }
        } catch (error) {
          console.error("Error polling for messages:", error);
          const errorData = `data: ${JSON.stringify({ type: "error", message: "Failed to fetch messages" })}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorData));
        }
      };

      // Poll every 1 second for fallback updates
      const interval = setInterval(pollForMessages, 1000);

      // Clean up on close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        removeConnection(controller);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}