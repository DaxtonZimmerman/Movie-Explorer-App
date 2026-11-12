import { useEffect, useState } from "react";

// A small discovery selection because OMDb requires a title search.
const RECOMMENDED_SEARCHES = ["Batman", "Interstellar", "Spider-Man", "Harry Potter", "Toy Story"];

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "f5a49a4c";

export default function useMovies(searchTerm) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = searchTerm.trim();
    const controller = new AbortController();
    setMovies([]);
    setError("");
    setLoading(true);

    async function fetchMovies() {
      try {
        async function searchMovies(title) {
          const params = new URLSearchParams({ apikey: API_KEY, s: title, type: "movie" });
          const response = await fetch(`https://www.omdbapi.com/?${params}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("The movie service is unavailable. Please try again.");
          const data = await response.json();
          if (data.Response === "False") {
            if (data.Error === "Movie not found!") return [];
            throw new Error(data.Error || "Please try another title.");
          }
          if (!Array.isArray(data.Search)) throw new Error("The movie service returned an unexpected response.");
          return data.Search;
        }

        const titles = query ? [query] : RECOMMENDED_SEARCHES;
        const results = await Promise.all(titles.map(searchMovies));
        // Some searches can overlap, so show each IMDb movie only once.
        const uniqueMovies = [...new Map(results.flat().map((movie) => [movie.imdbID, movie])).values()];
        if (!controller.signal.aborted) setMovies(uniqueMovies);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(`Error fetching movies. ${err.message}`);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    // Wait for typing to pause before making a request.
    const timeout = setTimeout(fetchMovies, 400);
    return () => {
      clearTimeout(timeout);
      controller.abort(); // Prevent an older search from replacing newer results.
    };
  }, [searchTerm]);

  return { movies, loading, error };
}
