// Komponen ikon kimia animasi — melayang di background semua halaman
import { useEffect, useRef } from "react";

const ICONS = ["⚗️", "🧪", "🔬", "🧫", "🧬", "⚛️", "🫧", "💊", "🌡️", "🔭", "H₂O", "CO₂", "NaCl", "O₂", "Fe"];

type IconItem = {
  id: number;
  icon: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  animType: "float" | "spin" | "fade" | "bounce";
  dx: number;
  dy: number;
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateIcons(count: number): IconItem[] {
  const animTypes: IconItem["animType"][] = ["float", "spin", "fade", "bounce"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    icon: ICONS[i % ICONS.length],
    x: randomBetween(0, 100),
    y: randomBetween(0, 100),
    size: randomBetween(14, 28),
    opacity: randomBetween(0.07, 0.18),
    duration: randomBetween(4, 12),
    delay: randomBetween(0, 8),
    animType: animTypes[i % animTypes.length],
    dx: randomBetween(-30, 30),
    dy: randomBetween(-40, -10),
  }));
}

const ICONS_LIST = generateIcons(24);

export default function ChemistryBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes chem-float {
          0%   { transform: translateY(0px) translateX(0px); }
          50%  { transform: translateY(-18px) translateX(8px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes chem-spin {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes chem-fade {
          0%   { opacity: 0; }
          40%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes chem-bounce {
          0%   { transform: translateY(0px); }
          30%  { transform: translateY(-24px); }
          50%  { transform: translateY(-6px); }
          70%  { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {ICONS_LIST.map((item) => {
        const animMap = {
          float: "chem-float",
          spin: "chem-spin",
          fade: "chem-fade",
          bounce: "chem-bounce",
        };
        return (
          <span
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: item.size,
              opacity: item.opacity,
              animation: `${animMap[item.animType]} ${item.duration}s ${item.delay}s ease-in-out infinite`,
              userSelect: "none",
              color: "#FF6B6B",
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            {item.icon}
          </span>
        );
      })}
    </div>
  );
}
