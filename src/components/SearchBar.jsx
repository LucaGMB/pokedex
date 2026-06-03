import styles from './SearchBar.module.css';

const MAX_SEARCH_RESULTS = 40;

export function SearchBar({
  search,
  onSearch,
  typeFilter,
  onTypeFilter,
  types,
  resultCount,
  loading,
  isSearching,
  searchTotal,
}) {
  let countText = '';
  if (!loading) {
    if (isSearching) {
      if (searchTotal === 0) {
        countText = 'Sin resultados';
      } else if (searchTotal > MAX_SEARCH_RESULTS) {
        countText = `Mostrando 40 de ${searchTotal} coincidencias`;
      } else {
        countText = searchTotal === 1 ? '1 resultado' : `${searchTotal} resultados`;
      }
    } else {
      countText = resultCount === 1 ? '1 pokémon cargado' : `${resultCount} pokémon cargados`;
    }
    if (typeFilter) countText += ` · tipo: ${typeFilter}`;
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.inputWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.input}
            type="text"
            placeholder="Buscar en toda la Pokédex..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.clearBtn}
              onClick={() => onSearch('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        <select
          className={styles.select}
          value={typeFilter}
          onChange={(e) => onTypeFilter(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {countText && <p className={styles.count}>{countText}</p>}
    </div>
  );
}
