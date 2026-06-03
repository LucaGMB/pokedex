import { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 20;
const BASE = 'https://pokeapi.co/api/v2';

async function fetchPokemonDetail(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch pokemon');
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
    number: data.id,
  };
}

export function usePokemonList(typeFilter) {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (currentOffset, reset = false) => {
      if (reset) {
        setPokemon([]);
        setOffset(0);
        setHasMore(true);
      }
      setLoading(true);
      setError(null);
      try {
        let entries;
        if (typeFilter) {
          const res = await fetch(`${BASE}/type/${typeFilter}`);
          if (!res.ok) throw new Error('Failed to fetch type');
          const data = await res.json();
          const slice = data.pokemon.slice(currentOffset, currentOffset + PAGE_SIZE);
          entries = slice.map((p) => ({ name: p.pokemon.name, url: p.pokemon.url }));
          if (currentOffset + PAGE_SIZE >= data.pokemon.length) setHasMore(false);
          else setHasMore(true);
        } else {
          const res = await fetch(`${BASE}/pokemon?limit=${PAGE_SIZE}&offset=${currentOffset}`);
          if (!res.ok) throw new Error('Failed to fetch pokemon list');
          const data = await res.json();
          entries = data.results;
          setHasMore(!!data.next);
        }

        const details = await Promise.all(entries.map((e) => fetchPokemonDetail(e.url)));
        setPokemon((prev) => (reset ? details : [...prev, ...details]));
        setOffset(currentOffset + PAGE_SIZE);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [typeFilter]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(0, true);
  }, [typeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (!loading && hasMore) load(offset);
  };

  const retry = () => load(0, true);

  return { pokemon, loading, error, hasMore, loadMore, retry };
}
