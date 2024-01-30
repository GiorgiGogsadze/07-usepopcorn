import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { Loader } from "./Messages";
import { useFetch } from "./useFetch";
import { KEY } from "./privateData";
import { useKey } from "./useKey";

export default function MovieDetails({
  selectedID,
  closeMovieDetails,
  addWatchedMovie,
  getWatchedMovie,
}) {
  const watchedMovie = getWatchedMovie(selectedID);
  const countRef = useRef(0);
  const [rating, setRating] = useState(null);

  const { data: movie, isLoading } = useFetch(
    `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
  );
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie || {};

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      poster,
      imdbRating: +imdbRating,
      userRating: rating,
      runtime: +runtime.split(" ")[0],
      decisionCount: countRef.current,
    };
    addWatchedMovie(Boolean(watchedMovie), newWatchedMovie);
    closeMovieDetails();
  };

  useKey("Escape", closeMovieDetails);

  useEffect(() => {
    if (title) {
      document.title = `MOVIE | ${title}`;

      return () => {
        document.title = "usePopcorn";
      };
    }
  }, [title]);

  useEffect(() => {
    if (rating) countRef.current++;
  }, [rating]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <button className="btn-back" onClick={closeMovieDetails}>
        &larr;
      </button>
      <header>
        <img src={poster} alt={title} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐ </span> {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          <StarRating
            setRating={setRating}
            defaultRating={watchedMovie ? watchedMovie.userRating : 0}
          />
          {rating ? (
            <button className="btn-add" onClick={handleAdd}>
              +Add to list
            </button>
          ) : null}
        </div>

        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
