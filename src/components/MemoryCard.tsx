"use client";

import { motion } from "framer-motion";

interface MemoryCardProps {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function MemoryCard({
  emoji,
  isFlipped,
  isMatched,
  onClick,
}: MemoryCardProps) {
  return (
    <motion.div
      className="memory-card"
      onClick={!isMatched ? onClick : undefined}
      whileHover={!isMatched ? { scale: 1.05 } : {}}
      whileTap={!isMatched ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="card-inner"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Back of card (question mark) */}
        <div className="card-face card-back">
          <span className="card-question">?</span>
        </div>

        {/* Front of card (emoji) */}
        <div className="card-face card-front">
          <span className="card-emoji">{emoji}</span>
        </div>
      </motion.div>

      {isMatched && (
        <motion.div
          className="match-overlay"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
}
