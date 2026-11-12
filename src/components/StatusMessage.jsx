export default function StatusMessage({
  loading,
  error,
  movieCount,
  searchTerm,
}) {
  if (!loading && !error && movieCount > 0) return null;
  return (
    <div
      className={`status ${error ? "status-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      <span className={loading ? "spinner" : "status-icon"} aria-hidden="true">
        {loading ? "" : error ? "!" : "⌕"}
      </span>
      <h3>
        {loading
          ? "Loading movies..."
          : error
            ? "Error fetching movies"
            : "No movies found"}
      </h3>
      {error ? <p>{error.replace(/^Error fetching movies\.\s*/, "")}</p> : !loading && <p>Try another title.</p>}
    </div>
  );
}
