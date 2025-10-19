"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Load user data from localStorage
    setHandle(localStorage.getItem("handle") || "");
    setDeviceId(localStorage.getItem("deviceId") || "");
    setUserId(localStorage.getItem("userId") || "");

    // Redirect if not logged in
    if (!localStorage.getItem("deviceId")) {
      router.push("/login");
    }
  }, [router]);

  function handleLogout() {
    // Clear local storage
    localStorage.removeItem("handle");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("userId");

    // Redirect to home
    router.push("/");
  }

  if (!handle) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="container mx-auto max-w-2xl py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 grid place-items-center text-4xl font-bold">
            {handle[0]?.toUpperCase() || "?"}
          </div>
          <h1 className="text-3xl font-bold">{handle}</h1>
          <p className="text-gray-400">Your secure profile</p>
        </div>

        {/* Info Cards */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Handle</label>
                <p className="text-white font-mono">{handle}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">User ID</label>
                <p className="text-white font-mono text-xs break-all">{userId}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Device ID</label>
                <p className="text-white font-mono text-xs break-all">{deviceId}</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-xl">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Passkey Enabled</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your device is registered with hardware-backed security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-xl">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Single Device Only</p>
                  <p className="text-xs text-gray-400 mt-1">
                    This device is the only one authorized to access your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-xl">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">E2E Encryption Active</p>
                  <p className="text-xs text-gray-400 mt-1">
                    All messages are encrypted locally on your device
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                href="/gate"
                className="block w-full px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center"
              >
                Solve New Puzzle
              </Link>
              
              <Link
                href="/chat"
                className="block w-full px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center"
              >
                Go to Chat
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

