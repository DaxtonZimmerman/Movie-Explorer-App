import MovieCard from './MovieCard';

export default function MovieList({ movies }) {
  return <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)}</div>;
}
