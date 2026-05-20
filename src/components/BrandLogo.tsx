// Logo merek StoikioVerse.
// "Stoikio" — teks hitam tebal. "Verse" — teks coral dengan sorotan pastel yellow.
// Elemen kecil atom/molekul beranimasi mengitari logo.
import { useEffect, useRef } from "react";

type Props = { className?: string; size?: "sm" | "md" | "lg" };

const CORAL = "#FFB2A6";
const YELLOW = "#FFF89A";
const BLACK = "#1a1a1a";

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

// Elemen kecil yang bergerak: simbol-simbol kimia mini
const ELEMENTS = [
  { symbol: "H₂", x: -8, y: -10, delay: 0, duration: 3.2 },
  { symbol: "O", x: 100, y: -8, delay: 0.5, duration: 2.8 },
  { symbol: "•", x: 45, y: -12, delay: 1.0, duration: 3.5 },
  { symbol: "N", x: -6, y: 18, delay: 1.5, duration: 2.5 },
  { symbol: "•", x: 110, y: 16, delay: 0.8, duration: 3.0 },
];

export default function BrandLogo({ className = "", size = "md" }: Props) {
  return (
    <span
      className={`inline-flex items-baseline font-extrabold tracking-tight relative ${SIZE[size]} ${className}`}
      style={{ position: "relative" }}
    >
      {/* Elemen kecil bergerak */}
      {ELEMENTS.map((el, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${el.x}px`,
            top: `${el.y}px`,
            fontSize: "0.45em",
            color: CORAL,
            opacity: 0.7,
            animation: `floatElement${i % 3} ${el.duration}s ease-in-out ${el.delay}s infinite`,
            pointerEvents: "none",
            userSelect: "none",
            fontWeight: 700,
          }}
        >
          {el.symbol}
        </span>
      ))}

      {/* CSS animasi inline */}
      <style>{`
        @keyframes floatElement0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-5px) rotate(15deg); opacity: 1; }
        }
        @keyframes floatElement1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(4px) rotate(-10deg); opacity: 0.9; }
        }
        @keyframes floatElement2 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          33% { transform: translateY(-4px) scale(1.3); opacity: 1; }
          66% { transform: translateY(3px) scale(0.8); opacity: 0.5; }
        }
      `}</style>

      {/* Teks logo */}
      <span style={{ color: BLACK }}>Stoikio</span>
      <span
        className="ml-0.5 rounded-md px-1.5 py-0.5"
        style={{ color: CORAL, backgroundColor: YELLOW }}
      >
        Verse
      </span>
    </span>
  );
}
