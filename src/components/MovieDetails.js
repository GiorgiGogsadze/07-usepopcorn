import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loader, ErrorMessage } from "./Messages";

export default function MovieDetails({
  selectedID,
  closeMovieDetails,
  addWatchedMovie,
  getWatchedMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [rating, setRating] = useState(null);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  useEffect(() => {
    (async () => {
      setisLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=70e45600&i=${selectedID}`
      );
      const data = await res.json();
      setMovie(data);
      setisLoading(false);
    })();
  }, [selectedID]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.code === "Escape") {
        closeMovieDetails();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [closeMovieDetails]);

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      poster,
      imdbRating: +imdbRating,
      userRating: rating,
      runtime: +runtime.split(" ")[0],
    };
    addWatchedMovie(watchedMovie ? false : true, newWatchedMovie);
    closeMovieDetails();
  };

  const watchedMovie = getWatchedMovie(selectedID);

  useEffect(() => {
    if (title) {
      document.title = `MOVIE | ${title}`;

      return () => {
        document.title = "usePopcorn";
      };
    }
  }, [title]);

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
