"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { morePokemon, type Pokemon, type PokemonType } from "./more-pokemon";

type Language = "he" | "en";
type PokemonCatalogEntry = Pick<Pokemon, "id" | "slug" | "name" | "types" | "chain">;
type PokemonDetails = Pick<Pokemon, "description" | "powers">;

const typeNames: Record<PokemonType, { he: string; en: string }> = {
  normal: { he: "רגיל", en: "Normal" },
  fire: { he: "אש", en: "Fire" },
  water: { he: "מים", en: "Water" },
  electric: { he: "חשמל", en: "Electric" },
  grass: { he: "עשב", en: "Grass" },
  ice: { he: "קרח", en: "Ice" },
  fighting: { he: "לחימה", en: "Fighting" },
  poison: { he: "רעל", en: "Poison" },
  ground: { he: "אדמה", en: "Ground" },
  flying: { he: "מעופף", en: "Flying" },
  psychic: { he: "על־חושי", en: "Psychic" },
  bug: { he: "חרק", en: "Bug" },
  rock: { he: "סלע", en: "Rock" },
  ghost: { he: "רוח", en: "Ghost" },
  dragon: { he: "דרקון", en: "Dragon" },
  dark: { he: "אופל", en: "Dark" },
  steel: { he: "פלדה", en: "Steel" },
  fairy: { he: "פיה", en: "Fairy" },
};

