// Hook data Dasbor Guru — membaca semua tabel: profiles, student_progress,
// mission_scores, evaluation_scores, dan reflections.

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
  progress: number;          // 0-100 (persen)
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
      const [
        { data: profiles, error: pErr },
        { data: scores, error: sErr },
        { data: progress, error: prErr },
        { data: missions, error: mErr },
        { data: reflections, error: rErr },
      ] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, created_at, updated_at"),
        supabase.from("evaluation_scores").select("user_id, score, total, submitted_at"),
        supabase.from("student_progress").select("user_id, modules_completed, modules_total, lab_status, updated_at"),
        supabase.from("mission_scores").select("user_id, misi1, misi2, misi3, updated_at"),
        supabase.from("reflections").select("user_id, reflection_text, submitted_at"),
      ]);

      if (cancelled) return;

      if (pErr || sErr || prErr || mErr || rErr) {
        console.error("useStudents errors:", { pErr, sErr, prErr, mErr, rErr });
        setData([]);
        setLoading(false);
        return;
      }

      // Skor evaluasi terbaru per user
      const latestEval: Record<string, { score: number; total: number; submitted_at: string }> = {};
      for (const s of scores ?? []) {
        const prev = latestEval[s.user_id];
        if (!prev || new Date(s.submitted_at) > new Date(prev.submitted_at)) {
          latestEval[s.user_id] = { score: s.score, total: s.total, submitted_at: s.submitted_at };
        }
      }

      // Index by user_id
      const progressMap: Record<string, { modules_completed: number; modules_total: number; lab_status: string; updated_at: string }> = {};
      for (const p of progress ?? []) progressMap[p.user_id] = p;

      const missionMap: Record<string, { misi1: number; misi2: number; misi3: number; updated_at: string }> = {};
      for (const m of missions ?? []) missionMap[m.user_id] = m;

      const reflectionMap: Record<string, { reflection_text: string | null; submitted_at: string }> = {};
      for (const r of reflections ?? []) reflectionMap[r.user_id] = r;

      const rows: StudentRow[] = (profiles ?? []).map((p) => {
        const ev = latestEval[p.id];
        const pr = progressMap[p.id];
        const ms = missionMap[p.id];
        const rf = reflectionMap[p.id];

        const modulesCompleted = pr?.modules_completed ?? 0;
        const modulesTotal = pr?.modules_total ?? 6;
        const progress = Math.round((modulesCompleted / modulesTotal) * 100);

        // lastActive = tanggal terbaru dari semua aktivitas
        const dates = [p.updated_at, pr?.updated_at, ms?.updated_at, rf?.submitted_at].filter(Boolean) as string[];
        const lastActive = dates.length > 0
          ? dates.reduce((latest, d) => new Date(d) > new Date(latest) ? d : latest)
          : p.created_at;

        return {
          id: p.id,
          name: p.full_name?.trim() || p.email || "Tanpa nama",
          progress,
          modulesCompleted,
          modulesTotal,
          scores: {
            misi1: ms?.misi1 ?? 0,
            misi2: ms?.misi2 ?? 0,
            misi3: ms?.misi3 ?? 0,
          },
          labStatus: (pr?.lab_status as StudentRow["labStatus"]) ?? "Belum Dicoba",
          reflection: rf?.reflection_text ?? null,
          evaluation: ev
            ? { score: ev.score, total: ev.total, submittedAt: ev.submitted_at }
            : null,
          lastActive,
        };
      });

      setData(rows);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}