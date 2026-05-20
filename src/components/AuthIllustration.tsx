export default function AuthIllustration({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative w-full max-w-md text-center">
      {/* Soft blurred accents */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FFB2A6]/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-12 -right-6 w-48 h-48 rounded-full bg-white/60 blur-3xl" aria-hidden />

      <div className="relative">
        <svg viewBox="0 0 320 260" className="w-full h-auto drop-shadow-sm" aria-hidden>
          {/* desk */}
          <rect x="20" y="200" width="280" height="10" rx="5" fill="#FFB2A6" opacity="0.5" />
          {/* book */}
          <rect x="60" y="150" width="120" height="55" rx="6" fill="#ffffff" stroke="#E7B79C" strokeWidth="2" />
          <line x1="120" y1="150" x2="120" y2="205" stroke="#E7B79C" strokeWidth="2" />
          <line x1="75" y1="165" x2="110" y2="165" stroke="#FFB2A6" strokeWidth="2" />
          <line x1="75" y1="175" x2="105" y2="175" stroke="#FFB2A6" strokeWidth="2" opacity="0.7" />
          <line x1="130" y1="165" x2="165" y2="165" stroke="#FFB2A6" strokeWidth="2" />
          <line x1="130" y1="175" x2="160" y2="175" stroke="#FFB2A6" strokeWidth="2" opacity="0.7" />
          {/* flask */}
          <path d="M210 120 L210 145 L195 195 Q193 205 205 205 L255 205 Q267 205 265 195 L250 145 L250 120 Z"
            fill="#ffffff" stroke="#d97a6c" strokeWidth="2.5" />
          <path d="M199 185 L261 185 L255 175 Q230 168 205 175 Z" fill="#FFB2A6" opacity="0.75" />
          <rect x="205" y="112" width="50" height="10" rx="3" fill="#d97a6c" />
          {/* bubbles */}
          <circle cx="220" cy="178" r="3" fill="#fff" opacity="0.9" />
          <circle cx="235" cy="172" r="2" fill="#fff" opacity="0.9" />
          <circle cx="245" cy="180" r="2.5" fill="#fff" opacity="0.9" />
          {/* atom */}
          <g transform="translate(120,80)">
            <circle cx="0" cy="0" r="6" fill="#d97a6c" />
            <ellipse cx="0" cy="0" rx="34" ry="12" fill="none" stroke="#d97a6c" strokeWidth="1.8" />
            <ellipse cx="0" cy="0" rx="34" ry="12" fill="none" stroke="#d97a6c" strokeWidth="1.8" transform="rotate(60)" />
            <ellipse cx="0" cy="0" rx="34" ry="12" fill="none" stroke="#d97a6c" strokeWidth="1.8" transform="rotate(-60)" />
          </g>
          {/* sparkles */}
          <g fill="#d97a6c">
            <circle cx="50" cy="60" r="2.5" />
            <circle cx="275" cy="70" r="3" />
            <circle cx="40" cy="130" r="2" />
            <circle cx="290" cy="160" r="2.5" />
          </g>
        </svg>

        <h2 className="mt-8 text-2xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}