import { useReducer, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import styles from './FavoritesList.module.css';

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error('Failed');
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
    number: data.id,
  };
}

const initial = { pokemon: [], loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'start': return { ...state, loading: true, error: null };
    case 'success': return { pokemon: action.payload, loading: false, error: null };
    case 'error': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

export function FavoritesList({ favorites, onToggleFavorite, onSelect }) {
  const [{ pokemon, loading, error }, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (favorites.length === 0) return;
    dispatch({ type: 'start' });
    Promise.all(favorites.map(fetchPokemon))
      .then((data) => dispatch({ type: 'success', payload: data }))
      .catch((e) => dispatch({ type: 'error', payload: e.message }));
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>☆</span>
        <p>No tenés favoritos guardados.</p>
        <p className={styles.hint}>Marcá pokémon con ★ para verlos acá.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>⚠ {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {pokemon.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          isFavorite={true}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
