import { useState, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { PokemonList } from './components/PokemonList';
import { FavoritesList } from './components/FavoritesList';
import { useFavorites } from './hooks/useFavorites';
import { usePokemonList } from './hooks/usePokemonList';
import { useTypes } from './hooks/useTypes';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState('home');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { favorites, toggleFavorite } = useFavorites();
  const { pokemon, loading, error, hasMore, loadMore, retry } = usePokemonList(typeFilter);
  const { types } = useTypes();

  const handleTypeFilter = (type) => {
    setSearch('');
    setTypeFilter(type);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return pokemon;
    const q = search.toLowerCase();
    return pokemon.filter((p) => p.name.toLowerCase().includes(q));
  }, [pokemon, search]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="" />
            <span>Pokédex</span>
          </div>
          <nav className={styles.nav}>
            <button
              className={`${styles.navBtn} ${view === 'home' ? styles.navBtnActive : ''}`}
              onClick={() => setView('home')}
            >
              Pokémon
            </button>
            <button
              className={`${styles.navBtn} ${view === 'favorites' ? styles.navBtnActive : ''}`}
              onClick={() => setView('favorites')}
            >
              Favoritos
              {favorites.length > 0 && (
                <span className={styles.badge}>{favorites.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {view === 'home' ? (
          <>
            <SearchBar
              search={search}
              onSearch={setSearch}
              typeFilter={typeFilter}
              onTypeFilter={handleTypeFilter}
              types={types}
              resultCount={filtered.length}
              loading={loading}
            />
            <PokemonList
              pokemon={filtered}
              loading={loading}
              error={error}
              hasMore={hasMore && !search.trim()}
              onLoadMore={loadMore}
              onRetry={retry}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          <>
            <h2 className={styles.sectionTitle}>Mis Favoritos</h2>
            <FavoritesList
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </>
        )}
      </main>
    </div>
  );
}
