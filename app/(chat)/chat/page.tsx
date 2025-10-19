"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInactivityLock } from "@/hooks/useInactivityLock";
import SessionLock from "@/components/SessionLock";

interface Message {
  id: string;
  body: string;
  senderId: string;
  senderHandle: string;
  timestamp: number;
  createdAt: string;
  isSent?: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  const { isLocked } = useInactivityLock({
    timeout: 5 * 60 * 1000, // 5 minutes
    onLock: () => {
      console.log("Session locked due to inactivity");
    },
  });

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/messages?limit=50");
      const data = await response.json();
      
      if (data.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupEventSource = useCallback(() => {
    const eventSource = new EventSource("/api/chat/events");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("Connected to chat events");
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "message") {
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === data.message.id);
            if (exists) return prev;
            
            // Remove any temporary messages with the same content from the same user
            const filtered = prev.filter(msg => 
              !(msg.id.startsWith('temp_') && 
                msg.body === data.message.body && 
                msg.senderId === data.message.senderId)
            );
            
            return [...filtered, data.message];
          });
        } else if (data.type === "connected") {
          console.log("Connected to chat:", data.message);
        }
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      setIsConnected(false);
      
      // Retry connection after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          setupEventSource();
        }
      }, 3000);
    };
  }, []);

  useEffect(() => {
    // Check if user is authenticated and unlocked
    const userId = localStorage.getItem("userId");
    const unlocked = localStorage.getItem("unlocked");
    
    if (!userId) {
      router.push("/login");
      return;
    }
    
    if (!unlocked) {
      router.push("/gate");
      return;
    }

    // Load initial messages
    loadMessages();
    
    // Set up real-time connection
    setupEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [router, loadMessages, setupEventSource]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const messageText = input.trim();
    setInput("");

    // Optimistic update - add message immediately to UI
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      body: messageText,
      senderId: userId,
      senderHandle: "You", // Will be updated when real message arrives
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      isSent: true,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          userId: userId,
        }),
      });

      const data = await response.json();
      
      if (!data.ok) {
        console.error("Error sending message:", data.error);
        // Remove the optimistic message and re-add to input
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        setInput(messageText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the optimistic message and re-add to input
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setInput(messageText);
    }
  }

  function handleUnlock() {
    router.push("/gate");
  }

  function handleLogout() {
    localStorage.clear();
    router.push("/login");
  }

  if (isLocked) {
    return <SessionLock onUnlock={handleUnlock} />;
  }

  if (isLoading) {
    return (
      <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading chat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 grid place-items-center font-bold">
              C
            </div>
            <div>
              <h1 className="font-semibold">CipherTalk Global</h1>
              <p className="text-xs text-gray-500">Global chat room</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-mono ${
              isConnected 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              <span className="relative flex h-2 w-2 inline-block mr-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${
                  isConnected ? "bg-emerald-400" : "bg-red-400"
                } ${isConnected ? "animate-ping" : ""} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? "bg-emerald-500" : "bg-red-500"
                }`}></span>
              </span>
              {isConnected ? "CONNECTED" : "DISCONNECTED"}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full grid place-items-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="text-6xl">💬</div>
              <h2 className="text-2xl font-semibold text-gray-400">
                Welcome to Global Chat
              </h2>
              <p className="text-sm text-gray-600">
                Start chatting with other users in real-time!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
        <div className="container mx-auto max-w-4xl flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
          >
            <span>Send</span>
            <span>🔒</span>
          </button>
        </div>
      </div>
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const currentUserId = localStorage.getItem("userId");
  const isMe = message.senderId === currentUserId;
  
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-md ${isMe ? "ml-12" : "mr-12"}`}>
        {!isMe && (
          <div className="text-xs text-gray-500 mb-1 px-2">
            {message.senderHandle}
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isMe
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-br-sm"
              : "bg-gray-800 text-gray-100 rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.body}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isMe && (
              <span className="text-xs opacity-70">
                ✓✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
