export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-area">
      <label htmlFor="movie-search">Search movies</label>
      <div className="search-field">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
        <input id="movie-search" type="search" value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search for a movie…" autoComplete="off" />
        <span className="search-hint">OMDb</span>
      </div>
      <div className="suggestions"><span>Try a title</span>{['Batman', 'Interstellar', 'Spider-Man', 'Harry Potter'].map((title) => <button key={title} onClick={() => onSearchChange(title)} className={searchTerm === title ? 'selected' : ''}>{title}</button>)}</div>
    </div>
  );
}
