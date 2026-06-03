import { useReducer, useEffect } from 'react';

const BASE = 'https://pokeapi.co/api/v2';
const MAX_RESULTS = 40;

let allNamesCache = null;
const typeNamesCache = {};

async function getAllNames() {
  if (!allNamesCache) {
    const res = await fetch(`${BASE}/pokemon?limit=100000&offset=0`);
    if (!res.ok) throw new Error('No se pudo obtener la lista de pokémon');
    const data = await res.json();
    allNamesCache = data.results;
  }
  return allNamesCache;
}

async function getTypeNames(type) {
  if (!typeNamesCache[type]) {
    const res = await fetch(`${BASE}/type/${type}`);
    if (!res.ok) throw new Error('No se pudo obtener el tipo');
    const data = await res.json();
    typeNamesCache[type] = data.pokemon.map((p) => ({
      name: p.pokemon.name,
      url: p.pokemon.url,
    }));
  }
  return typeNamesCache[type];
}

async function fetchDetail(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener el pokémon');
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
    number: data.id,
  };
}

const initial = { results: [], loading: false, error: null, total: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'clear': return initial;
    case 'start': return { ...state, loading: true, error: null };
    case 'success': return { results: action.results, total: action.total, loading: false, error: null };
    case 'error': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

export function usePokemonSearch(query, typeFilter) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      dispatch({ type: 'clear' });
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      dispatch({ type: 'start' });
      try {
        const pool = typeFilter ? await getTypeNames(typeFilter) : await getAllNames();
        const matches = pool.filter((p) => p.name.includes(q));
        const slice = matches.slice(0, MAX_RESULTS);
        const results = await Promise.all(slice.map((p) => fetchDetail(p.url)));
        if (!cancelled) dispatch({ type: 'success', results, total: matches.length });
      } catch (e) {
        if (!cancelled) dispatch({ type: 'error', payload: e.message || 'Error al buscar' });
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, typeFilter]);

  return state;
}
