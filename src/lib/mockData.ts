export type CardItem = {
  id: number;
  emoji: string;
  label: string;
};

export const ALL_CARD_ITEMS: Omit<CardItem, "id">[] = [
  { emoji: "🦊", label: "Fox" },
  { emoji: "🐬", label: "Dolphin" },
  { emoji: "🦋", label: "Butterfly" },
  { emoji: "🐸", label: "Frog" },
  { emoji: "🦁", label: "Lion" },
  { emoji: "🐼", label: "Panda" },
  { emoji: "🦉", label: "Owl" },
  { emoji: "🐙", label: "Octopus" },
  { emoji: "🦒", label: "Giraffe" },
  { emoji: "🐻", label: "Bear" },
  { emoji: "🐯", label: "Tiger" },
  { emoji: "🦘", label: "Kangaroo" },
  { emoji: "🍓", label: "Strawberry" },
  { emoji: "🍋", label: "Lemon" },
  { emoji: "🥝", label: "Kiwi" },
  { emoji: "🍇", label: "Grapes" },
  { emoji: "🍉", label: "Watermelon" },
  { emoji: "🍊", label: "Orange" },
  { emoji: "🍌", label: "Banana" },
  { emoji: "🍑", label: "Peach" },
  { emoji: "🥭", label: "Mango" },
  { emoji: "🍍", label: "Pineapple" },
  { emoji: "🍎", label: "Apple" },
  { emoji: "🍒", label: "Cherry" },
];

export type GameCard = {
  id: number; // unique instance id
  pairId: number; // shared between the two matching cards
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function hasAdjacentPairs(deck: GameCard[]): boolean {
  for (let i = 0; i < deck.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;

    // Check right neighbor
    if (col < 3) {
      if (deck[i].pairId === deck[i + 1].pairId) {
        return true;
      }
    }
    // Check bottom neighbor
    if (row < 3) {
      if (deck[i].pairId === deck[i + 4].pairId) {
        return true;
      }
    }
  }
  return false;
}

export function generateDeck(seed?: number): GameCard[] {
  const useSeed = seed ?? Date.now();
  const random = seededRandom(useSeed);

  const shuffledItems = [...ALL_CARD_ITEMS];
  for (let i = shuffledItems.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
  }

  const selectedItems = shuffledItems.slice(0, 8);

  const deck: GameCard[] = [];
  selectedItems.forEach((item, index) => {
    deck.push({
      id: index * 2,
      pairId: index,
      ...item,
      isFlipped: false,
      isMatched: false,
    });
    deck.push({
      id: index * 2 + 1,
      pairId: index,
      ...item,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Shuffle until there are no adjacent identical cards
  let attempts = 0;
  do {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    attempts++;
  } while (hasAdjacentPairs(deck) && attempts < 200);

  return deck;
}

export const GAME_TIME_SECONDS = 5 * 60; // 5 minutes
