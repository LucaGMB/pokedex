import { useState, useEffect } from 'react';

export function useTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type?limit=100')
      .then((r) => r.json())
      .then((data) => {
        setTypes(data.results.map((t) => t.name).filter((t) => t !== 'unknown' && t !== 'shadow'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { types, loading };
}
