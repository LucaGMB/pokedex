import { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { PokemonList } from './components/PokemonList';
import { FavoritesList } from './components/FavoritesList';
import { PokemonDetail } from './components/PokemonDetail';
import { useFavorites } from './hooks/useFavorites';
import { usePokemonList } from './hooks/usePokemonList';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import { useTypes } from './hooks/useTypes';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState('home');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();
  const { types } = useTypes();

  const isSearching = search.trim().length > 0;

  const {
    pokemon: listPokemon,
    loading: listLoading,
    error: listError,
    hasMore,
    loadMore,
    retry: listRetry,
  } = usePokemonList(isSearching ? null : typeFilter);

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    total: searchTotal,
  } = usePokemonSearch(search, typeFilter);

  const displayPokemon = isSearching ? searchResults : listPokemon;
  const displayLoading = isSearching ? searchLoading : listLoading;
  const displayError = isSearching ? searchError : listError;
  const displayHasMore = isSearching ? false : hasMore;
  const displayRetry = isSearching ? () => {} : listRetry;
  const resultCount = isSearching ? searchTotal : displayPokemon.length;

  const handleTypeFilter = (type) => {
    setSearch('');
    setTypeFilter(type);
  };

  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const handleClose = useCallback(() => setSelectedId(null), []);

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
              resultCount={resultCount}
              loading={displayLoading}
              isSearching={isSearching}
              searchTotal={searchTotal}
            />
            <PokemonList
              pokemon={displayPokemon}
              loading={displayLoading}
              error={displayError}
              hasMore={displayHasMore}
              onLoadMore={loadMore}
              onRetry={displayRetry}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelect={handleSelect}
            />
          </>
        ) : (
          <>
            <h2 className={styles.sectionTitle}>Mis Favoritos</h2>
            <FavoritesList
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelect={handleSelect}
            />
          </>
        )}
      </main>

      {selectedId !== null && (
        <PokemonDetail
          id={selectedId}
          isFavorite={favorites.includes(selectedId)}
          onToggleFavorite={toggleFavorite}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
