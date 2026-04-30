import React from 'react';
import { LogOut, Palette, Search } from 'lucide-react';

export default function Navbar({ onSearch, setViewState, viewState, user, onLogout }) {
  const artistMode = user?.role === 'artist';
  const adminMode = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => setViewState('home')}
          className="text-lg md:text-xl font-serif italic text-gold whitespace-nowrap"
        >
          MuseArt
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search artwork or artist..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-gold/50"
          />
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {[
            ['home', 'Home'],
            ['masters', 'Master'],
            ['modern', 'Modern'],
            ['emerging', 'Emerging'],
            ['bidding', 'Live']
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setViewState(id)}
              className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest ${
                viewState === id ? 'bg-gold text-black' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setViewState('vault')}
            className="px-3 py-2 rounded-lg text-xs uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10"
          >
            Vault
          </button>
          <button
            onClick={() => setViewState('profile')}
            className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest ${
              viewState === 'profile' ? 'bg-gold text-black' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Profile
          </button>
          {artistMode && (
            <button
              onClick={() => setViewState('artist-dashboard')}
              className="px-3 py-2 rounded-lg text-xs uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 inline-flex items-center gap-1"
            >
              <Palette className="w-3.5 h-3.5" />
              Studio
            </button>
          )}
          {adminMode && (
            <button
              onClick={() => setViewState('admin-dashboard')}
              className="px-3 py-2 rounded-lg text-xs uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10"
            >
              Admin
            </button>
          )}
        </nav>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
