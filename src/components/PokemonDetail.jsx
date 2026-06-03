import { useEffect } from 'react';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import styles from './PokemonDetail.module.css';

const TYPE_COLORS = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
  flying: '#A890F0', psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
  ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0',
  fairy: '#EE99AC', normal: '#A8A878',
};

function statColor(value) {
  if (value >= 110) return '#22c55e';
  if (value >= 80) return '#84cc16';
  if (value >= 50) return '#f97316';
  return '#ef4444';
}

function TypeBadge({ type }) {
  return (
    <span className={styles.typeBadge} style={{ backgroundColor: TYPE_COLORS[type] || '#888' }}>
      {type}
    </span>
  );
}

function StatBar({ name, value }) {
  const pct = Math.round((value / 255) * 100);
  return (
    <div className={styles.statRow}>
      <span className={styles.statName}>{name}</span>
      <span className={styles.statValue}>{value}</span>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%`, backgroundColor: statColor(value) }}
        />
      </div>
    </div>
  );
}

export function PokemonDetail({ id, isFavorite, onToggleFavorite, onClose }) {
  const { data, loading, error } = usePokemonDetail(id);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const primaryType = data?.types?.[0];
  const accentColor = TYPE_COLORS[primaryType] || '#6366f1';

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header} style={{ '--accent': accentColor }}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M19 12H5M5 12l6-6M5 12l6 6" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver
          </button>
          <button
            className={`${styles.favBtn} ${isFavorite ? styles.favBtnActive : ''}`}
            onClick={() => onToggleFavorite(id)}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>Cargando datos...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorWrap}>
            <p>⚠ {error}</p>
          </div>
        )}

        {data && (
          <>
            {/* Hero */}
            <div className={styles.hero} style={{ '--accent': accentColor }}>
              <span className={styles.number}>#{String(data.id).padStart(4, '0')}</span>
              {data.genus && <span className={styles.genus}>{data.genus}</span>}
              <img className={styles.artwork} src={data.sprite} alt={data.name} />
              <h2 className={styles.pokeName}>
                {data.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </h2>
              <div className={styles.types}>
                {data.types.map((t) => <TypeBadge key={t} type={t} />)}
              </div>
            </div>

            {/* Body */}
            <div className={styles.body}>

              {data.description && (
                <p className={styles.description}>{data.description}</p>
              )}

              {/* Quick info */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Altura</span>
                  <span className={styles.infoVal}>{data.height} m</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Peso</span>
                  <span className={styles.infoVal}>{data.weight} kg</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Generación</span>
                  <span className={styles.infoVal}>{data.generation}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tasa captura</span>
                  <span className={styles.infoVal}>{data.captureRate}</span>
                </div>
              </div>

              {/* Stats */}
              <section>
                <h3 className={styles.sectionTitle}>Estadísticas base</h3>
                <div className={styles.stats}>
                  {data.stats.map((s) => (
                    <StatBar key={s.name} name={s.name} value={s.value} />
                  ))}
                  <div className={`${styles.statRow} ${styles.statTotalRow}`}>
                    <span className={styles.statTotalLabel}>Total</span>
                    <span className={styles.statTotalValue}>
                      {data.stats.reduce((acc, s) => acc + s.value, 0)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Abilities */}
              <section>
                <h3 className={styles.sectionTitle}>Habilidades</h3>
                <div className={styles.abilities}>
                  {data.abilities.map((a) => (
                    <span
                      key={a.name}
                      className={`${styles.abilityBadge} ${a.hidden ? styles.abilityHidden : ''}`}
                      title={a.hidden ? 'Habilidad oculta' : undefined}
                    >
                      {a.name}
                      {a.hidden && <span className={styles.hiddenTag}>oculta</span>}
                    </span>
                  ))}
                </div>
              </section>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
