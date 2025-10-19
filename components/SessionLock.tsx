"use client";

interface SessionLockProps {
  onUnlock: () => void;
}

export default function SessionLock({ onUnlock }: SessionLockProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md grid place-items-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">🔒</div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Session Locked
          </h2>
          <p className="text-gray-400">
            Your session has been locked due to inactivity
          </p>
        </div>
        <button
          onClick={onUnlock}
          className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 transition-all font-semibold text-lg"
        >
          Solve Puzzle to Unlock
        </button>
        <p className="text-xs text-gray-600">
          You'll need to solve a new puzzle to regain access
        </p>
      </div>
    </div>
  );
}