const curatedPokemon: Pokemon[] = [
  {
    id: 1,
    slug: "bulbasaur",
    name: { he: "בולבזאור", en: "Bulbasaur" },
    description: {
      he: "פוקימון קטן ואמיץ שנולד עם זרע על הגב. הוא אוהב לנמנם בשמש כדי שהצמח שלו יגדל.",
      en: "A brave little Pokémon born with a seed on its back. It loves sunny naps that help its plant grow.",
    },
    powers: { he: ["שוט גפן", "עלה תער", "אבקת שינה", "זרע עלוקה", "קרן שמש"], en: ["Vine Whip", "Razor Leaf", "Sleep Powder", "Leech Seed", "Solar Beam"] },
    types: ["grass", "poison"],
    chain: ["bulbasaur", "ivysaur", "venusaur"],
  },
  {
    id: 2,
    slug: "ivysaur",
    name: { he: "אייביזאור", en: "Ivysaur" },
    description: {
      he: "הניצן שעל גבו גדל ורגליו נעשו חזקות. כשהפרח עומד לפרוח, הוא מפיץ ריח מתוק.",
      en: "The bud on its back has grown and its legs are stronger. A sweet smell appears just before it blooms.",
    },
    powers: { he: ["קרן שמש", "שוט גפן", "ריח מתוק", "עלה תער", "צמיחה"], en: ["Solar Beam", "Vine Whip", "Sweet Scent", "Razor Leaf", "Growth"] },
    types: ["grass", "poison"],
    chain: ["bulbasaur", "ivysaur", "venusaur"],
  },
  {
    id: 3,
    slug: "venusaur",
    name: { he: "ונוזאור", en: "Venusaur" },
    description: {
      he: "הפרח הענק שלו אוסף אור שמש והופך אותו לאנרגיה. הוא יכול להרגיע אחרים בעזרת הריח שלו.",
      en: "Its huge flower gathers sunlight and turns it into energy. Its gentle scent can calm others.",
    },
    powers: { he: ["קרן שמש", "סערת עלים", "רעידת אדמה", "פצצת בוץ", "סינתזה"], en: ["Solar Beam", "Petal Blizzard", "Earthquake", "Sludge Bomb", "Synthesis"] },
    types: ["grass", "poison"],
    chain: ["bulbasaur", "ivysaur", "venusaur"],
  },
  {
    id: 4,
    slug: "charmander",
    name: { he: "צ׳רמנדר", en: "Charmander" },
    description: {
      he: "לטאת אש סקרנית עם להבה בקצה הזנב. כשהיא שמחה, הלהבה רוקדת ומנצנצת.",
      en: "A curious fire lizard with a flame on its tail. When it is happy, the flame dances and sparkles.",
    },
    powers: { he: ["גחלת", "שריטה", "מסך עשן", "נשימת דרקון", "ניב אש"], en: ["Ember", "Scratch", "Smokescreen", "Dragon Breath", "Fire Fang"] },
    types: ["fire"],
    chain: ["charmander", "charmeleon", "charizard"],
  },
  {
    id: 5,
    slug: "charmeleon",
    name: { he: "צ׳רמיליון", en: "Charmeleon" },
    description: {
      he: "פוקימון נמרץ שמתאמן בלי הפסקה. זנבו הבוער מאיר מערות חשוכות.",
      en: "An energetic Pokémon that never stops training. Its blazing tail lights up dark caves.",
    },
    powers: { he: ["ניב אש", "טפר דרקון", "להביור", "חיתוך", "פרצוף מפחיד"], en: ["Fire Fang", "Dragon Claw", "Flamethrower", "Slash", "Scary Face"] },
    types: ["fire"],
    chain: ["charmander", "charmeleon", "charizard"],
  },
  {
    id: 6,
    slug: "charizard",
    name: { he: "צ׳ריזארד", en: "Charizard" },
    description: {
      he: "דרקון אש עוצמתי שאוהב לעוף גבוה. הוא שומר את הלהבות החמות ביותר ליריבים חזקים.",
      en: "A powerful fire flyer that loves soaring high. It saves its hottest flames for strong opponents.",
    },
    powers: { he: ["להביור", "טופר דרקון", "טיסה", "סחרור אש", "חיתוך אווירי", "תופת"], en: ["Flamethrower", "Dragon Claw", "Fly", "Fire Spin", "Air Slash", "Inferno"] },
    types: ["fire", "flying"],
    chain: ["charmander", "charmeleon", "charizard"],
  },
  {
    id: 7,
    slug: "squirtle",
    name: { he: "סקווירטל", en: "Squirtle" },
    description: {
      he: "צבון שובב שמסתתר בשריון החזק שלו. הוא יורה מים בדיוק מפתיע.",
      en: "A playful turtle that hides inside its strong shell. It sprays water with surprising accuracy.",
    },
    powers: { he: ["אקדח מים", "סיבוב מהיר", "בועות", "נשיכה", "התכנסות בשריון"], en: ["Water Gun", "Rapid Spin", "Bubble", "Bite", "Withdraw"] },
    types: ["water"],
    chain: ["squirtle", "wartortle", "blastoise"],
  },
  {
    id: 8,
    slug: "wartortle",
    name: { he: "וורטורטל", en: "Wartortle" },
    description: {
      he: "שחיין מהיר שמאזן את עצמו בעזרת הזנב הרך. השריון שלו נעשה חזק יותר עם השנים.",
      en: "A speedy swimmer that balances with its fluffy tail. Its shell becomes tougher as it grows.",
    },
    powers: { he: ["זנב מים", "גלישה", "התכנסות בשריון", "פעימת מים", "נשיכה"], en: ["Aqua Tail", "Surf", "Withdraw", "Water Pulse", "Bite"] },
    types: ["water"],
    chain: ["squirtle", "wartortle", "blastoise"],
  },
  {
    id: 9,
    slug: "blastoise",
    name: { he: "בלסטויז", en: "Blastoise" },
    description: {
      he: "תותחי המים שבשריון שלו חזקים ומדויקים. הוא עומד יציב גם מול גלים ענקיים.",
      en: "The water cannons in its shell are powerful and precise. It stands firm even against giant waves.",
    },
    powers: { he: ["הידרו פאמפ", "תותח הידרו", "סופת שלג", "נגיחת גולגולת", "תותח הבזק", "גלישה"], en: ["Hydro Pump", "Hydro Cannon", "Blizzard", "Skull Bash", "Flash Cannon", "Surf"] },
    types: ["water"],
    chain: ["squirtle", "wartortle", "blastoise"],
  },
  {
    id: 172,
    slug: "pichu",
    name: { he: "פיצ׳ו", en: "Pichu" },
    description: {
      he: "פוקימון תינוק מלא אנרגיה. הוא עדיין לומד לשלוט בניצוצות שיוצאים מלחייו.",
      en: "A tiny Pokémon bursting with energy. It is still learning to control the sparks from its cheeks.",
    },
    powers: { he: ["הלם רעם", "קסם", "מתקפה מהירה", "נשיקה מתוקה", "ליטוף חשמלי"], en: ["Thunder Shock", "Charm", "Quick Attack", "Sweet Kiss", "Nuzzle"] },
    types: ["electric"],
    chain: ["pichu", "pikachu", "raichu"],
  },
  {
    id: 25,
    slug: "pikachu",
    name: { he: "פיקאצ׳ו", en: "Pikachu" },
    description: {
      he: "עכבר חשמלי חברותי שאוגר חשמל בלחיים. כשהוא מתרגש, ניצוצות קטנים קופצים סביבו.",
      en: "A friendly electric mouse that stores power in its cheeks. Tiny sparks jump when it gets excited.",
    },
    powers: { he: ["מכת ברק", "זנב ברזל", "מתקפה מהירה", "כדור חשמלי", "הסתערות וולט", "גל רעם"], en: ["Thunderbolt", "Iron Tail", "Quick Attack", "Electro Ball", "Volt Tackle", "Thunder Wave"] },
    types: ["electric"],
    chain: ["pichu", "pikachu", "raichu"],
  },
  {
    id: 26,
    slug: "raichu",
    name: { he: "ראיצ׳ו", en: "Raichu" },
    description: {
      he: "זנבו הארוך עוזר לו לפרוק חשמל עודף. הוא יכול להאיר חדר שלם בניצוץ אחד.",
      en: "Its long tail helps release extra electricity. One bright spark can light an entire room.",
    },
    powers: { he: ["רעם", "הסתערות וולט", "גל הלם", "פריקה", "שבירת לבנים", "שדה חשמלי"], en: ["Thunder", "Volt Tackle", "Shock Wave", "Discharge", "Brick Break", "Electric Terrain"] },
    types: ["electric"],
    chain: ["pichu", "pikachu", "raichu"],
  },
  {
    id: 133,
    slug: "eevee",
    name: { he: "איווי", en: "Eevee" },
    description: {
      he: "פוקימון סקרן שיכול להתפתח בדרכים רבות. הוא מסתגל בקלות לכל מקום ולכל חבר חדש.",
      en: "A curious Pokémon that can evolve in many ways. It adapts easily to new places and new friends.",
    },
    powers: { he: ["מתקפה מהירה", "נשיכה", "עיניים מתוקות", "כוכבים מהירים", "מתקפה כפולת־קצה"], en: ["Quick Attack", "Bite", "Baby-Doll Eyes", "Swift", "Double-Edge"] },
    types: ["normal"],
    chain: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
  },
  {
    id: 134,
    slug: "vaporeon",
    name: { he: "ופוריאון", en: "Vaporeon" },
    description: {
      he: "התפתחות המים של איווי. הסנפירים והזנב שלה הופכים אותה לשחיינית נהדרת.",
      en: "Eevee’s water evolution. Its fins and tail make it a wonderful swimmer.",
    },
    powers: { he: ["פעימת מים", "גלישה", "קרן קפואה", "הידרו פאמפ", "טבעת מים"], en: ["Water Pulse", "Surf", "Aurora Beam", "Hydro Pump", "Aqua Ring"] },
    types: ["water"],
    chain: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
  },
  {
    id: 135,
    slug: "jolteon",
    name: { he: "ג׳ולטיאון", en: "Jolteon" },
    description: {
      he: "התפתחות החשמל המהירה של איווי. הפרווה הקוצנית שלו נטענת באנרגיה.",
      en: "Eevee’s speedy electric evolution. Its spiky fur crackles with energy.",
    },
    powers: { he: ["מכת ברק", "כדור חשמלי", "זריזות", "טילי סיכה", "גל רעם"], en: ["Thunderbolt", "Electro Ball", "Agility", "Pin Missile", "Thunder Wave"] },
    types: ["electric"],
    chain: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
  },
  {
    id: 136,
    slug: "flareon",
    name: { he: "פלריאון", en: "Flareon" },
    description: {
      he: "התפתחות האש החמימה של איווי. הפרווה הרכה שלו משחררת חום חזק.",
      en: "Eevee’s warm fire evolution. Its soft fur releases powerful heat.",
    },
    powers: { he: ["ניב אש", "להביור", "זנב ברזל", "סחרור אש", "הסתערות אש"], en: ["Fire Fang", "Flamethrower", "Iron Tail", "Fire Spin", "Flare Blitz"] },
    types: ["fire"],
    chain: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
  },
  {
    id: 10,
    slug: "caterpie",
    name: { he: "קטרפי", en: "Caterpie" },
    description: {
      he: "זחל קטן שאוכל הרבה עלים כדי לגדול. המחושים שלו עוזרים להרחיק אויבים.",
      en: "A tiny caterpillar that eats lots of leaves to grow. Its antenna helps keep danger away.",
    },
    powers: { he: ["יריית קורים", "התנגשות", "נשיכת חרק", "רשת חשמל"], en: ["String Shot", "Tackle", "Bug Bite", "Electroweb"] },
    types: ["bug"],
    chain: ["caterpie", "metapod", "butterfree"],
  },
  {
    id: 11,
    slug: "metapod",
    name: { he: "מטפוד", en: "Metapod" },
    description: {
      he: "הקליפה הקשה מגינה עליו בזמן שהוא משתנה בפנים ומתכונן לעוף.",
      en: "Its hard shell keeps it safe while it changes inside and prepares to fly.",
    },
    powers: { he: ["הקשחה", "הגנת ברזל", "נשיכת חרק"], en: ["Harden", "Iron Defense", "Bug Bite"] },
    types: ["bug"],
    chain: ["caterpie", "metapod", "butterfree"],
  },
  {
    id: 12,
    slug: "butterfree",
    name: { he: "בטרפרי", en: "Butterfree" },
    description: {
      he: "כנפיו מכוסות אבקה צבעונית. הוא עף מפרח לפרח ואוסף צוף מתוק.",
      en: "Its wings are covered in colorful powder. It flies from flower to flower gathering sweet nectar.",
    },
    powers: { he: ["רוח כסופה", "אבקת שינה", "בלבול", "משב רוח", "קרן על־חושית", "מערבולת"], en: ["Silver Wind", "Sleep Powder", "Confusion", "Gust", "Psybeam", "Whirlwind"] },
    types: ["bug", "flying"],
    chain: ["caterpie", "metapod", "butterfree"],
  },
  {
    id: 43,
    slug: "oddish",
    name: { he: "אודיש", en: "Oddish" },
    description: {
      he: "בלילה הוא יוצא לטייל לאור הירח. ביום הוא מתחבא באדמה ומשאיר רק את העלים בחוץ.",
      en: "It wanders under the moon at night. By day, it hides underground with only its leaves showing.",
    },
    powers: { he: ["ספיגה", "אבקת רעל", "ריקוד עלי כותרת", "חומצה", "אבקת שינה", "קרן ירח"], en: ["Absorb", "Poison Powder", "Petal Dance", "Acid", "Sleep Powder", "Moonlight"] },
    types: ["grass", "poison"],
    chain: ["oddish", "gloom", "vileplume"],
  },
  {
    id: 44,
    slug: "gloom",
    name: { he: "גלום", en: "Gloom" },
    description: {
      he: "הפרח שעל ראשו מפיץ ריח חזק. כשגלום מרגיש בטוח, הוא פותח את עלי הכותרת שלו.",
      en: "The flower on its head has a powerful scent. When Gloom feels safe, it opens its petals.",
    },
    powers: { he: ["ריח מתוק", "חומצה", "קרן ירח", "ניקוז ענק", "אבקת שיתוק"], en: ["Sweet Scent", "Acid", "Moonlight", "Mega Drain", "Stun Spore"] },
    types: ["grass", "poison"],
    chain: ["oddish", "gloom", "vileplume"],
  },
  {
    id: 45,
    slug: "vileplume",
    name: { he: "ויילפלום", en: "Vileplume" },
    description: {
      he: "הפרח הענק שלו מפזר אבקה צבעונית ברוח. הוא אוהב מקומות חמימים ומוארים.",
      en: "Its giant flower scatters colorful pollen on the breeze. It loves warm, sunny places.",
    },
    powers: { he: ["סערת עלים", "קרן שמש", "אבקת שינה", "פצצת בוץ", "ארומתרפיה"], en: ["Petal Blizzard", "Solar Beam", "Sleep Powder", "Sludge Bomb", "Aromatherapy"] },
    types: ["grass", "poison"],
    chain: ["oddish", "gloom", "vileplume"],
  },
  {
    id: 37,
    slug: "vulpix",
    name: { he: "וולפיקס", en: "Vulpix" },
    description: {
      he: "שועל אש קטן עם זנבות מסולסלים. הוא שולט בלהבות קטנות שנראות כמו אורות מרקדים.",
      en: "A little fire fox with curled tails. It controls tiny flames that look like dancing lights.",
    },
    powers: { he: ["גחלת", "אש רצון", "מתקפה מהירה", "סחרור אש", "קרן בלבול", "כישוף"], en: ["Ember", "Will-O-Wisp", "Quick Attack", "Fire Spin", "Confuse Ray", "Hex"] },
    types: ["fire"],
    chain: ["vulpix", "ninetales"],
  },
  {
    id: 38,
    slug: "ninetales",
    name: { he: "ניינטיילס", en: "Ninetales" },
    description: {
      he: "פוקימון אש חכם ואלגנטי בעל תשעה זנבות. הוא נע בשקט ושומר על חבריו.",
      en: "A wise and graceful fire Pokémon with nine tails. It moves quietly and protects its friends.",
    },
    powers: { he: ["להביור", "סחרור אש", "כוח על־חושי", "אש רצון", "תופת", "מתקפה מהירה"], en: ["Flamethrower", "Fire Spin", "Extrasensory", "Will-O-Wisp", "Inferno", "Quick Attack"] },
    types: ["fire"],
    chain: ["vulpix", "ninetales"],
  },
  {
    id: 58,
    slug: "growlithe",
    name: { he: "גרולית׳", en: "Growlithe" },
    description: {
      he: "כלבלב אש נאמן ואמיץ. חוש הריח המצוין שלו עוזר לו למצוא חברים גם מרחוק.",
      en: "A loyal and brave fire pup. Its excellent nose helps it find friends from far away.",
    },
    powers: { he: ["ניב אש", "נהמה", "זריזות", "גלגל אש", "נשיכה", "הפלה"], en: ["Fire Fang", "Roar", "Agility", "Flame Wheel", "Bite", "Take Down"] },
    types: ["fire"],
    chain: ["growlithe", "arcanine"],
  },
  {
    id: 59,
    slug: "arcanine",
    name: { he: "ארקניין", en: "Arcanine" },
    description: {
      he: "פוקימון מהיר ואצילי שיכול לרוץ למרחקים עצומים. הפרווה שלו מתנופפת כמו אש.",
      en: "A fast and noble Pokémon that can run enormous distances. Its flowing fur looks like fire.",
    },
    powers: { he: ["מהירות קיצונית", "להביור", "הסתערות פראית", "ניב אש", "נשיכת מחץ", "הסתערות אש"], en: ["Extreme Speed", "Flamethrower", "Wild Charge", "Fire Fang", "Crunch", "Flare Blitz"] },
    types: ["fire"],
    chain: ["growlithe", "arcanine"],
  },
  {
    id: 54,
    slug: "psyduck",
    name: { he: "פסיידאק", en: "Psyduck" },
    description: {
      he: "ברווז מבולבל וחמוד שמחזיק את הראש כשהכוחות שלו מתחזקים. לפעמים הוא מפתיע את כולם.",
      en: "A cute, puzzled duck that holds its head when its powers grow. It often surprises everyone.",
    },
    powers: { he: ["אקדח מים", "בלבול", "שריטה", "נטרול", "נגיחת זן", "זנב מים"], en: ["Water Gun", "Confusion", "Scratch", "Disable", "Zen Headbutt", "Aqua Tail"] },
    types: ["water"],
    chain: ["psyduck", "golduck"],
  },
  {
    id: 55,
    slug: "golduck",
    name: { he: "גולדאק", en: "Golduck" },
    description: {
      he: "שחיין מעולה שחוצה אגמים במהירות. היהלום שעל מצחו זוהר כשהוא משתמש בכוחותיו.",
      en: "An expert swimmer that races across lakes. The gem on its forehead glows when it uses its powers.",
    },
    powers: { he: ["גלישה", "פעימת מים", "כוח על־חושי", "סילון מים", "הידרו פאמפ", "בלבול"], en: ["Surf", "Water Pulse", "Psychic", "Aqua Jet", "Hydro Pump", "Confusion"] },
    types: ["water"],
    chain: ["psyduck", "golduck"],
  },
  {
    id: 52,
    slug: "meowth",
    name: { he: "מיאו", en: "Meowth" },
    description: {
      he: "חתול סקרן שאוהב דברים נוצצים. הוא מטייל בלילה ומחפש אוצרות קטנים.",
      en: "A curious cat that loves shiny things. It wanders at night looking for tiny treasures.",
    },
    powers: { he: ["יום תשלום", "שריטה", "נשיכה", "שריטות זעם", "הטעיה", "חתך לילה"], en: ["Pay Day", "Scratch", "Bite", "Fury Swipes", "Feint", "Night Slash"] },
    types: ["normal"],
    chain: ["meowth", "persian"],
  },
  {
    id: 53,
    slug: "persian",
    name: { he: "פרסיאן", en: "Persian" },
    description: {
      he: "חתול מהיר ואלגנטי שנע בצעדים שקטים. האבן שעל מצחו בוהקת באור.",
      en: "A fast and elegant cat that moves with silent steps. The jewel on its forehead shines in the light.",
    },
    powers: { he: ["חתך לילה", "כוח פנינה", "כוכבים מהירים", "חיתוך", "הפתעה", "משחק קשוח"], en: ["Night Slash", "Power Gem", "Swift", "Slash", "Fake Out", "Play Rough"] },
    types: ["normal"],
    chain: ["meowth", "persian"],
  },
  {
    id: 81,
    slug: "magnemite",
    name: { he: "מגנמייט", en: "Magnemite" },
    description: {
      he: "פוקימון מתכתי שמרחף בעזרת כוח מגנטי. הוא נטען כשהוא נמצא ליד חשמל.",
      en: "A metallic Pokémon that floats using magnetism. It charges up whenever electricity is nearby.",
    },
    powers: { he: ["הלם רעם", "גל מגנטי", "פצצת מראה", "ניצוץ", "על־קולי", "תותח הבזק"], en: ["Thunder Shock", "Magnet Rise", "Mirror Shot", "Spark", "Supersonic", "Flash Cannon"] },
    types: ["electric"],
    chain: ["magnemite", "magneton"],
  },
  {
    id: 82,
    slug: "magneton",
    name: { he: "מגנטון", en: "Magneton" },
    description: {
      he: "שלושה מגנמייטים שהתחברו לכוח מגנטי חזק. יחד הם יוצרים חשמל רב.",
      en: "Three Magnemite joined by powerful magnetism. Together, they create lots of electricity.",
    },
    powers: { he: ["תותח הבזק", "מכת ברק", "שדה חשמלי", "מתקפה משולשת", "פריקה", "גל מגנטי"], en: ["Flash Cannon", "Thunderbolt", "Electric Terrain", "Tri Attack", "Discharge", "Magnet Rise"] },
    types: ["electric"],
    chain: ["magnemite", "magneton"],
  },
  {
    id: 446,
    slug: "munchlax",
    name: { he: "מאנצ׳לאקס", en: "Munchlax" },
    description: {
      he: "פוקימון קטן עם תיאבון ענק. הוא שומר חטיפים בפרווה כדי שיוכל לאכול אחר כך.",
      en: "A little Pokémon with a giant appetite. It hides snacks in its fur to eat later.",
    },
    powers: { he: ["התנגשות", "ליקוק", "מטרונום", "אגירה", "חבטת גוף", "מוצא אחרון"], en: ["Tackle", "Lick", "Metronome", "Stockpile", "Body Slam", "Last Resort"] },
    types: ["normal"],
    chain: ["munchlax", "snorlax"],
  },
  {
    id: 143,
    slug: "snorlax",
    name: { he: "סנורלאקס", en: "Snorlax" },
    description: {
      he: "ענק עדין שאוהב לאכול ולישון. כשהוא מתעורר, יש לו כוח מפתיע ואופי רגוע.",
      en: "A gentle giant that loves eating and sleeping. When awake, it has surprising strength and a calm nature.",
    },
    powers: { he: ["מנוחה", "חבטת גוף", "נחירה", "קרן על", "נשיכת מחץ", "חבטה כבדה"], en: ["Rest", "Body Slam", "Snore", "Hyper Beam", "Crunch", "Heavy Slam"] },
    types: ["normal"],
    chain: ["munchlax", "snorlax"],
  },
  ...morePokemon,
];

