import { useEffect, useState } from "react";

export function useFetch(url, onStart, resetIf) {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    onStart?.();
    if (resetIf) {
      setData([]);
      setError("");
      setisLoading(false);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        setError("");
        setisLoading(true);
        const r = await fetch(url, { signal: controller.signal });
        if (!r.ok) throw new Error("Something went wrong with fatching");
        const d = await r.json();
        if (d.Response === "False") throw new Error(d.Error);
        setData(d);
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
  }, [url, resetIf]);
  return { data, isLoading, error };
}
