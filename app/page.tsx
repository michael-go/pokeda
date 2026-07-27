"use client";

import { useMemo, useState } from "react";

type Language = "he" | "en";
type PokemonType = "grass" | "fire" | "water" | "electric" | "normal" | "flying" | "poison" | "bug";

type Pokemon = {
  id: number;
  slug: string;
  name: { he: string; en: string };
  description: { he: string; en: string };
  powers: { he: string[]; en: string[] };
  types: PokemonType[];
  height: string;
  weight: string;
  chain: string[];
};

const typeNames: Record<PokemonType, { he: string; en: string }> = {
  grass: { he: "עשב", en: "Grass" },
  fire: { he: "אש", en: "Fire" },
  water: { he: "מים", en: "Water" },
  electric: { he: "חשמל", en: "Electric" },
  normal: { he: "רגיל", en: "Normal" },
  flying: { he: "מעופף", en: "Flying" },
  poison: { he: "רעל", en: "Poison" },
  bug: { he: "חרק", en: "Bug" },
};

const pokemon: Pokemon[] = [
  {
    id: 1,
    slug: "bulbasaur",
    name: { he: "בולבזאור", en: "Bulbasaur" },
    description: {
      he: "פוקימון קטן ואמיץ שנולד עם זרע על הגב. הוא אוהב לנמנם בשמש כדי שהצמח שלו יגדל.",
      en: "A brave little Pokémon born with a seed on its back. It loves sunny naps that help its plant grow.",
    },
    powers: { he: ["שוט גפן", "עלה תער", "אבקת שינה"], en: ["Vine Whip", "Razor Leaf", "Sleep Powder"] },
    types: ["grass", "poison"],
    height: "0.7 m",
    weight: "6.9 kg",
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
    powers: { he: ["קרן שמש", "שוט גפן", "ריח מתוק"], en: ["Solar Beam", "Vine Whip", "Sweet Scent"] },
    types: ["grass", "poison"],
    height: "1.0 m",
    weight: "13.0 kg",
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
    powers: { he: ["קרן שמש", "סערת עלים", "רעידת אדמה"], en: ["Solar Beam", "Petal Blizzard", "Earthquake"] },
    types: ["grass", "poison"],
    height: "2.0 m",
    weight: "100.0 kg",
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
    powers: { he: ["גחלת", "שריטה", "מסך עשן"], en: ["Ember", "Scratch", "Smokescreen"] },
    types: ["fire"],
    height: "0.6 m",
    weight: "8.5 kg",
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
    powers: { he: ["ניב אש", "טפר דרקון", "להביור"], en: ["Fire Fang", "Dragon Claw", "Flamethrower"] },
    types: ["fire"],
    height: "1.1 m",
    weight: "19.0 kg",
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
    powers: { he: ["להביור", "טופר דרקון", "טיסה"], en: ["Flamethrower", "Dragon Claw", "Fly"] },
    types: ["fire", "flying"],
    height: "1.7 m",
    weight: "90.5 kg",
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
    powers: { he: ["אקדח מים", "סיבוב מהיר", "בועות"], en: ["Water Gun", "Rapid Spin", "Bubble"] },
    types: ["water"],
    height: "0.5 m",
    weight: "9.0 kg",
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
    powers: { he: ["נשיכת מים", "גלישה", "הגנת שריון"], en: ["Aqua Tail", "Surf", "Shell Defense"] },
    types: ["water"],
    height: "1.0 m",
    weight: "22.5 kg",
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
    powers: { he: ["הידרו פאמפ", "תותח מים", "סופת שלג"], en: ["Hydro Pump", "Water Cannon", "Blizzard"] },
    types: ["water"],
    height: "1.6 m",
    weight: "85.5 kg",
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
    powers: { he: ["הלם רעם", "קסם", "מתקפה מהירה"], en: ["Thunder Shock", "Charm", "Quick Attack"] },
    types: ["electric"],
    height: "0.3 m",
    weight: "2.0 kg",
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
    powers: { he: ["מכת ברק", "זנב ברזל", "מתקפה מהירה"], en: ["Thunderbolt", "Iron Tail", "Quick Attack"] },
    types: ["electric"],
    height: "0.4 m",
    weight: "6.0 kg",
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
    powers: { he: ["רעם", "מכת מתח", "גל הלם"], en: ["Thunder", "Volt Tackle", "Shock Wave"] },
    types: ["electric"],
    height: "0.8 m",
    weight: "30.0 kg",
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
    powers: { he: ["מתקפה מהירה", "נשיכה", "עיניים מתוקות"], en: ["Quick Attack", "Bite", "Baby-Doll Eyes"] },
    types: ["normal"],
    height: "0.3 m",
    weight: "6.5 kg",
    chain: ["eevee", "vaporeon", "jolteon", "flareon"],
  },
  {
    id: 134,
    slug: "vaporeon",
    name: { he: "ופוריאון", en: "Vaporeon" },
    description: {
      he: "התפתחות המים של איווי. הסנפירים והזנב שלה הופכים אותה לשחיינית נהדרת.",
      en: "Eevee’s water evolution. Its fins and tail make it a wonderful swimmer.",
    },
    powers: { he: ["פעימת מים", "גלישה", "קרן קפואה"], en: ["Water Pulse", "Surf", "Aurora Beam"] },
    types: ["water"],
    height: "1.0 m",
    weight: "29.0 kg",
    chain: ["eevee", "vaporeon", "jolteon", "flareon"],
  },
  {
    id: 135,
    slug: "jolteon",
    name: { he: "ג׳ולטיאון", en: "Jolteon" },
    description: {
      he: "התפתחות החשמל המהירה של איווי. הפרווה הקוצנית שלו נטענת באנרגיה.",
      en: "Eevee’s speedy electric evolution. Its spiky fur crackles with energy.",
    },
    powers: { he: ["מכת ברק", "כדור חשמלי", "זריזות"], en: ["Thunderbolt", "Electro Ball", "Agility"] },
    types: ["electric"],
    height: "0.8 m",
    weight: "24.5 kg",
    chain: ["eevee", "vaporeon", "jolteon", "flareon"],
  },
  {
    id: 136,
    slug: "flareon",
    name: { he: "פלריאון", en: "Flareon" },
    description: {
      he: "התפתחות האש החמימה של איווי. הפרווה הרכה שלו משחררת חום חזק.",
      en: "Eevee’s warm fire evolution. Its soft fur releases powerful heat.",
    },
    powers: { he: ["ניב אש", "להביור", "זנב ברזל"], en: ["Fire Fang", "Flamethrower", "Iron Tail"] },
    types: ["fire"],
    height: "0.9 m",
    weight: "25.0 kg",
    chain: ["eevee", "vaporeon", "jolteon", "flareon"],
  },
  {
    id: 10,
    slug: "caterpie",
    name: { he: "קטרפי", en: "Caterpie" },
    description: {
      he: "זחל קטן שאוכל הרבה עלים כדי לגדול. המחושים שלו עוזרים להרחיק אויבים.",
      en: "A tiny caterpillar that eats lots of leaves to grow. Its antenna helps keep danger away.",
    },
    powers: { he: ["יריית קורים", "התנגשות", "נשיכת חרק"], en: ["String Shot", "Tackle", "Bug Bite"] },
    types: ["bug"],
    height: "0.3 m",
    weight: "2.9 kg",
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
    powers: { he: ["הקשחה", "הגנת ברזל", "שריון"], en: ["Harden", "Iron Defense", "Shell Guard"] },
    types: ["bug"],
    height: "0.7 m",
    weight: "9.9 kg",
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
    powers: { he: ["רוח כסופה", "אבקת שינה", "בלבול"], en: ["Silver Wind", "Sleep Powder", "Confusion"] },
    types: ["bug", "flying"],
    height: "1.1 m",
    weight: "32.0 kg",
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
    powers: { he: ["ספיגה", "אבקת רעל", "ריקוד עלי כותרת"], en: ["Absorb", "Poison Powder", "Petal Dance"] },
    types: ["grass", "poison"],
    height: "0.5 m",
    weight: "5.4 kg",
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
    powers: { he: ["ריח מתוק", "חומצה", "קרן ירח"], en: ["Sweet Scent", "Acid", "Moonlight"] },
    types: ["grass", "poison"],
    height: "0.8 m",
    weight: "8.6 kg",
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
    powers: { he: ["סערת עלים", "קרן שמש", "אבקת שינה"], en: ["Petal Blizzard", "Solar Beam", "Sleep Powder"] },
    types: ["grass", "poison"],
    height: "1.2 m",
    weight: "18.6 kg",
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
    powers: { he: ["גחלת", "אש רצון", "מתקפה מהירה"], en: ["Ember", "Will-O-Wisp", "Quick Attack"] },
    types: ["fire"],
    height: "0.6 m",
    weight: "9.9 kg",
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
    powers: { he: ["להביור", "סחרור אש", "כוח על-חושי"], en: ["Flamethrower", "Fire Spin", "Extrasensory"] },
    types: ["fire"],
    height: "1.1 m",
    weight: "19.9 kg",
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
    powers: { he: ["ניב אש", "נהמה", "זריזות"], en: ["Fire Fang", "Roar", "Agility"] },
    types: ["fire"],
    height: "0.7 m",
    weight: "19.0 kg",
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
    powers: { he: ["מהירות קיצונית", "להביור", "הסתערות פראית"], en: ["Extreme Speed", "Flamethrower", "Wild Charge"] },
    types: ["fire"],
    height: "1.9 m",
    weight: "155.0 kg",
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
    powers: { he: ["אקדח מים", "בלבול", "שריטה"], en: ["Water Gun", "Confusion", "Scratch"] },
    types: ["water"],
    height: "0.8 m",
    weight: "19.6 kg",
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
    powers: { he: ["גלישה", "פעימת מים", "כוח על-חושי"], en: ["Surf", "Water Pulse", "Psychic"] },
    types: ["water"],
    height: "1.7 m",
    weight: "76.6 kg",
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
    powers: { he: ["יום תשלום", "שריטה", "נשיכה"], en: ["Pay Day", "Scratch", "Bite"] },
    types: ["normal"],
    height: "0.4 m",
    weight: "4.2 kg",
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
    powers: { he: ["חתך לילה", "כוח פנינה", "מהירות"], en: ["Night Slash", "Power Gem", "Swift"] },
    types: ["normal"],
    height: "1.0 m",
    weight: "32.0 kg",
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
    powers: { he: ["הלם רעם", "גל מגנטי", "פצצת מראה"], en: ["Thunder Shock", "Magnet Rise", "Mirror Shot"] },
    types: ["electric"],
    height: "0.3 m",
    weight: "6.0 kg",
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
    powers: { he: ["תותח הבזק", "מכת ברק", "שדה חשמלי"], en: ["Flash Cannon", "Thunderbolt", "Electric Terrain"] },
    types: ["electric"],
    height: "1.0 m",
    weight: "60.0 kg",
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
    powers: { he: ["התנגשות", "ליקוק", "מטרונום"], en: ["Tackle", "Lick", "Metronome"] },
    types: ["normal"],
    height: "0.6 m",
    weight: "105.0 kg",
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
    powers: { he: ["מנוחה", "חבטת גוף", "נחירה"], en: ["Rest", "Body Slam", "Snore"] },
    types: ["normal"],
    height: "2.1 m",
    weight: "460.0 kg",
    chain: ["munchlax", "snorlax"],
  },
];

