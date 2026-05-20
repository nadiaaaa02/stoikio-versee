// Hook data Dasbor Guru — tersambung ke backend Lovable Cloud.
// Mengambil daftar profil siswa beserta skor evaluasi terakhirnya.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EvaluationScore = {
  score: number;
  total: number;
  submittedAt: string;
} | null;

export type StudentRow = {
  id: string;
  name: string;
  progress: number;
  modulesCompleted: number;
  modulesTotal: number;
  scores: { misi1: number; misi2: number; misi3: number };
  labStatus: "Tercapai" | "Belum" | "Belum Dicoba";
  reflection: string | null;
  evaluation: EvaluationScore;
  lastActive: string;
};

export function useStudents() {
  const [data, setData] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: profiles, error: pErr }, { data: scores, error: sErr }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, created_at"),
        supabase.from("evaluation_scores").select("user_id, score, total, submitted_at"),
      ]);
      if (cancelled) return;
      if (pErr || sErr) {
        console.error("useStudents:", pErr ?? sErr);
        setData([]);
        setLoading(false);
        return;
      }

      // Skor evaluasi terbaru per user
      const latest: Record<string, { score: number; total: number; submitted_at: string }> = {};
      for (const s of scores ?? []) {
        const prev = latest[s.user_id];
        if (!prev || new Date(s.submitted_at) > new Date(prev.submitted_at)) {
          latest[s.user_id] = { score: s.score, total: s.total, submitted_at: s.submitted_at };
        }
      }

      const rows: StudentRow[] = (profiles ?? []).map((p) => {
        const ev = latest[p.id];
        return {
          id: p.id,
          name: p.full_name?.trim() || p.email || "Tanpa nama",
          progress: 0,
          modulesCompleted: 0,
          modulesTotal: 6,
          scores: { misi1: 0, misi2: 0, misi3: 0 },
          labStatus: "Belum Dicoba",
          reflection: null,
          evaluation: ev
            ? { score: ev.score, total: ev.total, submittedAt: ev.submitted_at }
            : null,
          lastActive: p.created_at,
        };
      });

      setData(rows);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
