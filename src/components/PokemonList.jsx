import { useEffect, useRef } from 'react';
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
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

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
        {pokemon.map((p) => (
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

      {!loading && !error && hasMore && <div ref={sentinelRef} className={styles.sentinel} />}

      {!loading && pokemon.length === 0 && !error && (
        <p className={styles.empty}>No se encontraron pokémon.</p>
      )}
    </div>
  );
}
