import styles from './PokemonCard.module.css';

const TYPE_COLORS = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  normal: '#A8A878',
};

function TypeBadge({ type }) {
  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: TYPE_COLORS[type] || '#888' }}
    >
      {type}
    </span>
  );
}

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const primaryType = pokemon.types[0];
  const bg = TYPE_COLORS[primaryType] || '#A8A878';

  return (
    <div className={styles.card} style={{ '--card-bg': bg }}>
      <button
        className={`${styles.favBtn} ${isFavorite ? styles.favBtnActive : ''}`}
        onClick={() => onToggleFavorite(pokemon.id)}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      <span className={styles.number}>#{String(pokemon.number).padStart(4, '0')}</span>
      <img
        className={styles.sprite}
        src={pokemon.sprite}
        alt={pokemon.name}
        loading="lazy"
      />
      <h3 className={styles.name}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h3>
      <div className={styles.types}>
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </div>
  );
}
