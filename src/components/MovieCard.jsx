import { useState } from "react";

export default function MovieCard({ movie }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== "N/A" && !imageFailed;
  return (
    <article className="movie-card">
      <a
        className="poster-link"
        href={`https://www.imdb.com/title/${movie.imdbID}/`}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${movie.Title} on IMDb (opens in a new tab)`}
      >
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="poster-fallback">
            <span aria-hidden="true">▤</span>
            <span>Poster unavailable</span>
          </div>
        )}
        <span className="poster-overlay">View on IMDb ↗</span>
      </a>
      <div className="movie-meta">
        <span>{movie.Year}</span>
      </div>
      <h3>{movie.Title}</h3>
    </article>
  );
}
