import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "1.6rem",
};

const starContainerStyle = { display: "flex" };

StarRating.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  setRating: PropTypes.func,
};
export default function StarRating({
  color = "#fcc419",
  size = 24,
  className = "",
  messages,
  maxRating = messages ? messages.length : 10,
  defaultRating = 0,
  setRating,
}) {
  const textStyle = { color: color, fontSize: `${size / 15}rem` };

  const [hoverStars, setHoverStars] = useState(0);
  const [fixedStar, setfixedStar] = useState(defaultRating);

  const handleHover = (e) => {
    const value = e.target.closest("span").dataset.value;
    if (!value) return;
    setHoverStars(+value);
  };

  const handleRating = function (e) {
    const value = e.target.closest("span").dataset.value;
    if (!value) return;
    setfixedStar(+value);
    setRating(+value);
  };

  const handleLeave = () => {
    setHoverStars(0);
  };

  return (
    <div
      style={containerStyle}
      className={className}
      onMouseLeave={handleLeave}
    >
      <div
        style={starContainerStyle}
        onMouseOver={handleHover}
        onClick={handleRating}
        onMouseLeave={handleLeave}
      >
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i + 1}
            n={i + 1}
            full={hoverStars ? i + 1 <= hoverStars : i + 1 <= fixedStar}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages && messages.length === maxRating
          ? (hoverStars && messages[hoverStars - 1]) ||
            (fixedStar && messages[fixedStar - 1]) ||
            ""
          : hoverStars || fixedStar || ""}
      </p>
    </div>
  );
}

function Star({ n, full, size, color }) {
  const spanStyle = {
    width: `${size / 10}rem`,
    height: `${size / 10}rem`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span role="button" data-value={n} style={spanStyle}>
      {full ? <FullStar color={color} /> : <EmptyStar color={color} />}
    </span>
  );
}
function EmptyStar({ color = "#fcc419" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="{2}"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

function FullStar({ color = "#fcc419" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={color}
      stroke={color}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