const ui = {
  he: {
    title: "פוקדע",
    eyebrow: "הפוקדקס שלי",
    tagline: "עולם של פוקימונים מחכה לך!",
    search: "חיפוש לפי שם...",
    all: "הכול",
    discover: "הפתעה!",
    results: "פוקימונים",
    about: "מי אני?",
    powers: "הכוחות שלי",
    evolution: "מסלול ההתפתחות",
    height: "גובה",
    weight: "משקל",
    empty: "אופס! עוד לא מצאנו פוקימון כזה.",
    emptyHelp: "נסו שם אחר או בחרו סוג חדש.",
    language: "English",
    tap: "לחצו כדי להכיר",
    branchNote: "לאיווי יש כמה אפשרויות התפתחות!",
  },
  en: {
    title: "פוקדע",
    eyebrow: "My Pokédex",
    tagline: "A world of Pokémon is waiting for you!",
    search: "Search by name...",
    all: "All",
    discover: "Surprise me!",
    results: "Pokémon",
    about: "Meet me",
    powers: "My main powers",
    evolution: "Evolution journey",
    height: "Height",
    weight: "Weight",
    empty: "Oops! We couldn’t find that Pokémon.",
    emptyHelp: "Try another name or choose a new type.",
    language: "עברית",
    tap: "Tap to meet",
    branchNote: "Eevee has several evolution choices!",
  },
} as const;

