# Pokédex

Una Pokédex web interactiva construida con React + Vite. Consume la [PokéAPI](https://pokeapi.co/) para mostrar pokémon con imágenes oficiales, tipos, búsqueda en tiempo real, filtro por tipo y sistema de favoritos persistente.

## Funcionalidades

- **Vista de detalle** — modal con artwork grande, descripción Pokédex, estadísticas base, habilidades, altura/peso y generación
- **Listado con scroll infinito** — carga automática al llegar al final de la página
- **Búsqueda global** — busca en toda la Pokédex (no solo los pokémon ya cargados)
- **Filtro por tipo** — dropdown poblado desde la PokéAPI; recarga el listado al cambiar
- **Favoritos** — marcá/desmarcá con ★; persiste en `localStorage["pokemon_favorites"]`
- **Vista de favoritos** — sección separada con los pokémon guardados y estado vacío amigable
- **Colores por tipo** — cada card usa el color característico de su tipo primario
- **Estados de carga** — skeleton shimmer en la carga inicial, spinner en "cargar más"
- **Manejo de errores** — mensaje descriptivo con botón "Reintentar" si la API falla
- **Responsive** — grilla adaptable; 2 columnas en móvil (360 px), auto-fill en desktop (1280 px)

## Stack

| Herramienta | Uso |
|---|---|
| [React 19](https://react.dev/) | UI con componentes funcionales y hooks |
| [Vite 8](https://vite.dev/) | Build y dev server |
| CSS Modules | Estilos encapsulados por componente, sin librerías externas |
| [PokéAPI](https://pokeapi.co/) | Fuente de datos |

## Estructura

```
src/
├── components/
│   ├── FavoritesList.jsx   # Vista de favoritos guardados
│   ├── PokemonCard.jsx     # Card individual con sprite, tipos y botón ★
│   ├── PokemonDetail.jsx   # Modal de detalle con stats, habilidades y descripción
│   ├── PokemonList.jsx     # Grilla con scroll infinito y manejo de errores
│   └── SearchBar.jsx       # Input de búsqueda + dropdown de tipo + contador
├── hooks/
│   ├── useFavorites.js     # Estado de favoritos ↔ localStorage
│   ├── usePokemonDetail.js # Fetch de pokemon + species para el modal de detalle
│   ├── usePokemonList.js   # Fetch paginado con soporte de filtro por tipo
│   ├── usePokemonSearch.js # Búsqueda global con caché de nombres y debounce
│   └── useTypes.js         # Fetch de lista de tipos desde la PokéAPI
└── App.jsx                 # Orquestación de estado global y navegación
```

## Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/LucaGMB/pokedex.git
cd pokedex

# Instalar dependencias (se recomienda pnpm)
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Build de producción
pnpm build
```

La app queda disponible en `http://localhost:5173`.

## Colores por tipo

Cada card adopta el color oficial del tipo primario del pokémon:

| Tipo | Color | Tipo | Color |
|---|---|---|---|
| Fire | `#F08030` | Water | `#6890F0` |
| Grass | `#78C850` | Electric | `#F8D030` |
| Ice | `#98D8D8` | Fighting | `#C03028` |
| Poison | `#A040A0` | Ground | `#E0C068` |
| Flying | `#A890F0` | Psychic | `#F85888` |
| Bug | `#A8B820` | Rock | `#B8A038` |
| Ghost | `#705898` | Dragon | `#7038F8` |
| Dark | `#705848` | Steel | `#B8B8D0` |
| Fairy | `#EE99AC` | Normal | `#A8A878` |

## Nota

Este proyecto fue desarrollado como entrega para un curso obligatorio que tuve que realizar. La consigna requería interactuar con herramientas de IA para mejorar prompts de desarrollo. A fines prácticos y como ejercicio de automatización, todo el contenido de este repositorio (código y textos explicativos) fue generado 100% mediante modelos de lenguaje (LLMs), limitando mi intervención a la orquestación de la herramienta.

