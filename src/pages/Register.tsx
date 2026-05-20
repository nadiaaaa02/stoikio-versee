import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthIllustration from "@/components/AuthIllustration";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";

const CORAL = "#FFB2A6";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) { setError("Nama minimal 2 karakter."); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Format email tidak valid."); return; }
    if (password.length < 6) { setError("Kata sandi minimal 6 karakter."); return; }
    setError("");
    setLoading(true);
    const { data: signUpData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name.trim() },
      },
    });
    setLoading(false);
    if (authErr) { setError(authErr.message); return; }
    const savedName =
      (signUpData?.user?.user_metadata as { full_name?: string })?.full_name ||
      name.trim();
    try {
      localStorage.setItem("sb_user", JSON.stringify({ name: savedName, email }));
    } catch { /* ignore */ }
    navigate("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <aside
        className="hidden md:flex items-center justify-center p-10 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, #FFF89A 0%, #fff5f3 60%, #ffe9e4 100%)` }}
      >
        <AuthIllustration title="Mulai petualangan sains-mu" subtitle="Gabung dan dapatkan akses penuh ke seluruh modul interaktif." />
      </aside>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8">
            ← Kembali ke beranda
          </Link>
          <div className="mb-8">
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Mulai petualangan belajarmu di <BrandLogo size="lg" /></h1>
            <p className="text-sm text-gray-500 mt-2">Hanya butuh beberapa detik untuk memulai.</p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <Field label="Nama Lengkap" type="text" value={name} onChange={setName} placeholder="Mis. Aulia Ramadhani" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@email.com" />
            <Field label="Kata Sandi" type="password" value={password} onChange={setPassword} placeholder="Minimal 6 karakter" />
            {error && <div className="text-sm rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg font-semibold text-gray-900 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: CORAL }}
            >
              {loading ? "Memproses…" : "Daftar"}
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "#d97a6c" }}>
              Masuk di sini
            </Link>
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
        className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 transition"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${CORAL}66`)}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)")}
      />
    </div>
  );
}
