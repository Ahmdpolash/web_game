"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryCard from "./MemoryCard";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ["🎮", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎺"];
const TIME_LIMIT = 300; // 5 minutes in seconds

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isGameActive, setIsGameActive] = useState(true);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setTimeLeft(TIME_LIMIT);
    setIsGameActive(true);
    setMatchedPairs(0);
    setShowWin(false);
    setShowLose(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          setShowLose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  // Check for match
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true, isFlipped: false }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards, cards]);

  // Check for win
  useEffect(() => {
    if (matchedPairs === EMOJIS.length && matchedPairs > 0) {
      setIsGameActive(false);
      setShowWin(true);
    }
  }, [matchedPairs]);

  const handleCardClick = (id: number) => {
    if (!isGameActive || flippedCards.length === 2) return;
    if (flippedCards.includes(id) || cards[id].isMatched) return;

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="memory-game-container">
      {/* Instructions */}
      <motion.div
        className="instructions-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="instructions-title">INSTRUCTIONS</h2>
        <ol className="instructions-list">
          <li>Click on each block to turn it</li>
          <li>Remember the position of each block image</li>
          <li>Click on another block and try to find the matching pair</li>
          <li>Your number of moves are counted</li>
        </ol>
      </motion.div>

      {/* Game Board */}
      <motion.div
        className="game-board"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Stats */}
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time:</span>
            <span className={`stat-value ${timeLeft < 60 ? "time-warning" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              id={card.id}
              emoji={card.emoji}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        {/* Stop/Restart Button */}
        <motion.button
          className="game-button"
          onClick={initializeGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isGameActive ? "Restart Game" : "New Game"}
        </motion.button>
      </motion.div>

      {/* Win Modal */}
      <AnimatePresence>
        {showWin && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content win-modal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="modal-title">🎉 Congratulations!</h2>
              <p className="modal-text">
                You won in <strong>{moves}</strong> moves!
              </p>
              <p className="modal-text">
                Time: <strong>{formatTime(TIME_LIMIT - timeLeft)}</strong>
              </p>
              <button className="modal-button" onClick={initializeGame}>
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lose Modal */}
      <AnimatePresence>
        {showLose && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content lose-modal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="modal-title">⏰ Time&apos;s Up!</h2>
              <p className="modal-text">
                You made <strong>{moves}</strong> moves.
              </p>
              <p className="modal-text">Better luck next time!</p>
              <button className="modal-button" onClick={initializeGame}>
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
