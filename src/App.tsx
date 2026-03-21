import { useState, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, AlertCircle, TrendingUp, Search as SearchIcon } from 'lucide-react';
import Navbar from './components/Navbar';
import MovieCard from './components/MovieCard';
import MovieSkeleton from './components/MovieSkeleton';
import { Movie, SearchResponse } from './types';

// @ts-ignore
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// Mock trending movies for initial load
const TRENDING_MOCK: Movie[] = [
  { Title: "Dune: Part Two", Year: "2024", imdbID: "tt15239678", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzhlXkEyXkFqcGc@._V1_SX300.jpg", Rating: "8.6" },
  { Title: "Oppenheimer", Year: "2023", imdbID: "tt15327232", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzhmZThhNDVkMDY2XkEyXkFqcGdeQXVyMTMxNjUyNw@@._V1_SX300.jpg", Rating: "8.4" },
  { Title: "The Batman", Year: "2022", imdbID: "tt1877830", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg", Rating: "7.8" },
  { Title: "Spider-Man: Across the Spider-Verse", Year: "2023", imdbID: "tt9362722", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg", Rating: "8.6" },
  { Title: "Interstellar", Year: "2014", imdbID: "tt0816692", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxNjUyNw@@._V1_SX300.jpg", Rating: "8.7" },
  { Title: "Inception", Year: "2010", imdbID: "tt1375666", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg", Rating: "8.8" },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(TRENDING_MOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMovies = useCallback(async (query: string, isInitial = false) => {
    if (!query.trim()) {
      if (!isInitial) {
        setMovies([]);
        setIsSearching(false);
      }
      return;
    }

    if (!OMDB_API_KEY) {
      if (!isInitial) {
        setError("Please add your OMDb API Key to the .env file to enable search.");
      }
      return;
    }

    setLoading(true);
    if (!isInitial) {
      setError(null);
      setIsSearching(true);
    }

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
      const data: SearchResponse = await response.json();

      if (data.Response === 'True' && data.Search) {
        if (isInitial) {
          setTrendingMovies(data.Search.slice(0, 10));
        } else {
          setMovies(data.Search);
        }
      } else {
        if (!isInitial) {
          setError(data.Error || "No results found.");
          setMovies([]);
        }
      }
    } catch (err) {
      if (!isInitial) {
        setError("Failed to fetch movies. Please check your connection.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load for "Trending"
  useEffect(() => {
    if (OMDB_API_KEY) {
      fetchMovies('2025', true);
    }
  }, [fetchMovies]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchMovies(searchQuery);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        fetchMovies(searchQuery);
      } else if (searchQuery.length === 0) {
        setMovies([]);
        setIsSearching(false);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchMovies]);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-emerald-500/30">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearch={handleSearch} 
      />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section (Only visible when not searching) */}
        <AnimatePresence>
          {!isSearching && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16 relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[21/7] group"
            >
              <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1920" 
                alt="Hero"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center p-8 md:p-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl"
                >
                  <span className="inline-block px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full mb-4">
                    NEW RELEASE
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                    Experience Cinema Like <span className="text-emerald-500">Never Before</span>
                  </h1>
                  <p className="text-white/60 text-lg mb-8 line-clamp-2">
                    Discover thousands of movies and series with our premium streaming platform. 
                    High quality, no ads, just pure entertainment.
                  </p>
                  <div className="flex items-center gap-4">

                    <button 
                      onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                      className="px-8 py-3 glass hover:bg-white/10 text-white font-bold rounded-full transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {isSearching ? (
              <SearchIcon className="text-emerald-500" size={24} />
            ) : (
              <TrendingUp className="text-emerald-500" size={24} />
            )}
            <h2 className="text-2xl font-display font-bold">
              {isSearching ? `Search results for "${searchQuery}"` : "Trending Now"}
            </h2>
          </div>
          {(isSearching ? movies : trendingMovies).length > 0 && (
            <span className="text-white/40 text-sm font-medium">
              {(isSearching ? movies : trendingMovies).length} results
            </span>
          )}
        </div>

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
            <p className="text-white/50 max-w-md mx-auto">{error}</p>
            {!OMDB_API_KEY && (
              <div className="mt-8 p-4 glass rounded-2xl text-sm border-emerald-500/30">
                <p className="text-emerald-400 font-semibold mb-2">How to fix:</p>
                <ol className="text-left list-decimal list-inside space-y-1 text-white/70">
                  <li>Go to <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" className="underline hover:text-emerald-400">omdbapi.com</a></li>
                  <li>Get a free API Key</li>
                  <li>Add it to <code className="bg-white/10 px-1 rounded">VITE_OMDB_API_KEY</code> in your secrets</li>
                </ol>
              </div>
            )}
          </motion.div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <MovieSkeleton key={i} />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {(isSearching ? movies : trendingMovies).map((movie, index) => (
                <MovieCard key={movie.imdbID} movie={movie} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Film className="text-white/20" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No movies found</h3>
            <p className="text-white/40">Try searching for something else</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Film size={20} />
            <span className="font-display font-bold tracking-tight">
              CINE<span className="text-emerald-500">STREAM</span>
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/40 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-xs text-white/20">
            © 2026 CineStream. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
