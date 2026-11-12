import { useState } from "react";
import SearchBar from "./components/SearchBar";
import StatusMessage from "./components/StatusMessage";
import MovieList from "./components/MovieList";
import useMovies from "./hooks/useMovies";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const { movies, loading, error } = useMovies(searchTerm);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="./" className="brand">
          Movie Explorer<span className="brand-dot">.</span>
        </a>
      </header>
      <main>
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">Find a movie.</h1>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </section>
        <section
          className="results"
          aria-labelledby="results-title"
          aria-busy={loading}
        >
          <div className="section-heading">
            <h2 id="results-title">
              {searchTerm.trim() ? (
                <>
                  Results for <span>“{searchTerm.trim()}”</span>
                </>
              ) : (
                "Recommended movies"
              )}
            </h2>
            <span className="result-count" aria-live="polite">
              {!loading &&
                !error &&
                `${movies.length} ${movies.length === 1 ? "movie" : "movies"} shown`}
            </span>
          </div>
          <StatusMessage
            loading={loading}
            error={error}
            movieCount={movies.length}
            searchTerm={searchTerm}
          />
          {!loading && !error && <MovieList movies={movies} />}
        </section>
      </main>
      <footer>
        <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">Powered by OMDb</a>
      </footer>
    </div>
  );
}
