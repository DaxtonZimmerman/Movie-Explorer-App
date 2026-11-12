export default function StatusMessage({ loading, error, movieCount, searchTerm }) {
  if (!loading && !error && movieCount > 0) return null;
  return (
    <div className={`status ${error ? 'status-error' : ''}`} role={error ? 'alert' : 'status'}>
      <span className={loading ? 'spinner' : 'status-icon'} aria-hidden="true">{loading ? '' : error ? '!' : '⌕'}</span>
      <h3>{loading ? 'Loading movies...' : error ? 'Something went wrong' : 'No movies found'}</h3>
      <p>{loading ? 'Finding your next great watch.' : error || (searchTerm.trim() ? 'Try a different movie title.' : 'Search for a title to start exploring.')}</p>
    </div>
  );
}
