import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import { WatchedSummary, WatchedList } from "./WatchedList";
import { KEY } from "./privateData";
import { Loader, ErrorMessage } from "./Messages";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  const closeMovieDetails = () => {
    setSelectedID(null);
  };

  const addWatchedMovie = (IsChange, movie) => {
    IsChange
      ? setWatched((m) => [...m, movie])
      : setWatched((m) =>
          m.map((el) => (el.imdbID === movie.imdbID ? movie : el))
        );
  };
  const getWatchedMovie = (mID) => {
    return watched.find((m) => m.imdbID === mID);
  };

  const handleRemove = (id) => {
    setWatched((m) => m.filter((el) => el.imdbID !== id));
  };

  useEffect(() => {
    closeMovieDetails();
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        setError("");
        setisLoading(true);
        const r = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!r.ok) throw new Error("Something went wrong with fatching movies");
        const d = await r.json();
        if (d.Response === "False") throw new Error(d.Error);
        setMovies(d.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setisLoading(false);
      }
    })();
    return () => controller.abort();
  }, [query]);

  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <main className="main">
        {
          <Box>
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList
                movies={movies}
                selectedID={selectedID}
                setSelectedID={setSelectedID}
              />
            )}
            {error && <ErrorMessage error={error} />}
          </Box>
        }
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              closeMovieDetails={closeMovieDetails}
              addWatchedMovie={addWatchedMovie}
              key={selectedID}
              getWatchedMovie={getWatchedMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} handleRemove={handleRemove} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
