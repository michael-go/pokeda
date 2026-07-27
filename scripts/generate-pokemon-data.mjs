import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

const apiRoot = "https://pokeapi.co/api/v2";
const cacheDirectory = new URL("../.cache/pokeapi/", import.meta.url);
const outputDirectory = new URL("../public/pokemon-data/", import.meta.url);
const translationFiles = [
  new URL("../translations/he/pokemon-curated.json", import.meta.url),
  new URL("../translations/he/pokemon-001-350.json", import.meta.url),
  new URL("../translations/he/pokemon-351-700.json", import.meta.url),
  new URL("../translations/he/pokemon-701-1025.json", import.meta.url),
];
const moveTranslationFiles = [
  new URL("../translations/he/moves-1.json", import.meta.url),
  new URL("../translations/he/moves-2.json", import.meta.url),
  new URL("../translations/he/moves-3.json", import.meta.url),
];
const refresh = process.argv.includes("--refresh");
const requestedConcurrency = Number.parseInt(process.env.POKEAPI_CONCURRENCY ?? "24", 10);
const concurrency = Number.isFinite(requestedConcurrency)
  ? Math.max(1, requestedConcurrency)
  : 24;

const hebrewTypeNames = {
  normal: "רגיל",
  fire: "אש",
  water: "מים",
  electric: "חשמל",
  grass: "עשב",
  ice: "קרח",
  fighting: "לחימה",
  poison: "רעל",
  ground: "אדמה",
  flying: "מעופף",
  psychic: "על־חושי",
  bug: "חרק",
  rock: "סלע",
  ghost: "רוח",
  dragon: "דרקון",
  dark: "אופל",
  steel: "פלדה",
  fairy: "פיה",
};

const specialDisplayNames = {
  farfetchd: "Farfetch’d",
  "ho-oh": "Ho-Oh",
  "mime-jr": "Mime Jr.",
  "mr-mime": "Mr. Mime",
  "mr-rime": "Mr. Rime",
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "porygon-z": "Porygon-Z",
  sirfetchd: "Sirfetch’d",
  "type-null": "Type: Null",
};

const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

async function readOptionalJson(url) {
  try {
    return JSON.parse(await readFile(url, "utf8"));
  } catch {
    return {};
  }
}

const cacheFileFor = (url) => {
  const key = createHash("sha256").update(url).digest("hex");
  return new URL(`${key}.json`, cacheDirectory);
};

