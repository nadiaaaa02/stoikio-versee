import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CORAL = "#FFB2A6";
const YELLOW = "#FFF89A";

// Kode akses guru — ganti di sini saat perlu.
// (Catatan: ini gate sisi-klien sederhana, bukan auth penuh. Untuk perlindungan
// data nyata, lindungi data dengan Supabase RLS + role guru.)
const TEACHER_ACCESS_CODE = "GURU123";
const SESSION_KEY = "teacher_dashboard_access";

export function hasTeacherAccess() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "granted";
}

export function clearTeacherAccess() {
  sessionStorage.removeItem(SESSION_KEY);
}

type Props = { onUnlock: () => void };

export default function TeacherAccessGate({ onUnlock }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setChecking(true);
    // Jeda tipis agar terasa responsif (bukan delay nyata)
    setTimeout(() => {
      if (code.trim() === TEACHER_ACCESS_CODE) {
        sessionStorage.setItem(SESSION_KEY, "granted");
        onUnlock();
      } else {
        setError("Kode akses salah, silakan hubungi administrator.");
      }
      setChecking(false);
    }, 200);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: `linear-gradient(180deg, ${YELLOW}66 0%, #ffffff 60%)` }}
    >
      <Link
        to="/"
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Beranda
      </Link>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div
          className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: YELLOW }}
        >
          <KeyRound className="w-7 h-7 text-gray-800" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Area Khusus Guru
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1.5">
          Silakan masukkan kode akses untuk melanjutkan.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label htmlFor="teacher-code" className="block text-sm font-medium text-gray-700">
            Kode Akses Guru
          </label>
          <Input
            id="teacher-code"
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Masukkan kode…"
            className="h-11 rounded-lg bg-white text-base"
            autoFocus
            autoComplete="off"
          />

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={checking || !code.trim()}
            className="w-full h-11 rounded-lg text-white font-semibold disabled:opacity-60"
            style={{ backgroundColor: CORAL }}
          >
            {checking ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi…
              </span>
            ) : (
              "Buka Dasbor"
            )}
          </Button>
        </form>

        <p className="mt-5 text-[11px] text-gray-400 text-center">
          Akses tersimpan selama sesi browser aktif.
        </p>
      </div>
    </div>
  );
}
