import { useState, useMemo, useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MathBlock, InlineMath } from "@/components/MathText";
import SplashScreen from "@/components/SplashScreen";
import VideoCard from "@/components/VideoCard";
import Reveal from "@/components/Reveal";
import EbookViewer from "@/components/EbookViewer";
import BrandLogo from "@/components/BrandLogo";
import petaKonsep from "@/assets/peta-konsep-stoikiometri.png";

const EBOOK_URL = "/ebook/Panduan_Stoikiometri_Interaktif.pdf";

type PageId = "home" | "belajar" | "lab" | "game" | "evaluasi" | "refleksi";

const NAV: { id: PageId; label: string; num: number }[] = [
  { id: "home", label: "Beranda", num: 1 },
  { id: "belajar", label: "Materi", num: 2 },
  { id: "lab", label: "Virtual Lab", num: 3 },
  { id: "game", label: "Game", num: 4 },
  { id: "evaluasi", label: "Evaluasi", num: 5 },
  { id: "refleksi", label: "Refleksi", num: 6 },
];

export default function Index() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [page, setPage] = useState<PageId>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore session from localStorage (set by /login or /register pages).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sb_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) {
          setUserName(u.name);
          setLoggedIn(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const requireAuth = (p: PageId) => {
    if (p !== "home" && !loggedIn) {
      navigate("/login");
      return;
    }
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showPage = requireAuth;

  const handleLogout = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    try { localStorage.removeItem("sb_user"); } catch { /* ignore */ }
    setLoggedIn(false);
    setUserName("");
    setPage("home");
  };

  const progress = useMemo(() => {
    const idx = NAV.findIndex((n) => n.id === page);
    return ((idx + 1) / NAV.length) * 100;
  }, [page]);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div key={loggedIn ? "in" : "out"} className="min-h-screen text-gray-800 animate-slide-up-fade">

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <button onClick={() => showPage("home")} className="flex items-center gap-2 font-bold">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-gray-900 flex items-center justify-center font-extrabold">S</span>
            <BrandLogo size="md" />
          </button>
          <div className="flex items-center gap-2">
            {!loggedIn && (
              <Link to="/login" className="px-3 py-1.5 rounded-lg bg-amber-500 text-gray-900 font-semibold text-sm">Login</Link>
            )}
            <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2 rounded-lg hover:bg-gray-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></> : <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>}
              </svg>
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setMobileOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 shadow-xl rounded-r-3xl" onClick={(e) => e.stopPropagation()}>
            <SidebarInner page={page} progress={progress} onSelect={showPage} />
          </aside>
        </div>
      )}

      <aside className="hidden md:flex fixed inset-y-4 left-4 w-60 bg-white/45 backdrop-blur-xl border border-white/60 p-5 flex-col z-40 rounded-3xl shadow-[0_8px_32px_-12px_rgba(255,178,166,0.25)]">
        <SidebarInner page={page} progress={progress} onSelect={showPage} />
      </aside>

      <div className="md:pl-[17rem] md:pr-4">
        <header className="sticky top-4 z-30 bg-white/55 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_6px_24px_-12px_rgba(0,0,0,0.08)] hidden md:block mt-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-300 flex items-center justify-center text-gray-900 font-bold text-sm shadow-sm">{loggedIn && userName ? userName.charAt(0).toUpperCase() : "?"}</span>
              <span className="font-bold text-gray-800 text-sm sm:text-base">{loggedIn ? `Halo, ${userName}!` : "Selamat datang!"}</span>
            </div>
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-white/70 border border-rose-300 text-rose-500 hover:bg-rose-50 hover:border-rose-400 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold text-sm px-5 py-2 rounded-xl transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="md:bg-white/55 md:backdrop-blur-xl md:border md:border-white/60 md:rounded-3xl md:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] md:p-6 lg:p-10">
            {page === "home" && <HomePage onStart={() => loggedIn ? showPage("belajar") : navigate("/login")} />}
            {page === "belajar" && <BelajarPage onNext={() => showPage("lab")} />}
            {page === "lab" && <VirtualLabPage onNext={() => showPage("game")} />}
            {page === "game" && <GamePage onNext={() => showPage("evaluasi")} />}
            {page === "evaluasi" && <EvaluasiPage onNext={() => showPage("refleksi")} />}
            {page === "refleksi" && <RefleksiPage onRestart={() => showPage("home")} />}
          </div>
        </main>
        <footer className="mt-8">
          <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
            © {new Date().getFullYear()} <BrandLogo size="sm" /> — Belajar Mandiri.
          </div>
        </footer>
      </div>

      </div>

    </>
  );
}

/* ========== SIDEBAR ========== */
function SidebarInner({ page, progress, onSelect }: { page: PageId; progress: number; onSelect: (p: PageId) => void }) {
  return (
    <>
      <button onClick={() => onSelect("home")} className="flex items-center gap-2 font-bold text-gray-800 mb-6">
        <span className="w-9 h-9 rounded-xl bg-amber-500 text-gray-900 flex items-center justify-center font-extrabold">S</span>
        <BrandLogo size="md" />
      </button>
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => onSelect(n.id)} className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left " + (active ? "bg-rose-200 text-gray-900" : "text-gray-600 hover:bg-amber-50")}>
              <span className={"w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold " + (active ? "bg-white text-gray-900" : "bg-gray-100 text-gray-600")}>{n.num}</span>
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <div className="text-xs text-gray-500 mb-2">Progres</div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </>
  );
}

