"use client";

import { motion } from "framer-motion";
import type { GameCard } from "@/lib/mockData";

type Props = {
  card: GameCard;
  onClick: (id: number) => void;
  disabled: boolean;
  isDark: boolean;
};

export default function Card({ card, onClick, disabled, isDark }: Props) {
  const { id, emoji, label, isFlipped, isMatched } = card;

  const cardBackBg = isDark
    ? "linear-gradient(135deg, #334155 0%, #1e293b 100%)"
    : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)";

  const cardFrontBg = isMatched
    ? isDark
      ? "linear-gradient(135deg, #065f46 0%, #047857 100%)"
      : "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : isDark
      ? "linear-gradient(135deg, #475569 0%, #334155 100%)"
      : "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)";

  const cardBorder = isMatched
    ? isDark
      ? "#10b981"
      : "#10b981"
    : isDark
      ? "#64748b"
      : "#4f46e5";

  return (
    <motion.div
      className="card-wrapper"
      onClick={() => !disabled && !isFlipped && !isMatched && onClick(id)}
      whileHover={
        !isFlipped && !isMatched && !disabled ? { scale: 1.06, y: -4 } : {}
      }
      whileTap={!isFlipped && !isMatched && !disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      aria-label={isFlipped || isMatched ? label : "Hidden card"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" &&
        !disabled &&
        !isFlipped &&
        !isMatched &&
        onClick(id)
      }
      style={{
        perspective: "1000px",
        cursor: isFlipped || isMatched || disabled ? "default" : "pointer",
        width: "100%",
        aspectRatio: "1",
      }}
    >
      {/* flip container */}
      <motion.div
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ 
          type: "spring",
          stiffness: 130,
          damping: 16,
          mass: 0.8
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* BACK */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "12px",
            background: cardBackBg,
            border: `2px solid ${isDark ? "#475569" : "#4338ca"}`,
            boxShadow: isDark
              ? "0 2px 8px rgba(0,0,0,0.3)"
              : "0 2px 8px rgba(79,70,229,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}
        >
          <span
            style={{
              opacity: isDark ? 0.5 : 0.6,
              color: isDark ? "#94a3b8" : "#e0e7ff",
              fontWeight: 700,
            }}
          >
            ?
          </span>
        </div>

        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "12px",
            background: cardFrontBg,
            border: `2px solid ${cardBorder}`,
            boxShadow: isMatched
              ? isDark
                ? "0 2px 12px rgba(16,185,129,0.4)"
                : "0 2px 12px rgba(16,185,129,0.5)"
              : isDark
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(79,70,229,0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <motion.span
            initial={false}
            animate={isMatched ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{ fontSize: "2rem", lineHeight: 1 }}
          >
            {emoji}
          </motion.span>
          <span
            style={{
              fontSize: "0.65rem",
              color: isMatched ? "#ffffff" : isDark ? "#94a3b8" : "#e0e7ff",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
