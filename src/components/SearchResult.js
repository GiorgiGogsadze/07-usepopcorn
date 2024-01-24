export default function SearchResult({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <SearchedMovie movie={movie} />
      ))}
    </ul>
  );
}

function SearchedMovie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