export const pokemon = curatedPokemon;
const curatedDetails: Record<string, PokemonDetails> = Object.fromEntries(
  pokemon.map((item) => [
    item.slug,
    { description: item.description, powers: item.powers },
  ]),
);

const ui = {
  he: {
    title: "פוקדע",
    eyebrow: "הפוקדקס שלי",
    search: "חיפוש לפי שם...",
    all: "הכול",
    discover: "הפתעה!",
    results: "פוקימונים",
    about: "מי אני?",
    powers: "הכוחות שלי",
    evolution: "מסלול ההתפתחות",
    empty: "אופס! עוד לא מצאנו פוקימון כזה.",
    emptyHelp: "נסו שם אחר או בחרו סוג חדש.",
    language: "English",
    tap: "לחצו כדי להכיר",
    branchNote: "לאיווי יש כמה אפשרויות התפתחות!",
    sound: "איך אני נשמע?",
    stopSound: "עצרו את הצליל",
    soundError: "אופס, הצליל לא זמין כרגע.",
    opened: "כבר גילית את הפוקימון הזה",
    loadingMore: "טוענים עוד פוקימונים...",
    moreLoaded: "נוספו עוד {count} פוקימונים!",
    filterByType: "סינון הגלריה לפי {type}",
    loadingProfile: "טוענים את הפרטים...",
    profileError: "אופס, לא הצלחנו לטעון את הפרטים כרגע.",
  },
  en: {
    title: "Pokeda",
    eyebrow: "My Pokédex",
    search: "Search by name...",
    all: "All",
    discover: "Surprise me!",
    results: "Pokémon",
    about: "Meet me",
    powers: "My main powers",
    evolution: "Evolution journey",
    empty: "Oops! We couldn’t find that Pokémon.",
    emptyHelp: "Try another name or choose a new type.",
    language: "עברית",
    tap: "Tap to meet",
    branchNote: "Eevee has several evolution choices!",
    sound: "Hear my sound",
    stopSound: "Stop sound",
    soundError: "Oops, this sound is unavailable right now.",
    opened: "You already explored this Pokémon",
    loadingMore: "Loading more Pokémon...",
    moreLoaded: "{count} more Pokémon added!",
    filterByType: "Filter the gallery by {type}",
    loadingProfile: "Loading this profile...",
    profileError: "Oops, we couldn’t load these details right now.",
  },
} as const;

