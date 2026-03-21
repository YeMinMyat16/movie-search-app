import { Search, Film, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { FormEvent } from 'react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: FormEvent) => void;
}

export default function Navbar({ searchQuery, setSearchQuery, onSearch }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
            <Film className="text-black" size={24} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight hidden sm:block">
            CINE<span className="text-emerald-500">STREAM</span>
          </span>
        </div>

        <form onSubmit={onSearch} className="flex-1 max-w-xl relative group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-500 transition-colors" 
            size={20} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies, series..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
          />
        </form>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
            Browse
          </button>

        </div>
      </div>
    </nav>
  );
}
