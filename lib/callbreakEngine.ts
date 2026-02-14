export type Suit = 'S' | 'H' | 'D' | 'C'; // Spades, Hearts, Diamonds, Clubs
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // 11=J, 12=Q, 13=K, 14=A

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // Unique ID for React keys
}

export interface Player {
  id: number;
  name: string;
  isBot: boolean;
  hand: Card[];
  bid: number;
  tricksWon: number;
  score: number;
  totalScore: number;
}

export interface PlayedCard {
  playerId: number;
  card: Card;
}

// Fisher-Yates Shuffle
export const shuffleDeck = (): Card[] => {
  const suits: Suit[] = ['S', 'H', 'D', 'C'];
  const deck: Card[] = [];
  
  suits.forEach(suit => {
    for (let r = 2; r <= 14; r++) {
      deck.push({ suit, rank: r as Rank, id: `${suit}-${r}` });
    }
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

export const dealCards = (deck: Card[]): Card[][] => {
  const hands: Card[][] = [[], [], [], []];
  deck.forEach((card, index) => {
    hands[index % 4].push(card);
  });
  // Sort hands: Spades first, then High to Low
  hands.forEach(hand => {
    hand.sort((a, b) => {
      if (a.suit === b.suit) return b.rank - a.rank; // Descending rank
      if (a.suit === 'S') return -1; // Spades first
      if (b.suit === 'S') return 1;
      return a.suit.localeCompare(b.suit); // Group others
    });
  });
  return hands;
};

export const isValidMove = (card: Card, hand: Card[], leadSuit: Suit | null, currentTrick: PlayedCard[]): boolean => {
  if (!leadSuit) return true; // First player can play anything

  // 1. Must follow lead suit if possible
  const hasLeadSuit = hand.some(c => c.suit === leadSuit);
  if (hasLeadSuit && card.suit !== leadSuit) return false;

  // 2. If cannot follow lead suit
  if (!hasLeadSuit) {
    // Standard Callbreak: You can play anything if you don't have lead suit.
    // However, playing a Spade (Trump) is the winning move.
    return true; 
  }

  // 3. If following lead suit, trying to win is optional in standard casual rules, 
  // but strict competitive rules say you must beat the highest card if possible.
  // We will stick to: Must follow suit. If void, play anything.
  return true;
};

export const getTrickWinner = (trick: PlayedCard[]): number => {
  if (trick.length === 0) return -1;

  const leadSuit = trick[0].card.suit;
  let winner = trick[0];

  trick.forEach(play => {
    // If play is Spade and winner is not Spade, play wins
    if (play.card.suit === 'S' && winner.card.suit !== 'S') {
      winner = play;
    }
    // If both Spades, higher rank wins
    else if (play.card.suit === 'S' && winner.card.suit === 'S') {
      if (play.card.rank > winner.card.rank) winner = play;
    }
    // If neither Spade, and play follows lead suit, check rank
    else if (winner.card.suit !== 'S' && play.card.suit === leadSuit) {
      if (play.card.rank > winner.card.rank) winner = play;
    }
  });

  return winner.playerId;
};

// AI Logic
export const calculateBotBid = (hand: Card[], difficulty: 'easy' | 'medium' | 'hard'): number => {
  let tricks = 0;
  
  // Count high spades
  const spades = hand.filter(c => c.suit === 'S');
  spades.forEach(c => {
    if (c.rank >= 11) tricks += 1; // J, Q, K, A of Spades
    else if (spades.length > 4) tricks += 0.5; // Length bonus
  });

  // Count Ace/King of other suits
  hand.filter(c => c.suit !== 'S').forEach(c => {
    if (c.rank === 14) tricks += 1; // Ace is strong
    if (c.rank === 13) tricks += 0.5; // King is okay
  });

  // Conservative flooring
  let bid = Math.max(1, Math.floor(tricks));
  
  // Randomness for 'easy'
  if (difficulty === 'easy') {
    return Math.max(1, Math.min(8, bid + (Math.random() > 0.5 ? 1 : -1)));
  }
  
  return Math.min(8, bid);
};

export const getBotMove = (
  hand: Card[], 
  trick: PlayedCard[], 
  difficulty: 'easy' | 'medium' | 'hard'
): Card => {
  const leadSuit = trick.length > 0 ? trick[0].card.suit : null;
  const validCards = hand.filter(c => isValidMove(c, hand, leadSuit, trick));
  
  if (validCards.length === 0) return hand[0]; // Should not happen if validation is correct

  // Logic:
  // 1. If leading (trick empty) -> Play Ace/King or Smallest non-spade
  if (!leadSuit) {
    // Try to win with high non-spade
    const aces = validCards.filter(c => c.rank === 14 && c.suit !== 'S');
    if (aces.length > 0) return aces[0];

    // Else play lowest non-spade to save spades
    const nonSpades = validCards.filter(c => c.suit !== 'S').sort((a, b) => a.rank - b.rank);
    if (nonSpades.length > 0) return nonSpades[0];

    // Only spades left? Play lowest spade
    return validCards.sort((a, b) => a.rank - b.rank)[0];
  }

  // 2. If following
  const currentWinner = getTrickWinner(trick);
  const winningCard = trick.find(p => p.playerId === currentWinner)?.card;
  
  // Try to win
  const winningMoves = validCards.filter(c => {
    // If lead is spade, must beat it
    if (leadSuit === 'S') return c.rank > (winningCard?.rank || 0);
    
    // If lead is not spade
    if (c.suit === leadSuit) {
       // If someone cut with spade, we can't win with lead suit
       const isCut = trick.some(p => p.card.suit === 'S');
       if (isCut) return false;
       return c.rank > (winningCard?.rank || 0);
    }
    
    // If void in lead suit, we can cut with spade
    if (c.suit === 'S') {
      // If already cut, must over-cut
      const currentHighestSpade = trick
        .filter(p => p.card.suit === 'S')
        .sort((a, b) => b.card.rank - a.card.rank)[0];
      
      if (currentHighestSpade) return c.rank > currentHighestSpade.card.rank;
      return true; // First to cut
    }
    
    return false;
  });

  if (winningMoves.length > 0) {
    // Play smallest card that wins (Cheap win)
    winningMoves.sort((a, b) => a.rank - b.rank);
    return winningMoves[0];
  }

  // If can't win, throw trash (lowest rank)
  validCards.sort((a, b) => a.rank - b.rank);
  return validCards[0];
};

export const calculateScores = (players: Player[]): Player[] => {
  return players.map(p => {
    let roundScore = 0;
    if (p.tricksWon >= p.bid) {
      roundScore = p.bid + (p.tricksWon - p.bid) * 0.1;
    } else {
      roundScore = -p.bid;
    }
    return {
      ...p,
      score: roundScore,
      totalScore: p.totalScore + roundScore
    };
  });
};
