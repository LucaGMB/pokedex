import { PokemonCard } from './PokemonCard';
import styles from './PokemonList.module.css';

function Spinner() {
  return <div className={styles.spinner} aria-label="Cargando..." />;
}

function SkeletonCard() {
  return <div className={styles.skeleton} />;
}

export function PokemonList({
  pokemon,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRetry,
  favorites,
  onToggleFavorite,
}) {
  const filtered = pokemon;

  if (error && pokemon.length === 0) {
    return (
      <div className={styles.errorBox}>
        <p className={styles.errorMsg}>⚠ {error}</p>
        <button className={styles.retryBtn} onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.grid}>
        {filtered.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isFavorite={favorites.includes(p.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
        {loading && pokemon.length === 0 &&
          Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      {loading && pokemon.length > 0 && (
        <div className={styles.loadingMore}>
          <Spinner />
        </div>
      )}
      {error && pokemon.length > 0 && (
        <div className={styles.errorBox}>
          <p className={styles.errorMsg}>⚠ {error}</p>
          <button className={styles.retryBtn} onClick={onRetry}>
            Reintentar
          </button>
        </div>
      )}
      {!loading && !error && hasMore && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreBtn} onClick={onLoadMore}>
            Cargar más
          </button>
        </div>
      )}
      {!loading && filtered.length === 0 && !error && (
        <p className={styles.empty}>No se encontraron pokémon.</p>
      )}
    </div>
  );
}
