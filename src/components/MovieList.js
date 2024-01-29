export default function SelectedMovie({ movies, selectedID, setSelectedID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          setSelectedID={setSelectedID}
          selectedID={selectedID}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, selectedID, setSelectedID, className }) {
  return (
    <li
      onClick={() =>
        selectedID === movie.imdbID
          ? setSelectedID(null)
          : setSelectedID(movie.imdbID)
      }
      className={selectedID === movie.imdbID ? "selected" : ""}
    >
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