async function fetchJson(url) {
  const cacheFile = cacheFileFor(url);

  if (!refresh) {
    try {
      return JSON.parse(await readFile(cacheFile, "utf8"));
    } catch {
      // Fetch missing or unreadable cache entries again.
    }
  }

  let lastError;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "Pokeda data generator (https://pokeda.vercel.app)",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const temporaryFile = new URL(`${cacheFile.href}.${process.pid}.${attempt}.tmp`);
      await writeFile(temporaryFile, JSON.stringify(data));
      await rename(temporaryFile, cacheFile);
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 4) {
        await sleep(400 * 2 ** (attempt - 1));
      }
    }
  }

  throw new Error(`Could not fetch ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

async function mapWithConcurrency(items, worker, label) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let completed = 0;

  const runWorker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
      completed += 1;

      if (completed % 100 === 0 || completed === items.length) {
        process.stdout.write(`\r${label}: ${completed}/${items.length}`);
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker()),
  );
  process.stdout.write("\n");
  return results;
}

const resourceId = (url) => Number.parseInt(url.match(/\/(\d+)\/?$/)?.[1] ?? "0", 10);

const cleanText = (value) =>
  value
    .replace(/[\n\f\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const displayName = (slug) =>
  specialDisplayNames[slug] ??
  slug
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");

const englishName = (species) =>
  species.names.find((entry) => entry.language.name === "en")?.name ??
  displayName(species.name);

const englishDescription = (species, name) => {
  const entries = species.flavor_text_entries
    .filter((entry) => entry.language.name === "en")
    .map((entry) => cleanText(entry.flavor_text))
    .filter(Boolean);

  return entries.at(-1) ?? `${name} is a Pokémon waiting to be discovered.`;
};

const hebrewDescription = (name, types) => {
  const labels = types.map((type) => hebrewTypeNames[type] ?? displayName(type));
  const typeText =
    labels.length > 1
      ? `${labels.slice(0, -1).join(", ")} ו${labels.at(-1)}`
      : labels[0] ?? "מיוחד";

  return `הכירו את ${name} — פוקימון מסוג ${typeText}. גלו את הכוחות ואת מסלול ההתפתחות שלו.`;
};

const flattenEvolutionChain = (link, species = []) => {
  species.push(link.species.name);
  for (const evolution of link.evolves_to) {
    flattenEvolutionChain(evolution, species);
  }
  return species;
};

const latestLevelUpMoves = (pokemon) => {
  let latestVersionGroup = 0;

  for (const entry of pokemon.moves) {
    for (const detail of entry.version_group_details) {
      if (detail.move_learn_method.name === "level-up") {
        latestVersionGroup = Math.max(latestVersionGroup, resourceId(detail.version_group.url));
      }
    }
  }

  const moves = pokemon.moves
    .flatMap((entry) =>
      entry.version_group_details
        .filter(
          (detail) =>
            detail.move_learn_method.name === "level-up" &&
            resourceId(detail.version_group.url) === latestVersionGroup,
        )
        .map((detail) => ({
          slug: entry.move.name,
          level: detail.level_learned_at,
          order: detail.order ?? Number.MAX_SAFE_INTEGER,
        })),
    )
    .sort((left, right) => left.level - right.level || left.order - right.order);

  const uniqueMoves = [...new Map(moves.map((move) => [move.slug, move])).values()];
  const fallbackMoves = pokemon.moves.map((entry) => entry.move.name);
  return (uniqueMoves.length ? uniqueMoves.map((move) => move.slug) : fallbackMoves).map(displayName);
};

await Promise.all([
  mkdir(cacheDirectory, { recursive: true }),
  mkdir(outputDirectory, { recursive: true }),
]);

const pokemonTranslations = Object.assign(
  {},
  ...(await Promise.all(translationFiles.map((file) => readOptionalJson(file)))),
);
const moveTranslations = Object.assign(
  {},
  ...(await Promise.all(moveTranslationFiles.map((file) => readOptionalJson(file)))),
);

const speciesList = await fetchJson(`${apiRoot}/pokemon-species?limit=2000`);
const speciesDetails = await mapWithConcurrency(
  speciesList.results,
  (species) => fetchJson(species.url),
  "Pokémon species",
);

const pokemonDetails = await mapWithConcurrency(
  speciesDetails,
  (species) => {
    const defaultVariety = species.varieties.find((variety) => variety.is_default);
    if (!defaultVariety) {
      throw new Error(`No default variety found for ${species.name}`);
    }
    return fetchJson(defaultVariety.pokemon.url);
  },
  "Pokémon details",
);

const evolutionUrls = [
  ...new Set(
    speciesDetails
      .map((species) => species.evolution_chain?.url)
      .filter((url) => typeof url === "string"),
  ),
];
const evolutionDetails = await mapWithConcurrency(
  evolutionUrls,
  (url) => fetchJson(url),
  "Evolution chains",
);
const evolutionChains = new Map(
  evolutionUrls.map((url, index) => [
    url,
    flattenEvolutionChain(evolutionDetails[index].chain),
  ]),
);

const pokemon = speciesDetails
  .map((species, index) => {
    const details = pokemonDetails[index];
    const name = englishName(species);
    const types = details.types
      .slice()
      .sort((left, right) => left.slot - right.slot)
      .map((entry) => entry.type.name);
    const powers = latestLevelUpMoves(details);
    const translation = pokemonTranslations[species.name];

    return {
      id: species.id,
      slug: species.name,
      name: { he: translation?.name ?? name, en: name },
      description: {
        he: translation?.description ?? hebrewDescription(name, types),
        en: englishDescription(species, name),
      },
      powers: {
        he: powers.map((power) => moveTranslations[power] ?? power),
        en: powers,
      },
      types,
      chain: evolutionChains.get(species.evolution_chain?.url) ?? [species.name],
    };
  })
  .sort((left, right) => left.id - right.id);

const ids = new Set(pokemon.map((entry) => entry.id));
const slugs = new Set(pokemon.map((entry) => entry.slug));
const missingEvolutionSpecies = pokemon.flatMap((entry) =>
  entry.chain.filter((slug) => !slugs.has(slug)).map((slug) => `${entry.slug}->${slug}`),
);
const missingProfileTranslations = pokemon
  .filter((entry) => !pokemonTranslations[entry.slug])
  .map((entry) => entry.slug);
const englishPowers = [...new Set(pokemon.flatMap((entry) => entry.powers.en))];
const missingMoveTranslations = englishPowers.filter(
  (power) => !moveTranslations[power],
);
const translationsWithLatinText = [
  ...Object.entries(pokemonTranslations)
    .filter(([, translation]) =>
      /[A-Za-z]/.test(`${translation.name} ${translation.description}`),
    )
    .map(([slug]) => `profile:${slug}`),
  ...Object.entries(moveTranslations)
    .filter(([, translation]) => /[A-Za-z]/.test(translation))
    .map(([power]) => `move:${power}`),
];

if (
  pokemon.length !== speciesList.count ||
  ids.size !== pokemon.length ||
  slugs.size !== pokemon.length ||
  missingEvolutionSpecies.length > 0 ||
  missingProfileTranslations.length > 0 ||
  missingMoveTranslations.length > 0 ||
  translationsWithLatinText.length > 0
) {
  throw new Error(
    `Generated data failed validation: ${JSON.stringify({
      apiCount: speciesList.count,
      generated: pokemon.length,
      uniqueIds: ids.size,
      uniqueSlugs: slugs.size,
      missingEvolutionSpecies,
      missingProfileTranslations,
      missingMoveTranslations,
      translationsWithLatinText,
    })}`,
  );
}

const catalog = pokemon.map(({ id, slug, name, types, chain }) => ({
  id,
  slug,
  name,
  types,
  chain,
}));

await writeFile(
  new URL("catalog.json", outputDirectory),
  `${JSON.stringify({ source: apiRoot, count: catalog.length, pokemon: catalog })}\n`,
);

for (let index = 0; index < pokemon.length; index += 100) {
  const chunk = pokemon.slice(index, index + 100);
  const chunkStart = chunk[0].id;
  const details = Object.fromEntries(
    chunk.map(({ slug, description, powers }) => [slug, { description, powers }]),
  );
  await writeFile(
    new URL(`details-${String(chunkStart).padStart(4, "0")}.json`, outputDirectory),
    `${JSON.stringify({ pokemon: details })}\n`,
  );
}

console.log(
  `Wrote ${pokemon.length} Pokémon with ${Object.keys(pokemonTranslations).length} profile translations and ${Object.keys(moveTranslations).length} move translations`,
);