const openedPokemonStorageKey = "pokeda.openedPokemon.v1";
const pokemonBatchSize = 60;

const filters: Array<PokemonType | "all"> = [
  "all",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "fighting",
  "dragon",
  "fairy",
  "ghost",
  "dark",
  "ice",
  "ground",
  "rock",
  "steel",
  "flying",
  "poison",
  "bug",
  "normal",
];

const artUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const cryUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

const detailsUrl = (id: number) => {
  const chunkStart = Math.floor((id - 1) / 100) * 100 + 1;
  return `/pokemon-data/details-${String(chunkStart).padStart(4, "0")}.json`;
};

function Pokeball({ small = false }: { small?: boolean }) {
  return <span className={`pokeball ${small ? "pokeball--small" : ""}`} aria-hidden="true" />;
}

function ProgressivePokemonImage({
  id,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  artworkDelay = 450,
}: {
  id: number;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "eager" | "lazy";
  artworkDelay?: number;
}) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loadedArtworkId, setLoadedArtworkId] = useState<number | null>(null);
  const showArtwork = loadedArtworkId === id;

  useEffect(() => {
    let active = true;
    let loadTimer: number | undefined;
    let observer: IntersectionObserver | undefined;
    let artwork: HTMLImageElement | undefined;

    const preloadArtwork = () => {
      artwork = new Image();
      artwork.decoding = "async";
      artwork.fetchPriority = loading === "eager" ? "high" : "low";
      artwork.onload = () => {
        const reveal = () => {
          if (active) {
            setLoadedArtworkId(id);
          }
        };

        void artwork?.decode().catch(() => undefined).then(reveal);
      };
      artwork.src = artUrl(id);
    };

    const scheduleArtwork = () => {
      if (artworkDelay <= 0) {
        preloadArtwork();
        return;
      }

      loadTimer = window.setTimeout(preloadArtwork, artworkDelay);
    };

    if (imageRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            scheduleArtwork();
          }
        },
        { rootMargin: "180px" },
      );
      observer.observe(imageRef.current);
    } else {
      scheduleArtwork();
    }

    return () => {
      active = false;
      observer?.disconnect();
      if (loadTimer !== undefined) {
        window.clearTimeout(loadTimer);
      }
      if (artwork) {
        artwork.onload = null;
      }
    };
  }, [artworkDelay, id, loading]);

  return (
    <img
      key={id}
      ref={imageRef}
      className={`${className ? `${className} ` : ""}progressive-pokemon-image ${showArtwork ? "is-enhanced" : ""}`}
      src={showArtwork ? artUrl(id) : spriteUrl(id)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
    />
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("he");
  const [selectedSlug, setSelectedSlug] = useState("pikachu");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PokemonType | "all">("all");
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);
  const [soundError, setSoundError] = useState(false);
  const [openedSlugs, setOpenedSlugs] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(pokemonBatchSize);
  const [newPokemonBatch, setNewPokemonBatch] = useState<{
    start: number;
    count: number;
  } | null>(null);
  const [catalog, setCatalog] = useState<PokemonCatalogEntry[]>(pokemon);
  const [detailsBySlug, setDetailsBySlug] =
    useState<Record<string, PokemonDetails>>(curatedDetails);
  const [profileErrorSlug, setProfileErrorSlug] = useState<string | null>(null);
  const [showFilterScrollHint, setShowFilterScrollHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filterRowRef = useRef<HTMLDivElement | null>(null);
  const filterEndRef = useRef<HTMLButtonElement | null>(null);
  const pokemonGridRef = useRef<HTMLDivElement | null>(null);
  const firstNewPokemonRef = useRef<HTMLButtonElement | null>(null);
  const pokemonGridEndRef = useRef<HTMLDivElement | null>(null);
  const t = ui[language];
  const selected = catalog.find((item) => item.slug === selectedSlug) ?? catalog[0];
  const selectedDetails = detailsBySlug[selected.slug];
  const direction = language === "he" ? "rtl" : "ltr";

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.filter((item) => {
      const matchesType = filter === "all" || item.types.includes(filter);
      const matchesQuery =
        !normalized ||
        item.name.he.includes(normalized) ||
        item.name.en.toLowerCase().includes(normalized) ||
        String(item.id).includes(normalized);
      return matchesType && matchesQuery;
    });
  }, [catalog, filter, query]);
  const visiblePokemon = filtered.slice(0, visibleCount);

  const chain = selected.chain
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter((item): item is PokemonCatalogEntry => Boolean(item));

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (!newPokemonBatch) {
      return;
    }

    const grid = pokemonGridRef.current;
    const firstNewPokemon = firstNewPokemonRef.current;

    if (!grid || !firstNewPokemon) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      grid.scrollTo({
        top: Math.max(0, firstNewPokemon.offsetTop - 4),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [newPokemonBatch]);

  useEffect(() => {
    const grid = pokemonGridRef.current;
    const gridEnd = pokemonGridEndRef.current;
    const start = visiblePokemon.length;
    const count = Math.min(pokemonBatchSize, filtered.length - start);

    if (!grid || !gridEnd || count <= 0) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        setNewPokemonBatch({ start, count });
        setVisibleCount(start + count);
      },
      {
        root: grid,
        rootMargin: "0px 0px 100px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(gridEnd);
    return () => observer.disconnect();
  }, [filtered.length, visiblePokemon.length]);

  useEffect(() => {
    const row = filterRowRef.current;
    const finalFilter = filterEndRef.current;

    if (!row || !finalFilter || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowFilterScrollHint(!entry.isIntersecting),
      { root: row, threshold: 0.98 },
    );

    observer.observe(finalFilter);
    return () => observer.disconnect();
  }, [language]);

  useEffect(() => {
    let cancelled = false;

    void fetch("/pokemon-data/catalog.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load Pokémon data (${response.status})`);
        }
        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        if (
          cancelled ||
          !payload ||
          typeof payload !== "object" ||
          !("pokemon" in payload) ||
          !Array.isArray(payload.pokemon)
        ) {
          return;
        }

        const generatedPokemon = payload.pokemon as PokemonCatalogEntry[];
        const combined = [
          ...new Map(
            [...generatedPokemon, ...pokemon].map((item) => [item.slug, item]),
          ).values(),
        ].sort((left, right) => left.id - right.id);
        setCatalog(combined);
      })
      .catch(() => {
        // The curated catalog remains available if the generated file cannot load.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (detailsBySlug[selected.slug]) {
      return;
    }

    const controller = new AbortController();
    setProfileErrorSlug(null);

    void fetch(detailsUrl(selected.id), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load Pokémon details (${response.status})`);
        }
        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        if (
          !payload ||
          typeof payload !== "object" ||
          !("pokemon" in payload) ||
          !payload.pokemon ||
          typeof payload.pokemon !== "object"
        ) {
          return;
        }

        setDetailsBySlug((current) => ({
          ...(payload.pokemon as Record<string, PokemonDetails>),
          ...current,
        }));
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setProfileErrorSlug(selected.slug);
        }
      });

    return () => controller.abort();
  }, [detailsBySlug, selected.id, selected.slug]);

  useEffect(() => {
    let savedSlugs: string[] = [];

    try {
      const savedValue: unknown = JSON.parse(window.localStorage.getItem(openedPokemonStorageKey) ?? "[]");
      if (Array.isArray(savedValue)) {
        savedSlugs = savedValue.filter(
          (slug): slug is string => typeof slug === "string",
        );
      }
    } catch {
      savedSlugs = [];
    }

    setOpenedSlugs((current) => {
      const next = [...new Set([...savedSlugs, ...current, selectedSlug])];
      try {
        window.localStorage.setItem(openedPokemonStorageKey, JSON.stringify(next));
      } catch {
        // Progress still works for this visit when browser storage is unavailable.
      }
      return next;
    });
  }, [selectedSlug]);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingSlug(null);
  };

  const playSound = () => {
    if (playingSlug === selected.slug) {
      stopSound();
      return;
    }

    stopSound();
    setSoundError(false);

    const audio = new Audio(cryUrl(selected.id));
    audio.preload = "none";
    audio.volume = 0.65;
    audioRef.current = audio;
    audio.onplay = () => setPlayingSlug(selected.slug);
    audio.onended = () => {
      audioRef.current = null;
      setPlayingSlug(null);
    };
    audio.onerror = () => {
      audioRef.current = null;
      setPlayingSlug(null);
      setSoundError(true);
    };
    void audio.play().catch(() => {
      audioRef.current = null;
      setPlayingSlug(null);
      setSoundError(true);
    });
  };

  const choosePokemon = (slug: string) => {
    stopSound();
    setSoundError(false);
    setSelectedSlug(slug);
    if (window.innerWidth < 850) {
      requestAnimationFrame(() => document.querySelector(".detail-card")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const surprise = () => {
    const pool = filtered.length ? filtered : catalog;
    const next = pool[Math.floor(Math.random() * pool.length)];
    choosePokemon(next.slug);
  };

  const applyTypeFilter = (type: PokemonType) => {
    setFilter(type);
    setVisibleCount(pokemonBatchSize);
    setNewPokemonBatch(null);

    if (window.innerWidth < 850) {
      requestAnimationFrame(() =>
        document
          .querySelector(".explorer-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  };

  return (
    <main className={`app type-bg--${selected.types[0]}`} dir={direction}>
      <div className="background-orb background-orb--one" />
      <div className="background-orb background-orb--two" />

      <header className="topbar">
        <div className="brand">
          <Pokeball />
          <div>
            <span className="brand__eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
          </div>
        </div>

        <button
          className="language-switch"
          type="button"
          onClick={() => setLanguage(language === "he" ? "en" : "he")}
          aria-label={language === "he" ? "Switch to English" : "מעבר לעברית"}
        >
          <span aria-hidden="true">🌐</span>
          <span className="language-code">{language === "he" ? "EN" : "עב"}</span>
        </button>
      </header>

      <div className="workspace">
        <section className="detail-card" aria-live="polite">
          <div className="hero-panel">
            <div className="pokemon-number">#{String(selected.id).padStart(3, "0")}</div>
            <div className="hero-sparkle hero-sparkle--one" aria-hidden="true">✦</div>
            <div className="hero-sparkle hero-sparkle--two" aria-hidden="true">✧</div>
            <div className="hero-ring" aria-hidden="true" />
            <ProgressivePokemonImage
              key={selected.id}
              className="hero-image"
              id={selected.id}
              alt={selected.name[language]}
              width={380}
              height={380}
              loading="eager"
              artworkDelay={0}
            />
            <div className="hero-shadow" aria-hidden="true" />
          </div>

          <div className="detail-content">
            <div className="title-row">
              <div>
                <div className="type-row">
                  {selected.types.map((type) => (
                    <button
                      className={`type-chip type-chip--${type}`}
                      type="button"
                      key={type}
                      onClick={() => applyTypeFilter(type)}
                      aria-pressed={filter === type}
                      aria-label={t.filterByType.replace(
                        "{type}",
                        typeNames[type][language],
                      )}
                    >
                      <span className="type-dot" aria-hidden="true" />
                      {typeNames[type][language]}
                    </button>
                  ))}
                </div>
                <h2>{selected.name[language]}</h2>
                <span className="english-name">{selected.name.en}</span>
              </div>
              <div className="profile-actions">
                <button
                  className={`sound-button ${playingSlug === selected.slug ? "is-playing" : ""}`}
                  type="button"
                  onClick={playSound}
                  aria-pressed={playingSlug === selected.slug}
                  aria-label={playingSlug === selected.slug ? t.stopSound : t.sound}
                  title={playingSlug === selected.slug ? t.stopSound : t.sound}
                >
                  <span aria-hidden="true">🔊</span>
                </button>
                {soundError ? <small className="sound-error" role="status">{t.soundError}</small> : null}
              </div>
            </div>

            <div className="about-block">
              <h3><span aria-hidden="true">👋</span>{t.about}</h3>
              <p className={!selectedDetails ? "profile-loading" : undefined}>
                {selectedDetails?.description[language] ??
                  (profileErrorSlug === selected.slug ? t.profileError : t.loadingProfile)}
              </p>
            </div>

            <div className="powers-block">
              <h3><span aria-hidden="true">⚡</span>{t.powers}</h3>
              <div className="power-list">
                {selectedDetails ? (
                  selectedDetails.powers[language].map((power, index) => (
                    <span key={power} style={{ "--power-index": index } as React.CSSProperties}>
                      <i aria-hidden="true">{index + 1}</i>
                      {power}
                    </span>
                  ))
                ) : (
                  <span className="profile-loading">
                    {profileErrorSlug === selected.slug ? t.profileError : t.loadingProfile}
                  </span>
                )}
              </div>
            </div>

            <div className="evolution-block">
              <div className="section-title">
                <h3><span aria-hidden="true">✨</span>{t.evolution}</h3>
                {selected.slug === "eevee" || selected.chain.includes("eevee") ? <small>{t.branchNote}</small> : null}
              </div>
              <div className={`evolution-chain ${chain.length > 3 ? "evolution-chain--branch" : ""}`}>
                {chain.map((item, index) => (
                  <div className="evolution-step" key={item.slug}>
                    <button
                      type="button"
                      className={item.slug === selected.slug ? "is-current" : ""}
                      onClick={() => choosePokemon(item.slug)}
                      aria-label={`${t.tap}: ${item.name[language]}`}
                    >
                      <span className="evolution-image">
                        <ProgressivePokemonImage id={item.id} alt="" width={86} height={86} />
                      </span>
                      <strong>{item.name[language]}</strong>
                      <small>#{String(item.id).padStart(3, "0")}</small>
                    </button>
                    {index < chain.length - 1 && (
                      <span className="evolution-arrow" aria-hidden="true">
                        {language === "he" ? "‹" : "›"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="explorer-panel">
          <div className="explorer-tools">
            <div className="search-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(pokemonBatchSize);
                  setNewPokemonBatch(null);
                }}
                placeholder={t.search}
                aria-label={t.search}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setVisibleCount(pokemonBatchSize);
                    setNewPokemonBatch(null);
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <button className="surprise-button" type="button" onClick={surprise}>
              <span aria-hidden="true">✦</span>
              {t.discover}
            </button>
          </div>

          <div className={`filter-shell ${showFilterScrollHint ? "has-more" : ""}`}>
            <div
              ref={filterRowRef}
              className="filter-row"
              aria-label="Pokémon types"
            >
              {filters.map((item, index) => (
                <button
                  ref={index === filters.length - 1 ? filterEndRef : undefined}
                  type="button"
                  key={item}
                  className={filter === item ? "is-active" : ""}
                  onClick={() => {
                    setFilter(item);
                    setVisibleCount(pokemonBatchSize);
                    setNewPokemonBatch(null);
                  }}
                >
                  {item === "all" ? t.all : typeNames[item][language]}
                </button>
              ))}
            </div>
          </div>

          <div className="result-title">
            <strong>{filtered.length}</strong>
            <span>{t.results}</span>
          </div>

          {filtered.length ? (
            <>
              <div ref={pokemonGridRef} className="pokemon-grid">
                {visiblePokemon.map((item, index) => (
                  <button
                    ref={
                      newPokemonBatch?.start === index
                        ? firstNewPokemonRef
                        : undefined
                    }
                    type="button"
                    key={item.slug}
                    className={`pokemon-tile pokemon-tile--${item.types[0]} ${item.slug === selected.slug ? "is-selected" : ""} ${
                      newPokemonBatch &&
                      index >= newPokemonBatch.start &&
                      index < newPokemonBatch.start + newPokemonBatch.count
                        ? "is-newly-loaded"
                        : ""
                    }`}
                    onClick={() => choosePokemon(item.slug)}
                    aria-pressed={item.slug === selected.slug}
                  >
                    <span className="tile-number">#{String(item.id).padStart(3, "0")}</span>
                    {openedSlugs.includes(item.slug) ? (
                      <span
                        className="tile-opened-indicator"
                        role="img"
                        aria-label={t.opened}
                        title={t.opened}
                      >
                        ✓
                      </span>
                    ) : null}
                    <span className="tile-art">
                      <ProgressivePokemonImage id={item.id} alt="" width={118} height={118} />
                    </span>
                    <strong>{item.name[language]}</strong>
                    <small>{typeNames[item.types[0]][language]}</small>
                  </button>
                ))}
                {visiblePokemon.length < filtered.length ? (
                  <div
                    ref={pokemonGridEndRef}
                    className="infinite-scroll-sentinel"
                    role="status"
                    aria-live="polite"
                  >
                    <Pokeball small />
                    <span>{t.loadingMore}</span>
                  </div>
                ) : null}
              </div>
              {newPokemonBatch ? (
                <div className="load-more-feedback" role="status" aria-live="polite">
                  <span aria-hidden="true">✓</span>
                  {t.moreLoaded.replace("{count}", String(newPokemonBatch.count))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">🔎</span>
              <strong>{t.empty}</strong>
              <p>{t.emptyHelp}</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
