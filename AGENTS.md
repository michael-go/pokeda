# Agent instructions

## Project

- Requires Node.js 22.13 or newer.
- Application code lives under `app/`.
- The production site is hosted on Vercel.

## Useful commands

- `npm install`: install dependencies.
- `npm run dev`: start local development.
- `npm run build`: verify the vinext build.
- `npm run build:vercel`: verify the Vercel production build.
- `npm test`: run the build and rendered HTML tests.
- `npm run pokemon:sync`: regenerate Pokémon data.

## Pokémon data

`npm run pokemon:sync` downloads and caches PokéAPI species data, combines it
with the reviewed Hebrew files under `translations/he/`, and writes the compact
catalog and on-demand detail files under `public/pokemon-data/`.

Use `npm run pokemon:sync -- --refresh` only when upstream PokéAPI data should
be fetched again instead of reusing the local cache.

Treat `public/pokemon-data/` as generated output. Make translation corrections
in `translations/he/`, then regenerate the data.
