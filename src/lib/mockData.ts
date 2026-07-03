export type CardItem = {
  id: number;
  emoji: string;
  label: string;
};

// 8 unique pairs → 16 cards total
export const CARD_ITEMS: Omit<CardItem, "id">[] = [
  { emoji: "🦊", label: "Fox" },
  { emoji: "🐬", label: "Dolphin" },
  { emoji: "🦋", label: "Butterfly" },
  { emoji: "🐸", label: "Frog" },
  { emoji: "🍓", label: "Strawberry" },
  { emoji: "🍋", label: "Lemon" },
  { emoji: "🥝", label: "Kiwi" },
  { emoji: "🍇", label: "Grapes" },
];

export type GameCard = {
  id: number;        // unique instance id
  pairId: number;    // shared between the two matching cards
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export function generateDeck(): GameCard[] {
  const deck: GameCard[] = [];
  CARD_ITEMS.forEach((item, index) => {
    deck.push({ id: index * 2,     pairId: index, ...item, isFlipped: false, isMatched: false });
    deck.push({ id: index * 2 + 1, pairId: index, ...item, isFlipped: false, isMatched: false });
  });
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export const GAME_TIME_SECONDS = 5 * 60; // 5 minutes