/* ========== HOME (Landing Page) ========== */
function BubblesBg() {
  const bubbles = Array.from({ length: 14 });
  return (
    <div className="bubbles-bg" aria-hidden>
      {bubbles.map((_, i) => {
        const size = 40 + Math.random() * 120;
        const left = Math.random() * 100;
        const dur = 14 + Math.random() * 18;
        const delay = -Math.random() * dur;
        return (
          <span
            key={i}
            className="bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-5 sm:p-6 hover:-translate-y-1 transition-transform">
      <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function FlowNode({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="glass-card px-5 py-4 text-center min-w-[180px]">
      <div className="font-bold text-gray-800">{title}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

function HomePage({ onStart }: { onStart: () => void }) {
  const features = [
    { icon: "🧪", title: "Simulasi Interaktif", desc: "Eksperimen virtual untuk memahami reaksi kimia secara visual." },
    { icon: "📚", title: "Materi Lengkap", desc: "Konsep mol, hukum dasar, hingga pereaksi pembatas dalam satu tempat." },
    { icon: "🎯", title: "Pembelajaran Mandiri", desc: "Belajar sesuai ritmemu — ulangi, jelajahi, dan kuasai." },
    { icon: "📝", title: "Evaluasi Komprehensif", desc: "Latihan & kuis dengan umpan balik instan untuk mengukur progres." },
  ];

  const steps = [
    { n: "01", title: "Registrasi", desc: "Buat akun dan masuk untuk menyimpan progres belajarmu." },
    { n: "02", title: "Pilih Materi", desc: "Pilih topik yang ingin dipelajari dari peta konsep." },
    { n: "03", title: "Praktik Simulasi", desc: "Latih pemahaman lewat simulasi dan game interaktif." },
    { n: "04", title: "Evaluasi Diri", desc: "Selesaikan kuis untuk mengukur tingkat penguasaanmu." },
  ];

  return (
    <section className="space-y-20 sm:space-y-28">
      {/* 1. HERO */}
      <div className="relative overflow-hidden glass-card p-8 sm:p-14">
        <BubblesBg />
        <div className="relative z-10">
          <Reveal>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-gray-900 text-xs font-semibold mb-4">
              KIMIA · STOIKIOMETRI
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-800">
              Halo <span className="text-amber-500">Sobat Kimia</span>!
            </h1>
            <p className="mt-3 text-gray-600 text-base sm:text-lg max-w-2xl">
              Ruang belajar stoikiometri yang interaktif, ringan, dan menyenangkan —
              dirancang agar konsep kimia terasa dekat dan mudah dipahami.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-6">
            <div className="glass-card p-6 sm:p-8 max-w-3xl">
              <p className="text-gray-700 leading-relaxed text-justify">
                Selamat datang di <strong><BrandLogo size="md" /></strong>. Di sini kamu akan
                mempelajari hubungan kuantitatif antara reaktan dan produk dalam reaksi kimia,
                mulai dari konsep mol, penyetaraan reaksi, hukum-hukum gas, hingga perhitungan
                rumus empiris dan pereaksi pembatas.
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed text-center">
                Contoh sederhana: pada reaksi pembentukan air,
              </p>
              <MathBlock className="my-3 text-center" tex={"2H_{2} + O_{2} \\rightarrow 2H_{2}O"} />
              <p className="text-gray-700 leading-relaxed text-center">
                jumlah mol air yang terbentuk dapat dihitung dengan rumus:
              </p>
              <MathBlock className="my-3 text-center" tex={"n = \\dfrac{m}{M_{r}}"} />
              <p className="mt-4 text-gray-700 leading-relaxed text-justify">
                Mari pelajari konsepnya, latih dengan simulasi, dan uji pemahamanmu lewat evaluasi.
              </p>
            </div>
          </Reveal>

        </div>
      </div>

      {/* 2. PETUNJUK PENGGUNAAN */}
      <div>
        <Reveal>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800">
            PETUNJUK PENGGUNAAN
          </h2>
          <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
            Empat fitur utama yang akan menemani perjalanan belajarmu.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <FeatureCard icon={<span className="text-2xl">{f.icon}</span>} title={f.title} desc={f.desc} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* 3. LANGKAH-LANGKAH PENGGUNAAN */}
      <div>
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800">
            Langkah-langkah Penggunaan
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl">
            Ikuti empat langkah sederhana untuk memulai pengalaman belajarmu.
          </p>
        </Reveal>
        <div className="grid lg:grid-cols-2 gap-8 mt-8 items-start">
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120} as="li">
                <div className="glass-card p-5 flex gap-4 items-start">
                  <div className="text-3xl font-extrabold text-amber-500 leading-none w-14 shrink-0">{s.n}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{s.title}</div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200}>
            <EbookViewer />
          </Reveal>
        </div>
      </div>

      {/* 4. PETA KONSEP MATERI */}
      <div>
        <Reveal>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800">
            Peta Konsep Pembelajaran
          </h2>
          <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
            Visualisasi alur konsep utama dalam pembelajaran stoikiometri.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-8 group bg-white border border-gray-200 rounded-3xl p-3 sm:p-5 soft-shadow-md overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-amber-200">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/60 via-white to-rose-50/60">
              <img
                src={petaKonsep}
                alt="Peta konsep pembelajaran stoikiometri"
                loading="lazy"
                className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* 5. CALL TO ACTION */}
      <Reveal>
        <div className="relative overflow-hidden glass-card p-10 sm:p-16 text-center">
          <BubblesBg />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-800">
              LET'S START!
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto inline-flex flex-wrap items-center justify-center gap-1">
              Mulai perjalanan pembelajaran kimia Anda bersama <BrandLogo size="md" /> sekarang juga!
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-2xl bg-amber-500 text-gray-900 font-bold shadow-lg hover:opacity-90"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-2xl bg-transparent border-2 border-amber-500 text-gray-800 font-bold hover:bg-amber-50"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ========== EXERCISES ========== */
type Exercise = { q: React.ReactNode; ans: number; hint?: string; unit?: string };

const STEP_EXERCISES: Record<string, Exercise[]> = {
  pengertian: [
    { q: <>Stoikiometri membahas hubungan ... antara reaktan dan produk. Ketik <strong>1</strong> jika jawabannya "kuantitatif", atau <strong>0</strong> jika "kualitatif".</>, ans: 1, hint: "Stoikiometri = matematika dari reaksi kimia." },
    { q: <>Berapa jumlah jenis besaran utama yang dipelajari dalam stoikiometri (mol, massa, volume, jumlah partikel)?</>, ans: 4 },
    { q: <>Reaksi: 1 molekul CH<sub>4</sub> + 2 molekul O<sub>2</sub> → 1 CO<sub>2</sub> + 2 H<sub>2</sub>O. Total molekul produk?</>, ans: 3 },
    { q: <>Setarakan reaksi: H<sub>2</sub> + O<sub>2</sub> → H<sub>2</sub>O. Berapa koefisien H<sub>2</sub>O setelah setara?</>, ans: 2 },
    { q: <>Setarakan: ?Al + ?HCl → ?AlCl<sub>3</sub> + ?H<sub>2</sub>. Berapa koefisien HCl?</>, ans: 6 },
  ],
  mol: [
    { q: <>Berapa mol dari 36 g H<sub>2</sub>O? (M<sub>r</sub>=18)</>, ans: 2, unit: "mol" },
    { q: <>Berapa gram dari 0,25 mol NaOH? (M<sub>r</sub>=40)</>, ans: 10, unit: "g" },
    { q: <>Berapa jumlah molekul dalam 0,5 mol gas O<sub>2</sub>? (×10²³, gunakan N<sub>A</sub>=6,02×10²³)</>, ans: 3.01, hint: "0,5 × 6,02 = 3,01 (×10²³)" },
    { q: <>Berapa volume 2 mol gas CO<sub>2</sub> pada STP (L)?</>, ans: 44.8, unit: "L" },
  ],
  rumus: [
    { q: <>Senyawa: 75% C, 25% H (C=12, H=1). Jumlah atom H dalam rumus empirisnya?</>, ans: 4, hint: "Bandingkan mol C:H." },
    { q: <>Rumus empiris CH<sub>2</sub>O, M<sub>r</sub>=180. Berapa indeks C dalam rumus molekul?</>, ans: 6 },
    { q: <>Senyawa 40% S dan 60% O (S=32, O=16). Indeks O dalam rumus empiris?</>, ans: 3, hint: "S:O = 1,25:3,75 = 1:3" },
    { q: <>Rumus empiris NO<sub>2</sub>, M<sub>r</sub>=92. Berapa indeks N dalam rumus molekul?</>, ans: 2 },
  ],
  pembatas: [
    { q: <>2Al + 3Cl<sub>2</sub> → 2AlCl<sub>3</sub>. 0,2 mol Al + 0,1 mol Cl<sub>2</sub>. Berapa mol AlCl<sub>3</sub> max?</>, ans: 0.067, unit: "mol", hint: "Cl₂ pembatas: 0,1 × 2/3" },
    { q: <>N<sub>2</sub> + 3H<sub>2</sub> → 2NH<sub>3</sub>. 4 mol N<sub>2</sub> + 9 mol H<sub>2</sub>. Mol NH<sub>3</sub> max?</>, ans: 6, unit: "mol", hint: "H₂ pembatas." },
    { q: <>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O. 5 mol H<sub>2</sub> + 3 mol O<sub>2</sub>. Mol O<sub>2</sub> sisa?</>, ans: 0.5, unit: "mol" },
  ],
  persen: [
    { q: <>Zn + S → ZnS. Hasil 92 g dari teoritis 97 g. % hasil?</>, ans: 94.85, unit: "%" },
    { q: <>Reaksi teoritis 50 g, aktual 40 g. Berapa % yield?</>, ans: 80, unit: "%" },
    { q: <>Hasil aktual 18 g, % yield = 90%. Berapa hasil teoritis (g)?</>, ans: 20, unit: "g" },
  ],
  kemurnian: [
    { q: <>Sampel 80 g batu kapur mengandung 60 g CaCO<sub>3</sub>. Berapa % kemurnian?</>, ans: 75, unit: "%" },
    { q: <>2Cu + O<sub>2</sub> → 2CuO. 6,8 g CuO (M<sub>r</sub>=79,5) berasal dari 6,4 g sampel Cu. Berapa % kemurnian Cu? (A<sub>r</sub> Cu=63,5)</>, ans: 83, unit: "%", hint: "mol CuO ≈ 0,085 → massa Cu ≈ 5,34 g" },
    { q: <>Sampel 50 g mengandung 45 g zat murni. Berapa % kemurnian?</>, ans: 90, unit: "%" },
  ],
};

function StepExercise({ subId, onPass }: { subId: string; onPass: () => void }) {
  const list = STEP_EXERCISES[subId] ?? [];
  const [idx, setIdx] = useState(0);
  const ex = list[idx];
  const [val, setVal] = useState("");
  const [state, setState] = useState<null | boolean>(null);
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState<boolean[]>([]);

  // Reset on step change — use key prop pattern handled externally or effect
  // We use a simple effect keyed on subId
  const resetRef = useState(subId)[0];
  if (resetRef !== subId) {
    // This won't work in strict mode; use key instead
  }
  // Actually use useEffect
  useState(() => {
    // initial
  });

  // Simpler: just key the component from parent. But let's keep the effect approach from original:
  // (The parent should use key={active} on StepExercise)

  if (!ex) return null;

  const allDone = solved.length === list.length && solved.every(Boolean);

  const verify = () => {
    const num = parseFloat(val.replace(",", "."));
    const tol = Math.max(0.05, Math.abs(ex.ans) * 0.02);
    const ok = !Number.isNaN(num) && Math.abs(num - ex.ans) < tol;
    setState(ok);
    setTries((t) => t + 1);
    if (ok) {
      setSolved((arr) => { const next = [...arr]; next[idx] = true; return next; });
    }
  };

  const goTo = (i: number) => { setIdx(i); setVal(""); setState(null); setTries(0); };
  const nextQ = () => { if (idx < list.length - 1) goTo(idx + 1); };

  // Initialize solved array if needed
  if (solved.length !== list.length) {
    setSolved(new Array(list.length).fill(false));
  }

  const inputCls = state === true ? "bg-green-500 text-white border-green-500" : state === false ? "bg-red-500 text-white border-red-500" : val ? "bg-amber-500 text-gray-900 border-amber-500" : "bg-white border-gray-300 text-gray-800";

  return (
    <div className="mt-8 bg-amber-50 border-2 border-amber-300 rounded-xl p-5 soft-shadow">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs uppercase tracking-wide font-bold text-amber-700">Latihan untuk materi ini — Soal {idx + 1} / {list.length}</div>
        <div className="flex gap-1">
          {list.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={"w-7 h-7 text-xs font-bold rounded-md border-2 transition-colors " + (i === idx ? "bg-gray-800 text-white border-gray-800" : solved[i] ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700 border-gray-300 hover:border-amber-400")} title={`Soal ${i + 1}${solved[i] ? " (selesai)" : ""}`}>
              {solved[i] ? "✓" : i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 text-gray-800">{ex.q}</div>
      {ex.hint && tries > 0 && state !== true && <div className="mt-2 text-xs text-gray-600 italic">💡 {ex.hint}</div>}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <input type="text" value={val} onChange={(e) => { setVal(e.target.value); setState(null); }} placeholder="Jawaban..." className={"px-4 py-2 rounded-lg border-2 outline-none font-semibold transition-colors w-40 placeholder:text-gray-400 placeholder:font-normal " + inputCls} />
        {ex.unit && <span className="text-sm text-gray-600 font-semibold">{ex.unit}</span>}
        <button onClick={verify} className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg">Cek</button>
        {state === true && <span className="text-green-600 font-semibold text-sm">✓ Benar</span>}
        {state === false && <span className="text-red-600 font-semibold text-sm">✗ Salah, coba lagi</span>}
        <div className="flex-1" />
        {idx < list.length - 1 && (
          <button onClick={nextQ} disabled={!solved[idx]} className="bg-white border-2 border-amber-400 hover:bg-amber-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed text-amber-700 font-semibold px-4 py-2 rounded-lg transition-colors">Soal berikutnya →</button>
        )}
        <button onClick={onPass} disabled={!allDone} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 font-semibold px-5 py-2 rounded-lg transition-colors">Lanjut ke materi berikutnya →</button>
      </div>
      {state !== true && tries >= 3 && (
        <div className="mt-3 text-xs text-gray-600">
          Sudah mencoba {tries}× pada soal ini — kamu boleh melewatinya.
          <button onClick={() => { setSolved((arr) => { const next = [...arr]; next[idx] = true; return next; }); if (idx < list.length - 1) goTo(idx + 1); }} className="ml-2 underline text-amber-700 font-semibold">Lewati soal ini</button>
        </div>
      )}
      {allDone && <div className="mt-3 text-sm text-green-700 font-semibold">🎉 Semua latihan pada materi ini selesai! Klik "Lanjut ke materi berikutnya".</div>}
    </div>
  );
}

/* ========== BELAJAR (Materi) ========== */
function BelajarPage({ onNext }: { onNext: () => void }) {
  const materiData = [
    { id: "pengertian", title: "A. Pengertian Stoikiometri", youtubeIds: ["ueNiWPwMB8E", "pcT0WdQjPwI"] },
    { id: "mol", title: "B. Konsep Mol", youtubeIds: ["XRC6EoRpQi0", "agbMBttBBxM", "AtwsuxIKJzs"] },
    { id: "rumus", title: "C. Rumus Molekul dan Rumus Empiris", youtubeIds: ["utbSaXsRLtU", "_ixBN_3r-QY"] },
    { id: "pembatas", title: "D. Pereaksi Pembatas", youtubeIds: [] as string[] },
    { id: "persen", title: "E. Persen Hasil", youtubeIds: [] as string[] },
    { id: "kemurnian", title: "F. Persen Kemurnian", youtubeIds: ["vLmgaeAPSio"] },
  ];
  const subs = materiData;
  const [stepIdx, setStepIdx] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const active = subs[stepIdx].id;
  const activeVideos = subs[stepIdx].youtubeIds;

  const goToStep = (i: number) => {
    if (i <= unlocked) { setStepIdx(i); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handlePass = () => {
    if (stepIdx === subs.length - 1) { onNext(); return; }
    const next = stepIdx + 1;
    setStepIdx(next);
    setUnlocked((u) => Math.max(u, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const innerProgress = ((stepIdx + 1) / subs.length) * 100;

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-800">Materi Stoikiometri</h1>
      <p className="text-gray-500 mt-1">Pelajari materi <strong>satu per satu</strong> — setiap selesai membaca, kerjakan latihan singkat sebelum lanjut ke materi berikutnya.</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="text-sm font-semibold text-gray-700">Langkah {stepIdx + 1} / {subs.length}</div>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${innerProgress}%` }} />
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-gray-50 border border-gray-200 rounded-xl p-3 h-fit">
          {subs.map((s, i) => {
            const isLocked = i > unlocked;
            const isActive = active === s.id;
            return (
              <button key={s.id} onClick={() => goToStep(i)} disabled={isLocked} className={"w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors flex items-center gap-2 " + (isActive ? "bg-amber-500 text-gray-900" : isLocked ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-white")}>
                <span className="text-xs">{isLocked ? "🔒" : i < unlocked ? "✓" : "•"}</span>
                <span className="flex-1">{s.title}</span>
              </button>
            );
          })}
        </aside>

        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 soft-shadow materi-content">
          {active === "pengertian" && <MateriPengertian />}
          {active === "mol" && <MateriMol />}
          {active === "rumus" && <MateriRumus />}
          {active === "pembatas" && <MateriPembatas />}
          {active === "persen" && <MateriPersen />}
          {active === "kemurnian" && <MateriKemurnian />}

          <div className="mt-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Video Pembelajaran</h3>
            {activeVideos.length > 0 ? (
              <div className="grid gap-4 sm:gap-6">
                {activeVideos.map((id) => (
                  <div key={id} className="relative w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${id}`}
                      title={`Video ${id}`}
                      loading="lazy"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl px-5 py-8 text-center text-gray-500 text-sm">
                Video untuk materi ini sedang dalam tahap penyusunan.
              </div>
            )}
          </div>

          <StepExercise key={active} subId={active} onPass={handlePass} />
          {stepIdx === subs.length - 1 && (
            <div className="mt-4 text-center text-xs text-gray-500">Setelah menjawab latihan terakhir, kamu akan otomatis lanjut ke <strong>Game</strong>.</div>
          )}
        </div>
      </div>
    </section>
  );
}

/* --- Materi Sub-sections --- */

function MateriPengertian() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800">STOIKIOMETRI</h1>
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-800">
        <strong>Tujuan Pembelajaran:</strong>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>Dapat menjelaskan pengertian stoikiometri.</li>
          <li>Menyetarakan persamaan reaksi.</li>
          <li>Menggunakan konsep mol dalam perhitungan.</li>
          <li>Menentukan rumus molekul dan rumus empiris.</li>
          <li>Menentukan pereaksi pembatas.</li>
          <li>Menghitung persen hasil dari suatu reaksi kimia.</li>
          <li>Memahami stokiometri dalam kehidupan sehari-hari.</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mt-6">A. Pengertian Stoikiometri</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Stoikiometri berasal dari bahasa Yunani, <em>stoicheion</em> yang berarti unsur dan metron yang berarti
        pengukuran, sehingga stoikiometri bisa diartikan pengukuran atau perhitungan matematis dari reaktan dan produk
        sebuah reaksi kimia. Sederhananya, stoikiometri adalah hubungan kuantitatif antara reaktan dan produk dalam
        sebuah reaksi kimia.
      </p>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Kalian akan dapat melakukan perhitungan matematika dari sebuah reaksi kimia dengan memahami stoikiometri.
        Massa, volume, dan jumlah zat yang terlibat dalam reaksi kimia dapat kalian hitung dengan melihat hubungan
        antara reaktan dan produk dengan menggunakan informasi-informasi yang tersedia.
      </p>

      <h3 className="mt-5 font-semibold text-gray-800">1. Prinsip Penyetaraan Reaksi</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">
        Prinsip penyetaraan persamaan reaksi adalah jumlah atom yang ada pada sisi kiri (reaktan) harus sama dengan
        jumlah atom pada sisi kanan (produk). Mari perhatikan reaksi berikut.
      </p>
      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-center">
        H<sub>2</sub> + O<sub>2</sub> → H<sub>2</sub>O
      </div>
      <p className="mt-3 text-gray-700">Apakah persamaan reaksi di atas sudah setara? Coba kita cek jumlah atom di sisi reaktan dan produk.</p>

      <table className="mt-4 w-full text-sm border border-gray-200">
        <thead className="bg-amber-100">
          <tr><th className="p-2 border border-gray-200">Atom</th><th className="p-2 border border-gray-200">Jumlah atom di sisi kiri (reaktan)</th><th className="p-2 border border-gray-200">Jumlah atom di sisi kanan (produk)</th></tr>
        </thead>
        <tbody className="text-center">
          <tr><td className="p-2 border">Hidrogen (H)</td><td className="p-2 border">2</td><td className="p-2 border">2</td></tr>
          <tr><td className="p-2 border">Oksigen (O)</td><td className="p-2 border">2</td><td className="p-2 border">1</td></tr>
        </tbody>
      </table>

      <p className="mt-4 text-gray-700 leading-relaxed">
        Jumlah atom H di sisi reaktan sudah sama dengan jumlah atom H di sisi produk, tetapi jumlah atom O di sisi
        kiri dan kanan berbeda. Dengan demikian, kita katakan reaksi kimia tersebut belum setara.
      </p>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Untuk menyetarakan persamaan reaksi tersebut, kalian perlu menambahkan angka (koefisien) di depan unsur atau
        senyawa agar jumlah atom-atom di sisi reaktan dan produk sama.
      </p>
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 font-mono text-center text-lg font-bold">
        2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O
      </div>
      <p className="mt-3 text-gray-700">Mari kita cek kembali jumlah atom hidrogen dan oksigen di sisi reaktan dan produk.</p>

      <table className="mt-4 w-full text-sm border border-gray-200">
        <thead className="bg-amber-100">
          <tr><th className="p-2 border border-gray-200">Atom</th><th className="p-2 border border-gray-200">Jumlah atom di sisi kiri (reaktan)</th><th className="p-2 border border-gray-200">Jumlah atom di sisi kanan (produk)</th></tr>
        </thead>
        <tbody className="text-center">
          <tr><td className="p-2 border">Hidrogen (H)</td><td className="p-2 border">2 × 2 = 4</td><td className="p-2 border">2 × 2 = 4</td></tr>
          <tr><td className="p-2 border">Oksigen (O)</td><td className="p-2 border">1 × 2 = 2</td><td className="p-2 border">2 × 1 = 2</td></tr>
        </tbody>
      </table>
      <p className="mt-4 text-gray-700 leading-relaxed">
        Setelah kita cek ulang, ternyata jumlah atom hidrogen di sisi kiri sudah sama dengan sisi kanan, begitu juga
        dengan atom oksigen. Dengan demikian, bisa kita katakan bahwa reaksi tersebut sudah setara.
      </p>
    </>
  );
}

function MateriMol() {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800">B. Konsep Mol</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Selain terampil dalam menyetarakan reaksi kimia, kalian juga harus paham dengan konsep mol. Mol adalah satuan yang digunakan untuk menunjukkan jumlah zat.
      </p>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Satu mol menunjukkan banyaknya partikel yang terkandung dalam suatu unsur, ion, molekul, atau senyawa yang
        jumlahnya sama dengan jumlah partikel dalam 12 gram atom C-12. Jumlah partikel dalam satu mol adalah
        6,022 × 10<sup>23</sup>, yang dikenal juga sebagai bilangan Avogadro.
      </p>

      <h3 className="mt-5 font-semibold text-gray-800">1. Hubungan Mol Dengan Massa</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">
        Jumlah mol dapat dihitung dengan membagi massa zat dengan nilai M<sub>r</sub> atau A<sub>r</sub>.
      </p>
      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <MathBlock tex="n = \dfrac{m}{M_r}" />
      </div>

      <h3 className="mt-5 font-semibold text-gray-800">2. Hubungan Mol Dengan Jumlah Partikel</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">
        Dalam satu mol zat terdapat 6,022 × 10<sup>23</sup> partikel (bilangan Avogadro).
      </p>
      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <MathBlock tex="n = \dfrac{N}{6{,}02 \times 10^{23}}" />
      </div>

      <h3 className="mt-5 font-semibold text-gray-800">3. Hubungan Mol Dengan Volume (STP)</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">
        Pada kondisi standar (STP: 0°C, 1 atm), satu mol gas menempati volume 22,4 liter.
      </p>
      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <MathBlock tex="n = \dfrac{V}{22{,}4}" />
      </div>

      <h3 className="mt-5 font-semibold text-gray-800">Contoh:</h3>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 space-y-3">
        <div>
          <p>• Hitunglah massa dari 0,1 mol gas karbon dioksida!</p>
          <p className="mt-1">Diketahui: 0,1 mol karbon dioksida<br/>Ditanya: massa gas karbon dioksida</p>
          <p className="mt-1"><strong>Jawab:</strong></p>
          <p>Massa CO<sub>2</sub> = mol × massa molar CO<sub>2</sub><br/>= 0,1 mol × 44 g·mol<sup>−1</sup> = 4,4 g</p>
        </div>
        <div>
          <p>• Hitunglah jumlah mol dari 18 gram air!</p>
          <p className="mt-1"><strong>Jawab:</strong></p>
          <p>Mol air = <InlineMath tex="\dfrac{\text{massa}}{\text{massa molar}}" /> = <InlineMath tex="\dfrac{18 \text{ g}}{18 \text{ g·mol}^{-1}}" /> = 1 mol</p>
        </div>
        <div>
          <p>• Berapakah jumlah mol dari 11,2 liter gas hidrogen pada STP?</p>
          <p className="mt-1"><strong>Jawab:</strong></p>
          <p>Mol hidrogen = <InlineMath tex="\dfrac{V}{22{,}4}" /> = <InlineMath tex="\dfrac{11{,}2}{22{,}4}" /> = 0,5 mol</p>
        </div>
      </div>
    </>
  );
}

function MateriRumus() {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800">C. Rumus Molekul Dan Rumus Empiris</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Rumus molekul menunjukkan jumlah sebenarnya dari atom yang menyusun molekul senyawa. Rumus empiris menunjukkan perbandingan paling sederhana dari jumlah atom-atom yang menyusun molekul.
      </p>

      <h3 className="mt-5 font-semibold text-gray-800">1. Cara Menentukan Rumus Empiris:</h3>
      <ul className="mt-2 text-gray-700 list-disc pl-6 space-y-1 text-sm">
        <li>Menghitung massa dari atom-atom penyusun molekul.</li>
        <li>Menghitung mol dari masing-masing atom.</li>
        <li>Menghitung rasio mol dari atom-atom penyusun.</li>
        <li>Menentukan rumus empiris berdasarkan rasio.</li>
      </ul>

      <h3 className="mt-5 font-semibold text-gray-800">2. Cara Menentukan Rumus Molekul:</h3>
      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <MathBlock tex="\text{Rumus molekul} = \text{rumus empiris} \times N" />
        <div className="mt-1">
          <MathBlock tex="N = \dfrac{M_r\;\text{senyawa}}{M_r\;\text{rumus empiris}}" />
        </div>
      </div>

      <h3 className="mt-5 font-semibold text-gray-800">Contoh:</h3>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
        <p>Tentukan rumus empiris dari senyawa yang disusun oleh 75% karbon dan 25% hidrogen!</p>
        <p className="mt-2"><strong>Jawab:</strong></p>
        <p className="mt-1"><em>Langkah 1</em>: Massa karbon = 75% × 100 g = 75 g; Massa hidrogen = 25% × 100 g = 25 g</p>
        <p className="mt-2"><em>Langkah 2</em>: Mol karbon = <InlineMath tex="\dfrac{75}{12}" /> = 6,25 mol; Mol hidrogen = <InlineMath tex="\dfrac{25}{1}" /> = 25 mol</p>
        <p className="mt-2"><em>Langkah 3</em>: Rasio = 6,25 : 25 = 1 : 4</p>
        <p className="mt-2">Maka rumus empirisnya adalah CH<sub>4</sub>.</p>
      </div>
    </>
  );
}

function MateriPembatas() {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800">D. Pereaksi Pembatas</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Reaktan yang sudah habis ketika reaktan lain masih bersisa disebut sebagai pereaksi pembatas. Pereaksi pembatas akan membatasi jumlah produk yang dihasilkan.
      </p>
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
        <mark>500 g tepung beras + 800 ml santan + 400 g kelapa parut → 100 buah kue pancong.</mark>
      </div>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Jika tersedia 500 g tepung beras, 1 liter santan, dan 600 g kelapa parut, berapakah kue pancong yang bisa dibuat?
      </p>

      <table className="mt-3 w-full text-sm border border-gray-200">
        <thead className="bg-amber-100">
          <tr><th className="p-2 border">Reaktan</th><th className="p-2 border">Perbandingan Ketersediaan Dan Kebutuhan Resep</th></tr>
        </thead>
        <tbody className="text-center">
          <tr><td className="p-2 border">Tepung beras</td><td className="p-2 border"><InlineMath tex="\dfrac{500}{300} = 1{,}67" /></td></tr>
          <tr><td className="p-2 border">Kelapa parut</td><td className="p-2 border"><InlineMath tex="\dfrac{600}{400} = 1{,}5" /></td></tr>
          <tr><td className="p-2 border">Santan</td><td className="p-2 border"><InlineMath tex="\dfrac{1000}{800} = 1{,}25" /></td></tr>
        </tbody>
      </table>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Pereaksi pembatas = reaktan dengan perbandingan terkecil → <strong>santan</strong>.
      </p>

      <h3 className="mt-5 font-semibold text-gray-800">Contoh Reaksi Kimia:</h3>
      <p className="mt-2 text-gray-700">Sebanyak 5,4 g aluminium + 7,1 g gas klorin:</p>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-center">
        2Al(s) + 3Cl<sub>2</sub>(g) → 2AlCl<sub>3</sub>(s)
      </div>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
        Mol Al = <InlineMath tex="\dfrac{5{,}4}{27}" /> = 0,2 mol; &nbsp; Mol Cl<sub>2</sub> = <InlineMath tex="\dfrac{7{,}1}{71}" /> = 0,1 mol
      </div>

      <table className="mt-3 w-full text-sm border border-gray-200">
        <thead className="bg-amber-100">
          <tr><th className="p-2 border">Reaktan</th><th className="p-2 border">mol / koefisien</th></tr>
        </thead>
        <tbody className="text-center">
          <tr><td className="p-2 border">Aluminium</td><td className="p-2 border"><InlineMath tex="\dfrac{0{,}2}{2} = 0{,}1" /></td></tr>
          <tr><td className="p-2 border">Gas klorin</td><td className="p-2 border"><InlineMath tex="\dfrac{0{,}1}{3} = 0{,}033" /></td></tr>
        </tbody>
      </table>
      <p className="mt-3 text-gray-700">Gas klorin memiliki nilai terkecil → <strong>pereaksi pembatas</strong>.</p>

      <h3 className="mt-5 font-semibold text-gray-800">Contoh Lanjutan:</h3>
      <p className="mt-2 text-gray-700">8 g gas metana + 16 g gas oksigen:</p>
      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 font-mono text-center">
        CH<sub>4</sub> + 2O<sub>2</sub> → CO<sub>2</sub> + 2H<sub>2</sub>O
      </div>
      <table className="mt-2 w-full text-sm border border-gray-200">
        <thead className="bg-amber-100">
          <tr><th className="p-2 border">Gas</th><th className="p-2 border">Massa</th><th className="p-2 border">Mol</th><th className="p-2 border">Koef.</th><th className="p-2 border">mol / koef.</th></tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td className="p-2 border">CH<sub>4</sub></td><td className="p-2 border">8 g</td>
            <td className="p-2 border"><InlineMath tex="\dfrac{8}{16} = 0{,}5" /></td>
            <td className="p-2 border">1</td>
            <td className="p-2 border"><InlineMath tex="\dfrac{0{,}5}{1} = 0{,}5" /></td>
          </tr>
          <tr>
            <td className="p-2 border">O<sub>2</sub></td><td className="p-2 border">16 g</td>
            <td className="p-2 border"><InlineMath tex="\dfrac{16}{32} = 0{,}5" /></td>
            <td className="p-2 border">2</td>
            <td className="p-2 border"><InlineMath tex="\dfrac{0{,}5}{2} = 0{,}25" /></td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-gray-700">Gas oksigen = pereaksi pembatas (nilai terkecil).</p>
    </>
  );
}

function MateriPersen() {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800">E. Persen Hasil</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Sangat jarang reaksi kimia menghasilkan produk 100%. Persen hasil membandingkan hasil aktual terhadap hasil teoritis.
      </p>
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <MathBlock tex="\%\;\text{hasil} = \dfrac{\text{hasil aktual}}{\text{hasil teoritis}} \times 100\%" />
      </div>

      <h3 className="mt-5 font-semibold text-gray-800">Contoh:</h3>
      <p className="mt-2 text-gray-700">Reaksi: Zn + S → ZnS. 1 mol Zn + 1 mol S, diperoleh 90 g ZnS.</p>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
        <p><strong>Jawab:</strong></p>
        <p className="mt-1"><em>Langkah 1</em>: Reaksi sudah setara.</p>
        <p className="mt-1"><em>Langkah 2</em>: Massa ZnS teoritis = 1 mol × 97 g·mol<sup>−1</sup> = 97 g</p>
        <p className="mt-2"><em>Langkah 3</em>: Persen hasil = <InlineMath tex="\dfrac{92}{97} \times 100\% = 94{,}85\%" /></p>
      </div>
    </>
  );
}

function MateriKemurnian() {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800">F. Persen Kemurnian</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Kadar kemurnian bahan kimia dinyatakan dengan persen kemurnian.
      </p>
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <MathBlock tex="\%\;\text{kemurnian} = \dfrac{\text{massa senyawa murni}}{\text{massa sampel}} \times 100\%" />
      </div>

      <h3 className="mt-5 font-semibold text-gray-800">Contoh:</h3>
      <p className="mt-2 text-gray-700">6,4 g sampel tembaga + oksigen → 6,8 g CuO</p>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-center">
        2Cu(s) + O<sub>2</sub>(g) → 2CuO(s)
      </div>
      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
        <p><strong>Jawab:</strong></p>
        <p className="mt-1"><em>Langkah 1</em>: Mol CuO = <InlineMath tex="\dfrac{6{,}8}{79{,}5}" /> = 0,085 mol</p>
        <p className="mt-2">Mol Cu = mol CuO = 0,085 mol</p>
        <p className="mt-2"><em>Langkah 2</em>: Massa Cu = 0,085 × 63,5 = 5,34 g</p>
        <p className="mt-2"><em>Langkah 3</em>: % kemurnian = <InlineMath tex="\dfrac{5{,}34}{6{,}4} \times 100\% = 83\%" /></p>
      </div>
    </>
  );
}

/* ========== GAME ========== */
function GamePage({ onNext }: { onNext: () => void }) {
  const [activeMission, setActiveMission] = useState<number | null>(null);

  const missions = [
    {
      id: 1,
      title: "Penyelamatan Reaktan!",
      desc: "Bantu pahlawan kimia menyetarakan persamaan reaksi melalui 5 tantangan bertingkat.",
      level: "Mudah",
      levelCls: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "🧪",
    },
    {
      id: 2,
      title: "Misteri Titrasi",
      desc: "Pecahkan misteri konsentrasi asam yang hilang menggunakan data titrasi laboratorium.",
      level: "Menengah",
      levelCls: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "🔬",
    },
    {
      id: 3,
      title: "Kekacauan Pereaksi Pembatas",
      desc: "Pabrik kimia dalam bahaya! Tentukan pereaksi mana yang akan habis lebih dulu.",
      level: "Sulit",
      levelCls: "bg-rose-100 text-rose-700 border-rose-200",
      icon: "⚗️",
    },
  ];

  if (activeMission === 1) return <Mission1Balancer onBack={() => setActiveMission(null)} onNext={onNext} />;
  if (activeMission === 2) return <Mission2Titrasi onBack={() => setActiveMission(null)} onNext={onNext} />;
  if (activeMission === 3) return <Mission3Limiting onBack={() => setActiveMission(null)} onNext={onNext} />;

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-800">Game Stoikiometri</h1>
      <p className="text-gray-500 mt-1">Pilih misi di bawah ini dan asah kemampuan stoikiometrimu lewat tantangan seru.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {missions.map((m) => (
          <div
            key={m.id}
            className="group bg-white border border-pink-200 rounded-2xl p-6 soft-shadow flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-pink-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-4xl">{m.icon}</div>
              <span className={"text-xs font-semibold px-2.5 py-1 rounded-full border " + m.levelCls}>{m.level}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">Misi {m.id}: {m.title}</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{m.desc}</p>
            <button
              onClick={() => setActiveMission(m.id)}
              className="mt-5 w-full font-semibold py-2.5 rounded-lg transition-colors bg-pink-500 hover:bg-pink-600 text-white"
            >
              Mulai Misi →
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={onNext} className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-5 py-2.5 rounded-lg">Lanjut ke Evaluasi →</button>
      </div>
    </section>
  );
}

/* ---------- Misi 1: Multi-level Penyetaraan Reaksi ---------- */
type BalanceLevel = {
  reactants: { label: ReactNode }[];
  products: { label: ReactNode }[];
  target: number[]; // koefisien target [r1, r2, ..., p1, p2, ...]
  atoms: { sym: string; reac: number[]; prod: number[] }[]; // jumlah tiap atom per spesies
};

const BALANCE_LEVELS: BalanceLevel[] = [
  {
    reactants: [{ label: <>H<sub>2</sub></> }, { label: <>Cl<sub>2</sub></> }],
    products: [{ label: <>HCl</> }],
    target: [1, 1, 2],
    atoms: [
      { sym: "H", reac: [2, 0], prod: [1] },
      { sym: "Cl", reac: [0, 2], prod: [1] },
    ],
  },
  {
    reactants: [{ label: <>H<sub>2</sub></> }, { label: <>O<sub>2</sub></> }],
    products: [{ label: <>H<sub>2</sub>O</> }],
    target: [2, 1, 2],
    atoms: [
      { sym: "H", reac: [2, 0], prod: [2] },
      { sym: "O", reac: [0, 2], prod: [1] },
    ],
  },
  {
    reactants: [{ label: <>N<sub>2</sub></> }, { label: <>H<sub>2</sub></> }],
    products: [{ label: <>NH<sub>3</sub></> }],
    target: [1, 3, 2],
    atoms: [
      { sym: "N", reac: [2, 0], prod: [1] },
      { sym: "H", reac: [0, 2], prod: [3] },
    ],
  },
  {
    reactants: [{ label: <>CH<sub>4</sub></> }, { label: <>O<sub>2</sub></> }],
    products: [{ label: <>CO<sub>2</sub></> }, { label: <>H<sub>2</sub>O</> }],
    target: [1, 2, 1, 2],
    atoms: [
      { sym: "C", reac: [1, 0], prod: [1, 0] },
      { sym: "H", reac: [4, 0], prod: [0, 2] },
      { sym: "O", reac: [0, 2], prod: [2, 1] },
    ],
  },
  {
    reactants: [{ label: <>C<sub>2</sub>H<sub>6</sub></> }, { label: <>O<sub>2</sub></> }],
    products: [{ label: <>CO<sub>2</sub></> }, { label: <>H<sub>2</sub>O</> }],
    target: [2, 7, 4, 6],
    atoms: [
      { sym: "C", reac: [2, 0], prod: [1, 0] },
      { sym: "H", reac: [6, 0], prod: [0, 2] },
      { sym: "O", reac: [0, 2], prod: [2, 1] },
    ],
  },
];

function Mission1Balancer({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [level, setLevel] = useState(0);
  const lvl = BALANCE_LEVELS[level];
  const totalSpecies = lvl.reactants.length + lvl.products.length;
  const [coef, setCoef] = useState<number[]>(() => Array(totalSpecies).fill(1));
  const [status, setStatus] = useState<null | "ok" | "no">(null);

  const isLast = level === BALANCE_LEVELS.length - 1;

  const change = (i: number, d: number) => {
    setStatus(null);
    setCoef((c) => { const n = [...c]; n[i] = Math.max(1, Math.min(9, n[i] + d)); return n; });
  };
  const check = () => setStatus(coef.every((v, i) => v === lvl.target[i]) ? "ok" : "no");
  const reset = () => { setCoef(Array(totalSpecies).fill(1)); setStatus(null); };
  const nextLevel = () => {
    const nl = level + 1;
    setLevel(nl);
    setCoef(Array(BALANCE_LEVELS[nl].reactants.length + BALANCE_LEVELS[nl].products.length).fill(1));
    setStatus(null);
  };

  const Box = ({ idx, label }: { idx: number; label: ReactNode }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-1">
        <button onClick={() => change(idx, +1)} className="w-10 h-8 bg-gray-100 hover:bg-amber-100 rounded-md font-bold text-gray-700">▲</button>
        <div className="w-10 h-12 flex items-center justify-center bg-amber-500 text-gray-900 rounded-md text-2xl font-extrabold">{coef[idx]}</div>
        <button onClick={() => change(idx, -1)} className="w-10 h-8 bg-gray-100 hover:bg-amber-100 rounded-md font-bold text-gray-700">▼</button>
      </div>
      <div className="text-lg font-semibold text-gray-800">{label}</div>
    </div>
  );

  // hitung balans per atom
  const atomRows = lvl.atoms.map((a) => {
    const left = a.reac.reduce((s, n, i) => s + n * coef[i], 0);
    const right = a.prod.reduce((s, n, i) => s + n * coef[lvl.reactants.length + i], 0);
    return { sym: a.sym, left, right, ok: left === right };
  });

  const lastDoneCorrect = isLast && status === "ok";

  return (
    <section>
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 mb-3">← Kembali ke daftar misi</button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Misi 1: Penyelamatan Reaktan!</h1>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Level {level + 1} / {BALANCE_LEVELS.length}</span>
      </div>
      <p className="text-gray-500 mt-1">Atur koefisien agar persamaan reaksi setara di kedua sisi.</p>

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-10 soft-shadow">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {lvl.reactants.map((r, i) => (
            <span key={"r" + i} className="flex items-center gap-3">
              <Box idx={i} label={r.label} />
              {i < lvl.reactants.length - 1 && <span className="text-2xl font-bold text-gray-400">+</span>}
            </span>
          ))}
          <span className="text-2xl font-bold text-amber-500">→</span>
          {lvl.products.map((p, i) => (
            <span key={"p" + i} className="flex items-center gap-3">
              <Box idx={lvl.reactants.length + i} label={p.label} />
              {i < lvl.products.length - 1 && <span className="text-2xl font-bold text-gray-400">+</span>}
            </span>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto text-sm">
          {atomRows.map((a) => (
            <div key={a.sym} className={"rounded-lg p-3 border " + (a.ok ? "bg-green-50 border-green-300" : "bg-white border-gray-200")}>
              Atom {a.sym} — kiri: <strong>{a.left}</strong>, kanan: <strong>{a.right}</strong> {a.ok && "✓"}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={check} className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-6 py-2.5 rounded-lg">Periksa Jawaban</button>
            <button onClick={reset} className="bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg">Reset</button>
            {status === "ok" && !isLast && (
              <button onClick={nextLevel} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg">Soal Selanjutnya →</button>
            )}
          </div>
          {status === "ok" && <div className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold">✓ Benar! Reaksi sudah setara.</div>}
          {status === "no" && <div className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold">✗ Belum setara. Cek jumlah atom kiri & kanan.</div>}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800">← Daftar misi</button>
        <button
          onClick={onBack}
          disabled={!lastDoneCorrect}
          className={
            "font-semibold px-5 py-2.5 rounded-lg transition-colors " +
            (lastDoneCorrect
              ? "bg-amber-500 hover:bg-amber-600 text-gray-900"
              : "bg-gray-100 text-gray-400 cursor-not-allowed")
          }
          title={lastDoneCorrect ? "Kembali ke menu misi" : "Selesaikan soal terakhir dengan benar untuk mengaktifkan tombol ini"}
        >
          Kembali ke Menu Misi
        </button>
      </div>
    </section>
  );
}

/* ---------- Generic single-question multiple-choice flow used by Misi 2 & 3 ---------- */
type MCQuestion = {
  scenario: ReactNode;
  question: ReactNode;
  options: string[];
  answerIndex: number;
  explanation?: ReactNode;
};

function MCMissionRunner({
  title,
  badge,
  badgeCls,
  intro,
  questions,
  onBack,
}: {
  title: string;
  badge: string;
  badgeCls: string;
  intro: ReactNode;
  questions: MCQuestion[];
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState<null | "ok" | "no">(null);
  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const lastDoneCorrect = isLast && status === "ok";

  const submit = (i: number) => {
    if (status === "ok") return;
    setPicked(i);
    setStatus(i === q.answerIndex ? "ok" : "no");
  };
  const next = () => {
    setIdx((n) => Math.min(questions.length - 1, n + 1));
    setPicked(null);
    setStatus(null);
  };

  return (
    <section>
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 mb-3">← Kembali ke daftar misi</button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <span className={"text-xs font-semibold px-3 py-1 rounded-full border " + badgeCls}>Soal {idx + 1} / {questions.length}</span>
      </div>
      <p className="text-gray-500 mt-1">{intro}</p>

      <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 soft-shadow">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">{badge}</div>
        <div className="text-gray-800 leading-relaxed">{q.scenario}</div>
        <div className="mt-4 font-semibold text-gray-800">{q.question}</div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = status !== null && i === q.answerIndex;
            const isWrong = status === "no" && isPicked;
            const base = "text-left px-4 py-3 rounded-xl border font-medium transition-all";
            const cls = isCorrect
              ? "bg-emerald-50 border-emerald-400 text-emerald-800"
              : isWrong
              ? "bg-rose-50 border-rose-400 text-rose-800"
              : "bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-800";
            return (
              <button key={i} onClick={() => submit(i)} disabled={status === "ok"} className={`${base} ${cls}`}>
                <span className="inline-block w-6 h-6 rounded-md bg-gray-100 text-gray-700 font-bold text-center mr-2">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {status === "ok" && (
          <div className="mt-5 px-4 py-3 rounded-lg bg-emerald-500 text-white font-semibold">
            ✓ Benar!{q.explanation && <span className="block font-normal text-sm mt-1 opacity-95">{q.explanation}</span>}
          </div>
        )}
        {status === "no" && (
          <div className="mt-5 px-4 py-3 rounded-lg bg-rose-500 text-white font-semibold">✗ Belum tepat. Coba pilihan lain.</div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          {status === "ok" && !isLast && (
            <button onClick={next} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg">Soal Selanjutnya →</button>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onBack}
          disabled={!lastDoneCorrect}
          className={
            "font-semibold px-5 py-2.5 rounded-lg transition-colors " +
            (lastDoneCorrect
              ? "bg-amber-500 hover:bg-amber-600 text-gray-900"
              : "bg-gray-100 text-gray-400 cursor-not-allowed")
          }
          title={lastDoneCorrect ? "Kembali ke menu misi" : "Jawab soal terakhir dengan benar untuk mengaktifkan tombol ini"}
        >
          Kembali ke Menu Misi
        </button>
      </div>
    </section>
  );
}

/* ---------- Misi 2: Misteri Titrasi ---------- */
function Mission2Titrasi({ onBack }: { onBack: () => void; onNext: () => void }) {
  const questions: MCQuestion[] = [
    {
      scenario: (
        <>Seorang ilmuwan lupa memberi label konsentrasi pada sebotol asam klorida (HCl). Data titrasi: <strong>V<sub>HCl</sub> = 25 mL</strong>, dititrasi dengan NaOH 0,1 M sebanyak <strong>20 mL</strong> sampai titik ekivalen.</>
      ),
      question: <>Berapakah konsentrasi HCl tersebut? (Reaksi: HCl + NaOH → NaCl + H<sub>2</sub>O)</>,
      options: ["0,04 M", "0,08 M", "0,10 M", "0,125 M"],
      answerIndex: 1,
      explanation: <>n NaOH = 0,02 × 0,1 = 0,002 mol = n HCl. M HCl = 0,002 / 0,025 = 0,08 M.</>,
    },
    {
      scenario: (
        <>Volume H<sub>2</sub>SO<sub>4</sub> = <strong>20 mL</strong> dititrasi dengan NaOH 0,2 M sebanyak <strong>30 mL</strong>. (Reaksi: H<sub>2</sub>SO<sub>4</sub> + 2 NaOH → Na<sub>2</sub>SO<sub>4</sub> + 2 H<sub>2</sub>O)</>
      ),
      question: <>Berapakah konsentrasi H<sub>2</sub>SO<sub>4</sub>?</>,
      options: ["0,15 M", "0,30 M", "0,075 M", "0,60 M"],
      answerIndex: 0,
      explanation: <>n NaOH = 0,03 × 0,2 = 0,006. n H₂SO₄ = 0,006 / 2 = 0,003. M = 0,003 / 0,02 = 0,15 M.</>,
    },
    {
      scenario: (
        <>Volume CH<sub>3</sub>COOH = <strong>50 mL</strong> dititrasi dengan KOH 0,25 M sebanyak <strong>40 mL</strong>. (Reaksi 1 : 1)</>
      ),
      question: <>Berapakah konsentrasi CH<sub>3</sub>COOH?</>,
      options: ["0,10 M", "0,25 M", "0,20 M", "0,50 M"],
      answerIndex: 2,
      explanation: <>n KOH = 0,04 × 0,25 = 0,01 mol = n asam. M = 0,01 / 0,05 = 0,20 M.</>,
    },
  ];
  return (
    <MCMissionRunner
      title="Misi 2: Misteri Titrasi"
      badge="Skenario Laboratorium"
      badgeCls="bg-amber-100 text-amber-700 border-amber-200"
      intro="Pecahkan misteri konsentrasi yang hilang dengan menerapkan stoikiometri titrasi asam-basa."
      questions={questions}
      onBack={onBack}
    />
  );
}

/* ---------- Misi 3: Pereaksi Pembatas ---------- */
function Mission3Limiting({ onBack }: { onBack: () => void; onNext: () => void }) {
  const questions: MCQuestion[] = [
    {
      scenario: (
        <>Reaksi setara: <strong>2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O</strong>. Tersedia 4 mol H<sub>2</sub> dan 3 mol O<sub>2</sub>.</>
      ),
      question: <>Manakah pereaksi pembatas?</>,
      options: ["Gas Hidrogen (H₂)", "Gas Oksigen (O₂)"],
      answerIndex: 0,
      explanation: <>H₂/2 = 2; O₂/1 = 3. Rasio terkecil = H₂ → pembatas.</>,
    },
    {
      scenario: (
        <>Reaksi setara: <strong>N<sub>2</sub> + 3 H<sub>2</sub> → 2 NH<sub>3</sub></strong>. Tersedia 2 mol N<sub>2</sub> dan 5 mol H<sub>2</sub>.</>
      ),
      question: <>Manakah pereaksi pembatas?</>,
      options: ["Gas Nitrogen (N₂)", "Gas Hidrogen (H₂)"],
      answerIndex: 1,
      explanation: <>N₂/1 = 2; H₂/3 ≈ 1,67. Rasio terkecil = H₂ → pembatas.</>,
    },
    {
      scenario: (
        <>Reaksi setara: <strong>CH<sub>4</sub> + 2 O<sub>2</sub> → CO<sub>2</sub> + 2 H<sub>2</sub>O</strong>. Tersedia 3 mol CH<sub>4</sub> dan 5 mol O<sub>2</sub>.</>
      ),
      question: <>Manakah pereaksi pembatas?</>,
      options: ["Metana (CH₄)", "Oksigen (O₂)"],
      answerIndex: 1,
      explanation: <>CH₄/1 = 3; O₂/2 = 2,5. Rasio terkecil = O₂ → pembatas.</>,
    },
  ];
  return (
    <MCMissionRunner
      title="Misi 3: Kekacauan Pereaksi Pembatas"
      badge="Skenario Pabrik Kimia"
      badgeCls="bg-rose-100 text-rose-700 border-rose-200"
      intro="Tentukan pereaksi pembatas pada masing-masing skenario untuk menghentikan reaksi berantai."
      questions={questions}
      onBack={onBack}
    />
  );
}

/* ========== EVALUASI ========== */
type Q = { id: number; q: React.ReactNode; opts: string[]; ans: number; sumber?: string };

const BANK: Q[] = [
  { id: 1, sumber: "UNAS 2010", q: <>Gas amoniak dihasilkan: (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub> + 2KOH → 2NH<sub>3</sub> + 2H<sub>2</sub>O + K<sub>2</sub>SO<sub>4</sub>. Volume NH<sub>3</sub> pada STP dari 33 g (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub> (M<sub>r</sub>=132)?</>, opts: ["2,8 liter", "5,6 liter", "11,2 liter", "12,0 liter", "22,4 liter"], ans: 2 },
  { id: 2, sumber: "UNAS 2009", q: <>5,4 g Al + HCl: 2Al + 6HCl → 2AlCl<sub>3</sub> + 3H<sub>2</sub>. Volume H<sub>2</sub> pada STP? (A<sub>r</sub> Al=27)</>, opts: ["2,24 L", "2,99 L", "3,36 L", "4,48 L", "6,72 L"], ans: 4 },
  { id: 3, sumber: "UNAS 2007", q: <>10,4 g Cr + H<sub>2</sub>SO<sub>4</sub>: 2Cr + 3H<sub>2</sub>SO<sub>4</sub> → Cr<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub> + 3H<sub>2</sub>. Volume gas pada STP? (A<sub>r</sub> Cr=52)</>, opts: ["4,98 L", "6,72 L", "11,2 L", "22,4 L", "67,2 L"], ans: 1 },
  { id: 4, sumber: "UN 2012", q: <>10,7 g NH<sub>4</sub>Cl + 14,8 g Ca(OH)<sub>2</sub>: 2NH<sub>4</sub>Cl + Ca(OH)<sub>2</sub> → CaCl<sub>2</sub> + 2H<sub>2</sub>O + 2NH<sub>3</sub>. Volume NH<sub>3</sub> pada STP?</>, opts: ["1,12 L", "2,24 L", "3,36 L", "4,48 L", "6,72 L"], ans: 3 },
  { id: 5, sumber: "UN 2013", q: <>38 g Na<sub>3</sub>PO<sub>4</sub>·xH<sub>2</sub>O dipanaskan, sisa 16,4 g. Rumus senyawa kristal? (A<sub>r</sub> Na=23, P=31, O=16, H=1)</>, opts: ["Na₃PO₄·5H₂O", "Na₃PO₄·6H₂O", "Na₃PO₄·8H₂O", "Na₃PO₄·10H₂O", "Na₃PO₄·12H₂O"], ans: 4 },
  { id: 6, sumber: "UN 2019", q: <>HNO<sub>3</sub> pekat (M<sub>r</sub>=63), konsentrasi 16,43 M, ρ = 1,643 g/mL. Kadar (% massa)?</>, opts: ["39,69%", "53,86%", "58,36%", "63,00%", "81,60%"], ans: 2 },
  { id: 7, sumber: "UN 2019", q: <>HNO<sub>3</sub> + NH<sub>3</sub> → NH<sub>4</sub>NO<sub>3</sub>. 12,6 g HNO<sub>3</sub> + 2,24 L NH<sub>3</sub> (STP). Massa NH<sub>4</sub>NO<sub>3</sub>?</>, opts: ["0,4 g", "0,8 g", "4 g", "8 g", "16 g"], ans: 3 },
  { id: 8, sumber: "UN 2019", q: <>Iodine povidone 10% massa yodium. Molaritasnya? (ρ=1 g/mL, A<sub>r</sub> I=127)</>, opts: ["7,9·10⁻⁴ M", "8,7·10⁻⁴ M", "79·10⁻² M", "87·10⁻² M", "1·10² M"], ans: 1 },
  { id: 9, sumber: "UN 2018", q: <>NaClO + 2KI + 2HCl → NaCl + I<sub>2</sub> + H<sub>2</sub>O; I<sub>2</sub> + 2Na<sub>2</sub>S<sub>2</sub>O<sub>3</sub> → 2NaI + Na<sub>2</sub>S<sub>4</sub>O<sub>6</sub>. 20 mL NaClO + 15 mL Na<sub>2</sub>S<sub>2</sub>O<sub>3</sub> 0,1 M. Kadar NaClO (w/w)? (M<sub>r</sub>=74,5; ρ=1 g/mL)</>, opts: ["0,279%", "0,558%", "1,116%", "2,232%", "4,464%"], ans: 0 },
  { id: 10, sumber: "UTBK 2021", q: <>Senyawa 75% C, sisanya H. Rumus empiris? (A<sub>r</sub> H=1, C=12)</>, opts: ["CH", "CH₂", "CH₃", "CH₄", "C₂H₃"], ans: 3 },
  { id: 11, sumber: "UN 2013", q: <>10,8 g Al + 9,6 g O<sub>2</sub>: 4Al + 3O<sub>2</sub> → 2Al<sub>2</sub>O<sub>3</sub>. Massa Al<sub>2</sub>O<sub>3</sub>? (A<sub>r</sub> Al=27, O=16)</>, opts: ["3,6 g", "10,8 g", "13,0 g", "20,4 g", "102 g"], ans: 3 },
  { id: 12, sumber: "UN 2008", q: <>10 g KClO<sub>3</sub> dipanaskan: 2KClO<sub>3</sub> → 2KCl + 3O<sub>2</sub>. Massa zat yang dihasilkan?</>, opts: ["> 25 g", "> 10 g", "= 10 g", "< 25 g", "< 10 g"], ans: 2 },
  { id: 13, sumber: "UN 2008", q: <>0,24 g zat berkarbon + 112 mL O<sub>2</sub> (STP). % karbon? (A<sub>r</sub> C=12)</>, opts: ["25%", "35%", "50%", "75%", "80%"], ans: 2 },
  { id: 14, sumber: "UN 2013", q: <>2,63 g CaSO<sub>4</sub>·xH<sub>2</sub>O → 1,36 g CaSO<sub>4</sub>. Rumus hidrat? (A<sub>r</sub> Ca=40, S=32, O=16)</>, opts: ["CaSO₄·3H₂O", "CaSO₄·4H₂O", "CaSO₄·5H₂O", "CaSO₄·6H₂O", "CaSO₄·7H₂O"], ans: 4 },
  { id: 15, sumber: "UN 2010", q: <>2,7 g Al + 500 mL H<sub>2</sub>SO<sub>4</sub>: 2Al + 3H<sub>2</sub>SO<sub>4</sub> → Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub> + 3H<sub>2</sub>. Molaritas H<sub>2</sub>SO<sub>4</sub>?</>, opts: ["0,3 M", "0,6 M", "0,03 M", "0,06 M", "0,9 M"], ans: 0 },
  { id: 16, sumber: "TKD Saintek SBMPTN 2016", q: <>NH<sub>4</sub>NO<sub>3</sub> → N<sub>2</sub>O + 2H<sub>2</sub>O. 40 g NH<sub>4</sub>NO<sub>3</sub> → 10 L N<sub>2</sub>O. Gas X 10 L = 22 g. M<sub>r</sub> gas X?</>, opts: ["22", "44", "66", "88", "110"], ans: 1 },
  { id: 17, sumber: "UTBK 2019", q: <>Air raja: HNO<sub>3</sub> + 3HCl → Cl<sub>2</sub> + NOCl + 2H<sub>2</sub>O. HCl 9 M, 20 mL. 1 mL HNO<sub>3</sub> 6 M habis. Jumlah elektron terlibat?</>, opts: ["1 mol", "2 mol", "3 mol", "4 mol", "5 mol"], ans: 2 },
  { id: 18, sumber: "UTBK 2019", q: <>Cl<sub>2</sub> = 0,12 mol (air raja). Volume HCl 9 M yang bereaksi?</>, opts: ["10 mL", "20 mL", "30 mL", "40 mL", "60 mL"], ans: 3 },
  { id: 19, sumber: "TKA Saintek UTBK 2019", q: <>20 mL KMnO<sub>4</sub> 0,2 M + 80 mL H<sub>2</sub>C<sub>2</sub>O<sub>4</sub>. Volume CO<sub>2</sub> pada 0°C, 76 mmHg?</>, opts: ["0,112 L", "0,224 L", "0,336 L", "0,448 L", "0,560 L"], ans: 3 },
  { id: 20, sumber: "TKA Saintek UTBK 2022", q: <>4Au + 8KCN + O<sub>2</sub> + 2H<sub>2</sub>O → 4KAu(CN)<sub>2</sub> + 4KOH. 100 g bijih emas → 0,2 mol KAu(CN)<sub>2</sub>. % massa Au? (M<sub>r</sub> Au=197)</>, opts: ["19,6%", "28,5%", "39,4%", "59,1%", "75,4%"], ans: 2 },
];

function EvaluasiPage({ onNext }: { onNext: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(BANK.length).fill(null));
  const [done, setDone] = useState(false);
  const score = useMemo(() => answers.reduce<number>((s, a, i) => s + (a === BANK[i].ans ? 1 : 0), 0), [answers]);

  const restart = () => { setAnswers(Array(BANK.length).fill(null)); setDone(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-800">Evaluasi Akhir</h1>
      <p className="text-gray-500 mt-1">{BANK.length} soal pilihan ganda — kumpulan soal UN, UTBK & SBMPTN materi Stoikiometri.</p>

      {!done ? (
        <div className="mt-6 space-y-4">
          {BANK.map((q, i) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5 soft-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm text-amber-600 font-semibold">Soal {i + 1} / {BANK.length}</div>
                {q.sumber && <div className="text-xs text-gray-400 italic">{q.sumber}</div>}
              </div>
              <div className="mt-1 text-gray-800 leading-relaxed">{q.q}</div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {q.opts.map((opt, j) => {
                  const sel = answers[i] === j;
                  return (
                    <button key={j} onClick={() => setAnswers((s) => s.map((x, idx) => (idx === i ? j : x)))} className={"text-left px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors " + (sel ? "bg-amber-500 border-amber-500 text-gray-900" : "bg-white border-gray-200 text-gray-700 hover:border-amber-300")}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button onClick={() => { setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={answers.some((a) => a === null)} className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 font-semibold py-3 rounded-xl">
            Selesai & Lihat Skor
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center soft-shadow">
            <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Skor Akhir</div>
            <div className="mt-3 text-6xl font-extrabold text-amber-500">{score}<span className="text-3xl text-gray-400">/{BANK.length}</span></div>
            <div className="mt-2 text-gray-700 font-medium">
              {score === BANK.length ? "Sempurna! 🎉" : score >= BANK.length * 0.6 ? "Bagus, terus berlatih!" : "Jangan menyerah, ulangi materinya."}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button onClick={restart} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2.5 rounded-lg">Ulangi Evaluasi</button>
              <button onClick={onNext} className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-5 py-2.5 rounded-lg">Lanjut ke Refleksi →</button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 soft-shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Pembahasan Jawaban</h2>
            <ul className="space-y-2 text-sm">
              {BANK.map((q, i) => {
                const correct = answers[i] === q.ans;
                return (
                  <li key={q.id} className={"flex items-start gap-2 " + (correct ? "text-emerald-700" : "text-rose-700")}>
                    <span className="font-bold w-8 shrink-0">#{i + 1}</span>
                    <span>Jawabanmu: <b>{answers[i] !== null ? String.fromCharCode(65 + (answers[i] as number)) : "-"}</b> • Kunci: <b>{String.fromCharCode(65 + q.ans)}</b> {correct ? "✓" : "✗"}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

/* ========== REFLEKSI ========== */
function RefleksiPage({ onRestart }: { onRestart: () => void }) {
  const emojis = ["😕", "🙂", "😀", "🤩"];
  const [feel, setFeel] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-800">Refleksi & Penutup</h1>
      <p className="text-gray-500 mt-1">Bagikan pengalaman belajarmu hari ini.</p>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-pink-200 rounded-xl p-6 soft-shadow">
          <h2 className="font-semibold text-gray-800">Bagaimana perasaanmu?</h2>
          <div className="mt-4 flex gap-3 flex-wrap">
            {emojis.map((e, i) => (
              <button key={i} onClick={() => setFeel(i)} className={"emoji-btn w-14 h-14 rounded-xl text-3xl border-2 flex items-center justify-center " + (feel === i ? "bg-amber-500 border-amber-500 text-gray-900 selected" : "bg-gray-50 border-gray-200")}>{e}</button>
            ))}
          </div>

          <h2 className="mt-6 font-semibold text-gray-800">Refleksi Pembelajaran</h2>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Setelah mempelajari materi dan melakukan simulasi Lab Virtual Titrasi, ceritakan pemahamanmu dengan menjawab pertanyaan berikut:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5 leading-relaxed">
            <li>Bagaimana hubungan antara volume basa (NaOH) yang diteteskan dengan perubahan warna indikator di Erlenmeyer?</li>
            <li>Bagaimana konsep mol membantumu menemukan nilai konsentrasi asam (<InlineMath tex="H_2SO_4" />) yang belum diketahui?</li>
            <li>Bagian perhitungan atau konsep mana yang masih terasa paling membingungkan bagimu?</li>
          </ul>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketikkan hasil refleksimu di sini berdasarkan pertanyaan panduan di atas..."
            className="mt-4 w-full min-h-[150px] px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 outline-none text-gray-800 resize-y"
          />
          <button onClick={() => setSubmitted(true)} disabled={feel === null || !text.trim()} className="mt-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 font-semibold px-5 py-2.5 rounded-lg">Kirim Refleksi</button>
          {submitted && <div className="mt-3 text-sm text-green-600 font-semibold">✓ Terima kasih, refleksimu telah tersimpan!</div>}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 soft-shadow">
          <h2 className="font-semibold text-gray-800">Ringkasan Materi Stoikiometri</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Stoikiometri</strong> = hubungan kuantitatif reaktan & produk reaksi.</span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Penyetaraan reaksi</strong>: jumlah atom kiri = kanan.</span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Mol</strong>: 1 mol = 6,022 × 10<sup>23</sup> partikel.</span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span>
              <InlineMath tex="n = \dfrac{m}{M_r}" /> &nbsp;|&nbsp; <InlineMath tex="n = \dfrac{N}{N_A}" /> &nbsp;|&nbsp; <InlineMath tex="n = \dfrac{V}{22{,}4}" /> (STP).
            </span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Rumus molekul</strong> = (rumus empiris) × N; &nbsp;<InlineMath tex="N = \dfrac{M_r\;\text{senyawa}}{M_r\;\text{rumus empiris}}" /></span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Pereaksi pembatas</strong> = reaktan habis paling dulu (mol/koefisien terkecil).</span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Persen hasil</strong> = <InlineMath tex="\dfrac{\text{aktual}}{\text{teoritis}} \times 100\%" /></span></li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">•</span><span><strong>Persen kemurnian</strong> = <InlineMath tex="\dfrac{\text{massa murni}}{\text{massa sampel}} \times 100\%" /></span></li>
          </ul>

          <button onClick={onRestart} className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg">↺ Kembali ke Beranda</button>
        </div>
      </div>
    </section>
  );
}

/* ========== VIRTUAL LAB ========== */
function VirtualLabPage({ onNext }: { onNext: () => void }) {
  const [v, setV] = useState(0);
  // Buret total volume = 50 mL. Liquid height shrinks as v increases.
  const buretFillPct = Math.max(0, 100 - (v / 50) * 100);

  // Lapisan tipis pink di dasar Erlenmeyer (perubahan warna ujung tetes)
  let bottomLayerColor = "rgba(252, 231, 243, 0.55)";
  let flaskGlow = "0 0 0 rgba(0,0,0,0)";
  let fullPink = false;
  if (v >= 20 && v <= 20.5) {
    bottomLayerColor = "rgba(252, 165, 195, 0.75)";
    flaskGlow = "0 0 24px rgba(244,114,182,0.45)";
    fullPink = true;
  } else if (v > 20) {
    bottomLayerColor = "rgba(126, 18, 73, 0.85)"; // magenta gelap (over-titrated)
    flaskGlow = "0 0 32px rgba(190,24,93,0.7)";
    fullPink = true;
  }
  const clearLiquid = fullPink ? bottomLayerColor : "rgba(186, 230, 253, 0.35)";

  // Calculations (kunci jawaban)
  const M_NaOH = 0.1;
  const V_acid_mL = 25;
  const n_NaOH = M_NaOH * v;
  const n_H2SO4 = n_NaOH / 2;
  const M_H2SO4 = V_acid_mL > 0 ? n_H2SO4 / V_acid_mL : 0;

  const fmt = (n: number, d = 4) => n.toFixed(d);

  let status: { text: string; cls: string };
  if (v < 20) status = { text: "Belum mencapai titik ekivalen", cls: "text-gray-500" };
  else if (v >= 20 && v <= 20.5) status = { text: "Titik Ekivalen Tercapai!", cls: "text-emerald-600" };
  else status = { text: "Titrasi berlebih!", cls: "text-rose-600" };

  // Quiz state
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [check, setCheck] = useState<null | { ok: boolean[]; allOk: boolean }>(null);

  const validate = () => {
    const tol = (truth: number, val: number, abs: number, rel = 0.02) =>
      !isNaN(val) && Math.abs(val - truth) <= Math.max(abs, Math.abs(truth) * rel);
    const ok = [
      tol(n_NaOH, parseFloat(a1.replace(",", ".")), 0.05),
      tol(n_H2SO4, parseFloat(a2.replace(",", ".")), 0.03),
      tol(M_H2SO4, parseFloat(a3.replace(",", ".")), 0.001),
    ];
    setCheck({ ok, allOk: ok.every(Boolean) });
  };

  const inputCls =
    "w-24 px-2 py-1 text-sm font-mono text-center border border-gray-300 rounded focus:border-amber-500 focus:ring-1 focus:ring-amber-300 outline-none";

  return (
    <section className="space-y-6 sm:space-y-8 animate-slide-up-fade">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">Virtual Lab</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Stoikiometri Titrasi</h1>
        </div>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Geser slider untuk menambahkan larutan NaOH 0,1 M ke dalam 25 mL larutan H₂SO₄. Amati perubahan warna dan hitung sendiri stoikiometrinya.</p>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT — Visualization */}
        <Reveal>
          <div className="glass-card p-6 h-full">
            <h2 className="font-bold text-gray-800 mb-4">Visualisasi Praktikum</h2>

            <div className="relative flex flex-col items-center gap-4 py-8 px-4 bg-gradient-to-b from-sky-50/60 to-white rounded-2xl border border-white/60">
              {v > 20 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse whitespace-nowrap">
                  ⚠ Peringatan: Titrasi Berlebih (Over-titrated)!
                </div>
              )}

              {/* Buret group */}
              <div className="flex items-end gap-4">
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap pb-2">Buret · NaOH</span>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-2 rounded-sm bg-gray-300" />
                  <div className="w-1 h-3 bg-gray-300" />
                  <div className="relative w-7 h-40 rounded-t-md border border-gray-400 bg-white/60 backdrop-blur overflow-hidden shadow-inner">
                    <div
                      className="absolute left-0 right-0 top-0 transition-all duration-500 ease-out"
                      style={{
                        height: `${buretFillPct}%`,
                        background:
                          "linear-gradient(180deg, rgba(125,211,252,0.55) 0%, rgba(56,189,248,0.75) 100%)",
                      }}
                    >
                      <div className="absolute left-0 right-0 bottom-0 h-1 rounded-b-[50%] bg-sky-300/80 shadow-[0_-1px_0_rgba(255,255,255,0.7)_inset]" />
                    </div>
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span key={i} className="block h-px bg-gray-400/60 mx-1" />
                      ))}
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gray-400 -mt-0.5" />
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-400" />
                </div>
                <span className="text-xs font-semibold text-transparent whitespace-nowrap pb-2" aria-hidden>Buret · NaOH</span>
              </div>

              <div className="h-4 flex items-center justify-center">
                {v > 0 && v < 50 && (
                  <span className="block w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                )}
              </div>

              {(() => {
                const liquidPct = Math.min(1, Math.max(0, v / 50));
                const bodyTop = 70;
                const bodyBottom = 208;
                const liquidY = bodyBottom - (bodyBottom - bodyTop) * (0.25 + liquidPct * 0.6);
                const flaskPath =
                  "M 78 10 " +
                  "L 78 18 L 75 18 L 75 22 L 82 22 " +
                  "L 82 62 " +
                  "C 82 78 30 130 22 180 " +
                  "C 19 198 22 212 38 212 " +
                  "L 162 212 " +
                  "C 178 212 181 198 178 180 " +
                  "C 170 130 118 78 118 62 " +
                  "L 118 22 L 125 22 L 125 18 L 122 18 L 122 10 Z";
                return (
                  <div
                    className="text-gray-400 backdrop-blur-sm"
                    style={{
                      filter:
                        flaskGlow !== "0 0 0 rgba(0,0,0,0)"
                          ? `drop-shadow(${flaskGlow})`
                          : "none",
                    }}
                  >
                    <svg width="190" height="200" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath id="flaskInner">
                          <path d={flaskPath} />
                        </clipPath>
                      </defs>
                      <path d={flaskPath} fill="rgba(255,255,255,0.45)" stroke="none" />
                      <rect
                        x="0" y={liquidY} width="200" height={220 - liquidY}
                        clipPath="url(#flaskInner)"
                        style={{ fill: clearLiquid, transition: "fill 700ms ease-out" }}
                      />
                      <rect
                        x="0"
                        y={fullPink ? liquidY : bodyBottom - 14}
                        width="200"
                        height={fullPink ? 220 - liquidY : 220 - (bodyBottom - 14)}
                        clipPath="url(#flaskInner)"
                        style={{
                          fill: bottomLayerColor,
                          transition: "fill 700ms ease-out, y 500ms ease-out, height 500ms ease-out",
                        }}
                      />
                      <ellipse cx="100" cy={liquidY} rx="60" ry="3" clipPath="url(#flaskInner)" fill="rgba(255,255,255,0.55)" stroke="rgba(14,165,233,0.35)" strokeWidth="1" />
                      <line x1="0" x2="200" y1={liquidY} y2={liquidY} clipPath="url(#flaskInner)" stroke="rgba(14,165,233,0.3)" strokeWidth="1" />
                      <path d={flaskPath} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </div>
                );
              })()}
              <div className="text-xs font-semibold text-gray-700">Erlenmeyer · H₂SO₄ + indikator PP</div>
            </div>

            {/* Slider */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Volume NaOH ditambahkan</label>
                <span className="text-sm font-bold text-amber-600">{v.toFixed(1)} mL</span>
              </div>
              <input
                type="range" min={0} max={50} step={0.5} value={v}
                onChange={(e) => setV(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* RIGHT — Quiz Calculations */}
        <Reveal delay={120}>
          <div className="glass-card p-6 h-full flex flex-col gap-5">
            <div>
              <h2 className="font-bold text-gray-800">Perhitungan Stoikiometri</h2>
              <p className="text-xs text-gray-500 mt-1">Mode kuis — hitung sendiri setiap langkah, lalu cek jawabanmu.</p>
            </div>

            <div className="rounded-2xl bg-white/60 border border-white/70 p-4">
              <div className="text-xs font-semibold text-gray-500 mb-1">Persamaan Reaksi</div>
              <MathBlock tex="H_2SO_4 + 2NaOH \rightarrow Na_2SO_4 + 2H_2O" />
            </div>

            <div className="space-y-4">
              <QuizStep
                num={1}
                title="Mol Titran (NaOH)"
                lhs={`n_{NaOH} = 0{,}1 \\text{ M} \\times ${v.toFixed(1)} \\text{ mL} = `}
                unit="mmol"
                value={a1}
                onChange={setA1}
                ok={check?.ok[0]}
                inputCls={inputCls}
              />
              <QuizStep
                num={2}
                title="Rasio Koefisien (1 : 2)"
                lhs={`n_{H_2SO_4} = \\tfrac{1}{2} \\times n_{NaOH} = `}
                unit="mmol"
                value={a2}
                onChange={setA2}
                ok={check?.ok[1]}
                inputCls={inputCls}
              />
              <QuizStep
                num={3}
                title="Konsentrasi Asam (V = 25 mL)"
                lhs={`M_{H_2SO_4} = \\dfrac{n_{H_2SO_4}}{25} = `}
                unit="M"
                value={a3}
                onChange={setA3}
                ok={check?.ok[2]}
                inputCls={inputCls}
              />
            </div>

            <button
              onClick={validate}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 rounded-xl transition-colors text-base"
            >
              Cek Jawaban
            </button>

            {check && (
              <div
                className={
                  "rounded-xl px-4 py-3 text-sm font-semibold text-center " +
                  (check.allOk
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-700"
                    : "bg-rose-50 border border-rose-300 text-rose-700")
                }
              >
                {check.allOk
                  ? "✅ Jawaban Benar! Semua langkah perhitungan tepat."
                  : "❌ Masih ada yang keliru, coba hitung lagi!"}
              </div>
            )}

            <div className={`text-center font-bold text-base ${status.cls}`}>{status.text}</div>

            <button onClick={onNext} className="mt-auto w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-xl transition-colors">
              Lanjut ke Game →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function QuizStep({
  num, title, lhs, unit, value, onChange, ok, inputCls,
}: {
  num: number; title: string; lhs: string; unit: string;
  value: string; onChange: (v: string) => void;
  ok: boolean | undefined; inputCls: string;
}) {
  return (
    <div className="rounded-2xl bg-white/55 border border-white/70 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-amber-500 text-gray-900 text-xs font-bold flex items-center justify-center">{num}</span>
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        {ok === true && <span className="ml-auto text-emerald-600 text-lg">✅</span>}
        {ok === false && <span className="ml-auto text-rose-600 text-lg">❌</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <InlineMath tex={lhs} />
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="?"
          className={inputCls}
        />
        <span className="text-sm font-medium text-gray-700">{unit}</span>
      </div>
    </div>
  );
}