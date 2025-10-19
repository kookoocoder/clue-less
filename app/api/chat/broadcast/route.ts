import { NextRequest } from "next/server";

// Store active connections for broadcasting
const activeConnections = new Set<ReadableStreamDefaultController>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return Response.json({ ok: false, error: "Message is required" }, { status: 400 });
    }

    // Broadcast to all connected clients
    const data = `data: ${JSON.stringify({ type: "message", message })}\n\n`;
    const encoded = new TextEncoder().encode(data);
    
    let successCount = 0;
    activeConnections.forEach(controller => {
      try {
        controller.enqueue(encoded);
        successCount++;
      } catch {
        // Remove dead connections
        activeConnections.delete(controller);
      }
    });

    return Response.json({ 
      ok: true, 
      broadcasted: successCount,
      totalConnections: activeConnections.size 
    });
  } catch (error) {
    console.error("Error broadcasting message:", error);
    return Response.json({ ok: false, error: "Failed to broadcast message" }, { status: 500 });
  }
}

// Store connection for broadcasting
export function addConnection(controller: ReadableStreamDefaultController) {
  activeConnections.add(controller);
}

export function removeConnection(controller: ReadableStreamDefaultController) {
  activeConnections.delete(controller);
}