import { useReducer, useEffect } from 'react';

const STAT_NAMES = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

function pickText(entries, langPrimary, langFallback) {
  return (
    entries.find((e) => e.language.name === langPrimary) ||
    entries.find((e) => e.language.name === langFallback)
  );
}

function cleanText(text) {
  return text.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
}

const initial = { data: null, loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'clear': return initial;
    case 'start': return { data: null, loading: true, error: null };
    case 'success': return { data: action.payload, loading: false, error: null };
    case 'error': return { data: null, loading: false, error: action.payload };
    default: return state;
  }
}

export function usePokemonDetail(id) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (!id) {
      dispatch({ type: 'clear' });
      return;
    }

    let cancelled = false;
    dispatch({ type: 'start' });

    (async () => {
      try {
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!pokemonRes.ok) throw new Error('No se pudo obtener el pokémon');
        const pokemon = await pokemonRes.json();

        const speciesRes = await fetch(pokemon.species.url);
        if (!speciesRes.ok) throw new Error('No se pudo obtener la especie');
        const species = await speciesRes.json();

        if (cancelled) return;

        const flavorEntry = pickText(species.flavor_text_entries, 'es', 'en');
        const description = flavorEntry ? cleanText(flavorEntry.flavor_text) : '';

        const genusEntry = pickText(species.genera, 'es', 'en');
        const genus = genusEntry ? genusEntry.genus : '';

        dispatch({
          type: 'success',
          payload: {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
            spriteShiny: pokemon.sprites.other['official-artwork'].front_shiny,
            types: pokemon.types.map((t) => t.type.name),
            height: (pokemon.height / 10).toFixed(1),
            weight: (pokemon.weight / 10).toFixed(1),
            baseExperience: pokemon.base_experience,
            abilities: pokemon.abilities.map((a) => ({
              name: a.ability.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              hidden: a.is_hidden,
            })),
            stats: pokemon.stats.map((s) => ({
              name: STAT_NAMES[s.stat.name] || s.stat.name,
              value: s.base_stat,
            })),
            description,
            genus,
            captureRate: species.capture_rate,
            happiness: species.base_happiness,
            generation: species.generation.name.replace('generation-', 'Gen. ').toUpperCase(),
          },
        });
      } catch (e) {
        if (!cancelled) dispatch({ type: 'error', payload: e.message || 'Error al cargar' });
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return state;
}
