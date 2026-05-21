import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthIllustration from "@/components/AuthIllustration";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";

const CORAL = "#FFB2A6";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Format email tidak valid."); return; }
    if (password.length < 4) { setError("Kata sandi minimal 4 karakter."); return; }
    setError("");
    setLoading(true);
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authErr) { setError(authErr.message); return; }
    const name =
      (data.user?.user_metadata as { full_name?: string })?.full_name ||
      email.split("@")[0];
    try { localStorage.setItem("sb_user", JSON.stringify({ name, email, id: data.user?.id })); } catch { /* ignore */ }
    navigate("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <aside
        className="hidden md:flex items-center justify-center p-10 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, #FFF89A 0%, #fff5f3 60%, #ffe9e4 100%)` }}
      >
        <AuthIllustration title="Belajar Stoikiometri jadi menyenangkan" subtitle="Akses materi, lab virtual, game, dan evaluasi dalam satu tempat." />
      </aside>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8">
            ← Kembali ke beranda
          </Link>
          <div className="mb-8">

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Selamat datang kembali di <BrandLogo size="lg" /></h1>
            <p className="text-sm text-gray-500 mt-2">Masuk untuk melanjutkan perjalanan belajarmu.</p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@email.com" />
            <Field label="Kata Sandi" type="password" value={password} onChange={setPassword} placeholder="••••••" />
            {error && <div className="text-sm rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg font-semibold text-gray-900 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: CORAL }}
            >
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "#d97a6c" }}>
              Daftar sekarang
            </Link>
          </p>
          <p className="text-xs text-gray-400 text-center mt-6">
            <Link to="/teacher-dashboard" className="underline hover:text-gray-600">Masuk sebagai Guru →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({
  label, type, value, onChange, placeholder,
}: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${CORAL}66`)}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)")}
      />
    </div>
  );
}
