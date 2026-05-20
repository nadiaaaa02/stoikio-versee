import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3000);
    const t2 = setTimeout(() => onDone(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white via-amber-50 to-rose-100 transition-opacity ease-in-out " +
        (leaving ? "opacity-0 pointer-events-none duration-[1200ms]" : "opacity-100 duration-500")
      }
    >
      <div className="flex flex-col items-center gap-5 animate-[splash-in_0.8s_ease-out]">
        <div className="w-20 h-20 rounded-2xl bg-amber-500 text-gray-900 flex items-center justify-center text-4xl font-extrabold shadow-lg animate-pulse">
          S
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-baseline">
          <span style={{ color: "#FFB2A6" }}>Stoikio</span>
          <span className="ml-0.5 rounded-md px-1.5 py-0.5" style={{ color: "#FFB2A6", backgroundColor: "#FFF89A" }}>Verse</span>
        </h1>
        <div className="mt-2 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