const filters: Array<PokemonType | "all"> = ["all", "fire", "water", "grass", "electric", "normal", "bug"];

const artUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

function Pokeball({ small = false }: { small?: boolean }) {
  return <span className={`pokeball ${small ? "pokeball--small" : ""}`} aria-hidden="true" />;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("he");
  const [selectedSlug, setSelectedSlug] = useState("pikachu");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PokemonType | "all">("all");
  const t = ui[language];
  const selected = pokemon.find((item) => item.slug === selectedSlug) ?? pokemon[0];
  const direction = language === "he" ? "rtl" : "ltr";

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return pokemon.filter((item) => {
      const matchesType = filter === "all" || item.types.includes(filter);
      const matchesQuery =
        !normalized ||
        item.name.he.includes(normalized) ||
        item.name.en.toLowerCase().includes(normalized) ||
        String(item.id).includes(normalized);
      return matchesType && matchesQuery;
    });
  }, [filter, query]);

  const chain = selected.chain
    .map((slug) => pokemon.find((item) => item.slug === slug))
    .filter((item): item is Pokemon => Boolean(item));

  const choosePokemon = (slug: string) => {
    setSelectedSlug(slug);
    if (window.innerWidth < 850) {
      requestAnimationFrame(() => document.querySelector(".detail-card")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const surprise = () => {
    const pool = filtered.length ? filtered : pokemon;
    const next = pool[Math.floor(Math.random() * pool.length)];
    choosePokemon(next.slug);
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

        <p className="tagline">{t.tagline}</p>

        <button
          className="language-switch"
          type="button"
          onClick={() => setLanguage(language === "he" ? "en" : "he")}
          aria-label={language === "he" ? "Switch to English" : "מעבר לעברית"}
        >
          <span aria-hidden="true">🌐</span>
          {t.language}
        </button>
      </header>

      <div className="workspace">
        <section className="detail-card" aria-live="polite">
          <div className="hero-panel">
            <div className="pokemon-number">#{String(selected.id).padStart(3, "0")}</div>
            <div className="hero-sparkle hero-sparkle--one" aria-hidden="true">✦</div>
            <div className="hero-sparkle hero-sparkle--two" aria-hidden="true">✧</div>
            <div className="hero-ring" aria-hidden="true" />
            <img
              className="hero-image"
              src={artUrl(selected.id)}
              alt={selected.name[language]}
              width={380}
              height={380}
            />
            <div className="hero-shadow" aria-hidden="true" />
          </div>

          <div className="detail-content">
            <div className="title-row">
              <div>
                <div className="type-row">
                  {selected.types.map((type) => (
                    <span className={`type-chip type-chip--${type}`} key={type}>
                      <span className="type-dot" />
                      {typeNames[type][language]}
                    </span>
                  ))}
                </div>
                <h2>{selected.name[language]}</h2>
                <span className="english-name">{selected.name.en}</span>
              </div>
              <Pokeball small />
            </div>

            <div className="about-block">
              <h3><span aria-hidden="true">👋</span>{t.about}</h3>
              <p>{selected.description[language]}</p>
            </div>

            <div className="quick-facts">
              <div>
                <span>{t.height}</span>
                <strong>{selected.height}</strong>
              </div>
              <div className="fact-divider" />
              <div>
                <span>{t.weight}</span>
                <strong>{selected.weight}</strong>
              </div>
            </div>

            <div className="powers-block">
              <h3><span aria-hidden="true">⚡</span>{t.powers}</h3>
              <div className="power-list">
                {selected.powers[language].map((power, index) => (
                  <span key={power} style={{ "--power-index": index } as React.CSSProperties}>
                    <i aria-hidden="true">{index + 1}</i>
                    {power}
                  </span>
                ))}
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
                        <img src={artUrl(item.id)} alt="" width={86} height={86} />
                      </span>
                      <strong>{item.name[language]}</strong>
                      <small>#{String(item.id).padStart(3, "0")}</small>
                    </button>
                    {index < chain.length - 1 && <span className="evolution-arrow" aria-hidden="true">›</span>}
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                aria-label={t.search}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>
              )}
            </div>
            <button className="surprise-button" type="button" onClick={surprise}>
              <span aria-hidden="true">✦</span>
              {t.discover}
            </button>
          </div>

          <div className="filter-row" aria-label="Pokémon types">
            {filters.map((item) => (
              <button
                type="button"
                key={item}
                className={filter === item ? "is-active" : ""}
                onClick={() => setFilter(item)}
              >
                {item === "all" ? t.all : typeNames[item][language]}
              </button>
            ))}
          </div>

          <div className="result-title">
            <strong>{filtered.length}</strong>
            <span>{t.results}</span>
          </div>

          {filtered.length ? (
            <div className="pokemon-grid">
              {filtered.map((item) => (
                <button
                  type="button"
                  key={item.slug}
                  className={`pokemon-tile pokemon-tile--${item.types[0]} ${item.slug === selected.slug ? "is-selected" : ""}`}
                  onClick={() => choosePokemon(item.slug)}
                  aria-pressed={item.slug === selected.slug}
                >
                  <span className="tile-number">#{String(item.id).padStart(3, "0")}</span>
                  <span className="tile-art">
                    <img src={artUrl(item.id)} alt="" width={118} height={118} loading="lazy" />
                  </span>
                  <strong>{item.name[language]}</strong>
                  <small>{typeNames[item.types[0]][language]}</small>
                </button>
              ))}
            </div>
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
