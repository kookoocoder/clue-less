"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("deviceId", `device_${Date.now()}`);
        
        // Redirect to gate
        router.push("/gate");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white grid place-items-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to CipherTalk
          </h1>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-500"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              "Continue"
            )}
          </button>

          {/* Info */}
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <div>
                <p className="text-sm font-medium text-white">Secure access</p>
                <p className="text-xs text-gray-500">
                  End-to-end encrypted communication
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <div>
                <p className="text-sm font-medium text-white">Puzzle-gated</p>
                <p className="text-xs text-gray-500">Solve puzzles to unlock sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
