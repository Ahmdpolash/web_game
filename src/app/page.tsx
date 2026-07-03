"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import { generateDeck, GAME_TIME_SECONDS, type GameCard } from "@/lib/mockData";

type GameState = "idle" | "playing" | "won" | "timeUp";

export default function MemoryGamePage() {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [isDark, setIsDark] = useState(true);
  const disableClick = useRef(false);

  // Initialize game
  const startGame = useCallback(() => {
    const sessionSeed = Date.now();
    setCards(generateDeck(sessionSeed));
    setFlippedIds([]);
    setMoves(0);
    setTimeLeft(GAME_TIME_SECONDS);
    setGameState("playing");
    disableClick.current = false;
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState("timeUp");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Check for win
  useEffect(() => {
    if (gameState === "playing" && cards.length > 0 && cards.every((c) => c.isMatched)) {
      setGameState("won");
    }
  }, [cards, gameState]);

  // Handle card flip logic
  useEffect(() => {
    if (flippedIds.length !== 2) return;
    disableClick.current = true;

    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (!firstCard || !secondCard) return;

    if (firstCard.pairId === secondCard.pairId) {
      // Match found
      setCards((prev) =>
        prev.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isMatched: true, isFlipped: true } : c
        )
      );
      setFlippedIds([]);
      setMoves((prev) => prev + 1);
      disableClick.current = false;
    } else {
      // No match — flip back after delay
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          )
        );
        setFlippedIds([]);
        setMoves((prev) => prev + 1);
        disableClick.current = false;
      }, 900);
    }
  }, [flippedIds, cards]);

  const handleCardClick = (id: number) => {
    if (disableClick.current || flippedIds.length >= 2) return;
    if (gameState !== "playing") return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedIds((prev) => [...prev, id]);
  };

  const handleStopGame = () => {
    setGameState("idle");
    setCards([]);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const theme = {
    bg: isDark ? "#0f172a" : "#e8eaf6",
    cardBg: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#1e1b4b",
    textMuted: isDark ? "#94a3b8" : "#4338ca",
    border: isDark ? "#334155" : "#c7d2fe",
    accent: isDark ? "#3b82f6" : "#4f46e5",
    success: isDark ? "#10b981" : "#059669",
    danger: isDark ? "#ef4444" : "#dc2626",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative",
        transition: "background 0.3s ease",
      }}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          zIndex: 1000,
          boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
        aria-label="Toggle theme"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <AnimatePresence mode="wait">
        {gameState === "idle" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              maxWidth: "480px",
              background: theme.cardBg,
              borderRadius: "16px",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.08)",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: theme.text,
                marginBottom: "1rem",
              }}
            >
              Memory Game
            </h1>
            <div
              style={{
                background: isDark ? "#334155" : "#ede9fe",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              <h2
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: isDark ? "#e2e8f0" : "#3730a3",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                📋 Instructions
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  fontSize: "0.875rem",
                  color: isDark ? "#94a3b8" : "#4338ca",
                  lineHeight: 1.6,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <li>1. Click on each card to flip it</li>
                <li>2. Remember the position of each emoji</li>
                <li>3. Match all pairs before time runs out</li>
                <li>4. You have <strong style={{ color: theme.accent }}>5 minutes</strong> to complete</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              style={{
                width: "100%",
                background: theme.accent,
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                boxShadow: isDark
                  ? "0 2px 12px rgba(59,130,246,0.3)"
                  : "0 2px 12px rgba(37,99,235,0.2)",
              }}
            >
              Start Game
            </motion.button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "100%",
              maxWidth: "420px",
            }}
          >
            {/* Game Board Container */}
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.3)"
                  : "0 4px 20px rgba(0,0,0,0.08)",
                padding: "1rem",
              }}
            >
              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: theme.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                    }}
                  >
                    Moves
                  </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: theme.text,
                    }}
                  >
                    {moves}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: theme.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                    }}
                  >
                    Time
                  </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: timeLeft < 30 ? theme.danger : theme.success,
                    }}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Card Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    onClick={handleCardClick}
                    disabled={disableClick.current}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* Stop Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStopGame}
                style={{
                  width: "100%",
                  background: isDark ? "#334155" : "#ede9fe",
                  color: isDark ? "#f1f5f9" : "#4338ca",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  padding: "0.65rem",
                  borderRadius: "10px",
                  border: `1px solid ${isDark ? "#475569" : "#c4b5fd"}`,
                  cursor: "pointer",
                }}
              >
                Stop Game
              </motion.button>
            </div>
          </motion.div>
        )}

        {(gameState === "won" || gameState === "timeUp") && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: theme.cardBg,
              borderRadius: "16px",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.08)",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              style={{ fontSize: "3rem", marginBottom: "0.75rem" }}
            >
              {gameState === "won" ? "🎉" : "⏰"}
            </motion.div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: gameState === "won" ? theme.success : theme.danger,
                marginBottom: "0.5rem",
              }}
            >
              {gameState === "won" ? "You Won!" : "Time's Up!"}
            </h2>
            <p style={{ fontSize: "0.9rem", color: theme.textMuted, marginBottom: "1.25rem" }}>
              {gameState === "won"
                ? `Congratulations! You matched all pairs in ${moves} moves.`
                : "Better luck next time! Try again to beat the clock."}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
                style={{
                  flex: 1,
                  background: theme.accent,
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  padding: "0.7rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStopGame}
                style={{
                  flex: 1,
                  background: isDark ? "#334155" : "#ede9fe",
                  color: isDark ? "#f1f5f9" : "#4338ca",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  padding: "0.7rem",
                  borderRadius: "10px",
                  border: `1px solid ${isDark ? "#475569" : "#c4b5fd"}`,
                  cursor: "pointer",
                }}
              >
                Exit
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer
        style={{
          position: "fixed",
          bottom: "0.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.75rem",
          color: isDark ? "#64748b" : "#64748b",
          zIndex: 999,
        }}
      >
        Developed by{" "}
        <a
          href="https://linkedin.com/in/polashahmed"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isDark ? "#3b82f6" : "#4f46e5",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Polash
        </a>
      </footer>
    </div>
  );
}
