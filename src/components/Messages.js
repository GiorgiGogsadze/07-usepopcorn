export function Loader() {
  return <p className="loader">Loading...</p>;
}

export function ErrorMessage({ error }) {
  return (
    <p className="error">
      <span>⛔</span>
      {error}
    </p>
  );
}
