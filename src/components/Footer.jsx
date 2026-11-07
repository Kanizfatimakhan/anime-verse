import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-0 border-t border-white/5 bg-background pb-12 pt-10">
      <div className="page-container grid grid-cols-1 gap-10 md:grid-cols-3">
        
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="font-black text-2xl tracking-tighter text-text">
              ANIME<span className="text-primary group-hover:text-accent transition-colors">VERSE</span>
            </span>
          </Link>
          <p className="text-muted text-sm leading-relaxed max-w-xs">
            Discover anime from around the world. The ultimate premium anime discovery platform.
          </p>
          <p className="text-xs text-muted/70">
            Created by <span className="text-primary font-semibold">Kaniz Fatima Khan</span>
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold tracking-wider text-text mb-4 uppercase text-xs">Navigate</h3>
          <ul className="flex flex-col gap-2.5">
            {[
              ['/', 'Home'],
              ['/search', 'Search'],
              ['/genres', 'Genres'],
              ['/gallery', 'Gallery'],
              ['/schedule', 'Schedule'],
              ['/compare', 'Versus'],
              ['/watchlist', 'Watchlist'],
              ['/developer', 'Developer'],
            ].map(([path, label]) => (
              <li key={path}>
                <Link to={path} className="text-muted hover:text-primary transition-colors text-sm">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-bold tracking-wider text-text mb-4 uppercase text-xs">About</h3>
          <p className="text-muted text-sm leading-relaxed mb-3">
            AnimeVerse is a modern anime discovery platform built for fans. Explore trending series, genres, and detailed anime information in one place.
          </p>
          <p className="text-xs text-muted/50">
            Powered by AniList · Updated regularly for anime lovers
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="page-container mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 md:flex-row">
        <p className="text-muted/50 text-xs">
          © {new Date().getFullYear()} AnimeVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}