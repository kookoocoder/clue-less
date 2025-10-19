"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInactivityLock } from "@/hooks/useInactivityLock";
import SessionLock from "@/components/SessionLock";

interface Message {
  id: string;
  body: string;
  senderId: string;
  timestamp: number;
  isSent: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isLocked } = useInactivityLock({
    timeout: 5 * 60 * 1000, // 5 minutes
    onLock: () => {
      console.log("Session locked due to inactivity");
    },
  });

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
  }, [router]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      body: input,
      senderId: "me",
      timestamp: Date.now(),
      isSent: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // TODO: Encrypt and send via API
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
              <h1 className="font-semibold">CipherTalk</h1>
              <p className="text-xs text-gray-500">End-to-end encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2 inline-block mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SECURED
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
                Start a secure conversation
              </h2>
              <p className="text-sm text-gray-600">
                All messages are end-to-end encrypted. Not even we can read them.
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
  const isMe = message.senderId === "me";
  
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-2xl ${
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
              {message.isSent ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
