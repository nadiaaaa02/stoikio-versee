// Dekorasi background: partikel & simbol kimia yang bergerak aktif
// Dipakai di halaman utama Index.tsx

const PARTICLES = [
  // [symbol, left%, top%, size(em), duration(s), delay(s), opacity, animType]
  { s: "H₂O",  l: 5,  t: 10, sz: 1.1, dur: 4.0, del: 0,   op: 0.7, anim: "floatA" },
  { s: "O₂",   l: 15, t: 75, sz: 0.9, dur: 3.2, del: 0.5, op: 0.7, anim: "floatB" },
  { s: "•",    l: 22, t: 30, sz: 1.4, dur: 2.5, del: 1.0, op: 0.7, anim: "floatC" },
  { s: "CO₂",  l: 30, t: 88, sz: 1.0, dur: 3.8, del: 0.3, op: 0.7, anim: "floatA" },
  { s: "N₂",   l: 40, t: 15, sz: 0.85,dur: 2.8, del: 1.5, op: 0.7, anim: "floatB" },
  { s: "⬡",   l: 48, t: 60, sz: 1.6, dur: 5.0, del: 0.8, op: 0.7, anim: "spinSlow"},
  { s: "H",    l: 55, t: 40, sz: 1.2, dur: 2.2, del: 0.2, op: 0.7, anim: "floatC" },
  { s: "NaCl", l: 63, t: 82, sz: 0.9, dur: 3.5, del: 1.2, op: 0.7, anim: "floatA" },
  { s: "•",    l: 70, t: 20, sz: 1.0, dur: 2.0, del: 0.7, op: 0.7, anim: "floatB" },
  { s: "CH₄",  l: 78, t: 65, sz: 1.0, dur: 4.2, del: 0.4, op: 0.7, anim: "floatC" },
  { s: "⬡",   l: 85, t: 35, sz: 1.8, dur: 6.0, del: 1.8, op: 0.7, anim: "spinSlow"},
  { s: "Fe",   l: 92, t: 55, sz: 1.1, dur: 3.0, del: 0.6, op: 0.7, anim: "floatA" },
  { s: "Cl₂",  l: 10, t: 50, sz: 0.9, dur: 2.7, del: 1.3, op: 0.7, anim: "floatB" },
  { s: "→",    l: 35, t: 45, sz: 1.3, dur: 3.3, del: 0.9, op: 0.7, anim: "floatC" },
  { s: "Mg",   l: 58, t: 8,  sz: 1.0, dur: 2.9, del: 1.6, op: 0.7, anim: "floatA" },
  { s: "•",    l: 88, t: 90, sz: 0.8, dur: 1.8, del: 0.1, op: 0.7, anim: "floatB" },
  { s: "K",    l: 25, t: 95, sz: 1.2, dur: 3.6, del: 1.1, op: 0.7, anim: "floatC" },
  { s: "⬡",   l: 72, t: 5,  sz: 1.5, dur: 7.0, del: 2.0, op: 0.7, anim: "spinSlow"},
];

export default function ChemBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25%      { transform: translateY(-18px) translateX(6px) rotate(8deg); }
          50%      { transform: translateY(-10px) translateX(-8px) rotate(-5deg); }
          75%      { transform: translateY(-22px) translateX(4px) rotate(12deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) translateX(0px) scale(1); }
          33%      { transform: translateY(14px) translateX(-10px) scale(1.2); }
          66%      { transform: translateY(-16px) translateX(8px) scale(0.85); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50%      { transform: translateY(-20px) rotate(20deg) scale(1.15); }
        }
        @keyframes spinSlow {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.l}%`,
            top: `${p.t}%`,
            fontSize: `${p.sz}em`,
            opacity: p.op,
            color: "#FFB2A6",
            fontWeight: 800,
            animation: `${p.anim} ${p.dur}s ease-in-out ${p.del}s infinite`,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {p.s}
        </span>
      ))}
    </div>
  );
}