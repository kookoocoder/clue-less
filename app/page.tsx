"use client";

import Link from "next/link";

export default function Home() {
  const games = [
    { name: "bloxd.io", color: "from-green-500 to-blue-500", icon: "🎮" },
    { name: "Smash Karts", color: "from-purple-500 to-pink-500", icon: "🏎️" },
    { name: "FrontWars", color: "from-red-500 to-orange-500", icon: "⚔️", badge: "Top" },
    { name: "Snowden.io", color: "from-cyan-500 to-blue-500", icon: "❄️", badge: "Top" },
    { name: "Battle Royale", color: "from-gray-700 to-gray-900", icon: "🎯" },
    { name: "Math Puzz", color: "from-emerald-500 to-cyan-500", icon: "🧩", badge: "New", isReal: true },
    { name: "Miniblox", color: "from-purple-600 to-pink-600", icon: "🎲" },
    { name: "Poxel.io", color: "from-blue-500 to-cyan-500", icon: "🔫" },
    { name: "MilkDrop", color: "from-yellow-400 to-pink-400", icon: "🥛" },
    { name: "Kour.io", color: "from-orange-500 to-yellow-500", icon: "🏃" },
    { name: "Cube Realm", color: "from-green-400 to-cyan-400", icon: "🧱" },
    { name: "Ships 3D", color: "from-blue-600 to-indigo-600", icon: "⛵" },
    { name: "Simply Up", color: "from-sky-400 to-blue-500", icon: "⬆️" },
    { name: "Taming.io", color: "from-orange-400 to-red-400", icon: "🦁" },
    { name: "Gulper.io", color: "from-blue-700 to-purple-700", icon: "🐍" },
    { name: "Tanks 3D", color: "from-green-600 to-yellow-600", icon: "🪖" },
    { name: "Kiomet", color: "from-cyan-600 to-blue-800", icon: "🚀" },
    { name: "mk48.io", color: "from-blue-500 to-gray-600", icon: "🚢" },
    { name: "Worms Zone", color: "from-green-500 to-lime-500", icon: "🐛" },
    { name: "TurnFight", color: "from-cyan-400 to-blue-600", icon: "⚡" },
    { name: "Snake.io", color: "from-orange-500 to-yellow-400", icon: "🐍" },
    { name: "Pixel Warfare", color: "from-red-600 to-orange-600", icon: "🎮" },
    { name: "Cowz.io", color: "from-gray-800 to-red-900", icon: "🐄" },
    { name: "Tilemin.io", color: "from-green-500 to-blue-500", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#252836] border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                🎮
              </div>
              <span className="text-2xl font-bold">
                <span className="text-white">crazy</span>
                <span className="text-purple-400">games</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                New
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Trending
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Updated
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                .io Games
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search games..."
                className="w-64 px-4 py-2 rounded-lg bg-[#1a1d29] border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Popular .io Games</h1>
          <p className="text-gray-400">Play the best multiplayer browser games online</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {games.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-sm text-gray-500 space-y-2">
          <p>Free online games • No downloads required • Play instantly</p>
          <p className="text-xs">© 2025 Gaming Platform. All games are property of their respective owners.</p>
        </div>
      </main>
    </div>
  );
}

function GameCard({ game }: { game: any }) {
  const content = (
    <div className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br hover:scale-105 transition-transform duration-200 cursor-pointer shadow-lg hover:shadow-2xl">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90`}></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Badge */}
      {game.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            game.badge === 'Top' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
          }`}>
            ⭐ {game.badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform">
          {game.icon}
        </div>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 className="font-bold text-white text-sm md:text-base truncate">
          {game.name}
        </h3>
        <p className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to play
        </p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

  if (game.isReal) {
    return (
      <Link href="/login">
        {content}
      </Link>
    );
  }

  return (
    <a 
      href="https://www.crazygames.com/c/io" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}
