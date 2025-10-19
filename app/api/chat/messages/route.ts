import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

const GLOBAL_THREAD_ID = "global-chat-room";

// Import the broadcast function
interface BroadcastMessage {
  id: string;
  body: string;
  senderId: string;
  senderHandle: string;
  timestamp: number;
  createdAt: string;
}

async function broadcastMessage(message: BroadcastMessage) {
  try {
    // Send to all connected clients via Server-Sent Events
    await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error("Error broadcasting message:", error);
  }
}

// GET - Fetch messages from global chat
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before");

    const messages = await prisma.message.findMany({
      where: {
        threadId: GLOBAL_THREAD_ID,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
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

    // Format messages for the client
    const formattedMessages = messages.map((msg) => {
      const participant = msg.thread.participants.find(p => p.userId === msg.senderId);
      const senderHandle = participant?.user.handle || "Unknown";
      
      return {
        id: msg.id,
        body: msg.ciphertext, // For now, we'll store plain text in ciphertext field
        senderId: msg.senderId,
        senderHandle: senderHandle,
        timestamp: msg.createdAt.getTime(),
        createdAt: msg.createdAt,
      };
    });

    return Response.json({ 
      ok: true, 
      messages: formattedMessages.reverse() // Reverse to show oldest first
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({ ok: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST - Send a message to global chat
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return Response.json({ ok: false, error: "Message and userId are required" }, { status: 400 });
    }

    // Handle traditional login system user IDs
    let actualUserId = userId;
    let userHandle = "Unknown";
    
    if (userId === "user_gwen") {
      // Check if gwen user exists, if not create it
      let gwenUser = await prisma.user.findUnique({ where: { handle: "gwen" } });
      if (!gwenUser) {
        gwenUser = await prisma.user.create({ data: { handle: "gwen" } });
      }
      actualUserId = gwenUser.id;
      userHandle = "gwen";
    } else if (userId === "user_spiderman") {
      // Check if spiderman user exists, if not create it
      let spidermanUser = await prisma.user.findUnique({ where: { handle: "spiderman" } });
      if (!spidermanUser) {
        spidermanUser = await prisma.user.create({ data: { handle: "spiderman" } });
      }
      actualUserId = spidermanUser.id;
      userHandle = "spiderman";
    } else {
      // For WebAuthn users, get the handle from the database
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        userHandle = user.handle;
      }
    }

    // Get or create global thread
    let globalThread = await prisma.thread.findUnique({
      where: { id: GLOBAL_THREAD_ID },
      include: {
        participants: true,
      },
    });

    if (!globalThread) {
      globalThread = await prisma.thread.create({
        data: { id: GLOBAL_THREAD_ID },
        include: {
          participants: true,
        },
      });
    }

    // Add user to thread participants if not already there
    const isParticipant = globalThread.participants.some(p => p.userId === actualUserId);
    if (!isParticipant) {
      await prisma.threadParticipant.create({
        data: {
          threadId: GLOBAL_THREAD_ID,
          userId: actualUserId,
        },
      });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        threadId: GLOBAL_THREAD_ID,
        senderId: actualUserId,
        header: {}, // Empty header for now
        ciphertext: message, // Store plain text for now
        nonce: crypto.randomUUID(), // Random nonce for now
        ephemeral: false,
      },
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

    // Format the response
    const formattedMessage = {
      id: newMessage.id,
      body: newMessage.ciphertext,
      senderId: newMessage.senderId,
      senderHandle: userHandle,
      timestamp: newMessage.createdAt.getTime(),
      createdAt: newMessage.createdAt.toISOString(),
    };

    // Broadcast the message to all connected clients
    await broadcastMessage(formattedMessage);

    return Response.json({ 
      ok: true, 
      message: formattedMessage 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ ok: false, error: "Failed to send message" }, { status: 500 });
  }
}