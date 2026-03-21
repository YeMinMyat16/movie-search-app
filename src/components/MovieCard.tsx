import { Star, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie } from '../types';
import React from 'react';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col gap-3 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl movie-card-shadow">
        <img
          src={posterUrl}
          alt={movie.Title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-emerald-500 text-black font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center block"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </a>
        </div>

        {/* Rating Badge (Mocked for OMDb search results) */}
        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-emerald-400">
          <Star size={12} fill="currentColor" />
          {movie.Rating || (7 + Math.random() * 2).toFixed(1)}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-display font-semibold text-white/90 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {movie.Title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-white/50 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {movie.Year}
          </span>
          <span className="px-1.5 py-0.5 border border-white/20 rounded uppercase text-[10px]">
            {movie.Type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
