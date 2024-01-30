import { useEffect, useState, useRef } from "react";
import NavBar from "./NavBar";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import { WatchedSummary, WatchedList } from "./WatchedList";
import { Loader, ErrorMessage } from "./Messages";
import { useFetch } from "./useFetch";
import { KEY } from "./privateData";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

export default function App() {
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  const closeMovieDetails = () => {
    setSelectedID(null);
  };

  const addWatchedMovie = (isUpdate, movie) => {
    if (isUpdate) {
      setWatched((m) =>
        m.map((el) =>
          el.imdbID === movie.imdbID
            ? {
                ...movie,
                decisionCount: el.decisionCount + movie.decisionCount,
              }
            : el
        )
      );
    } else {
      setWatched((m) => [...m, movie]);
    }
  };
  const getWatchedMovie = (mID) => {
    return watched.find((m) => m.imdbID === mID);
  };

  const handleRemove = (id) => {
    setWatched((m) => m.filter((el) => el.imdbID !== id));
  };

  const { data, isLoading, error } = useFetch(
    `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
    closeMovieDetails,
    query.length < 3
  );
  const movies = data.Search || [];

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
  const inputEl = useRef(null);
  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
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
