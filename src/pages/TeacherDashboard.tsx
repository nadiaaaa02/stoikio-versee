import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TeacherAccessGate, { hasTeacherAccess } from "@/components/TeacherAccessGate";
import BrandLogo from "@/components/BrandLogo";
import { ArrowLeft, Download, Search, FileText, Users, Trophy, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStudents, type StudentRow } from "@/hooks/useStudents";
import { useToast } from "@/hooks/use-toast";

const CORAL = "#FFB2A6";
const YELLOW = "#FFF89A";

function avg(s: StudentRow) {
  return Math.round((s.scores.misi1 + s.scores.misi2 + s.scores.misi3) / 3);
}
function isCompleted(s: StudentRow) {
  return (
    s.progress >= 100 &&
    s.labStatus === "Tercapai" &&
    s.scores.misi1 > 0 &&
    s.scores.misi2 > 0 &&
    s.scores.misi3 > 0 &&
    !!s.reflection &&
    !!s.evaluation
  );
}

export default function TeacherDashboard() {
  const [unlocked, setUnlocked] = useState<boolean>(() => hasTeacherAccess());
  const { data, loading } = useStudents();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [openReflection, setOpenReflection] = useState<StudentRow | null>(null);


  const filtered = useMemo(
    () => data.filter((s) => s.name.toLowerCase().includes(q.toLowerCase().trim())),
    [data, q],
  );

  const stats = useMemo(() => {
    const total = data.length;
    const completed = data.filter(isCompleted).length;
    const avgProgress = total === 0 ? 0 : Math.round(data.reduce((a, s) => a + s.progress, 0) / total);
    const labOk = data.filter((s) => s.labStatus === "Tercapai").length;
    return { total, completed, avgProgress, labOk };
  }, [data]);

  const handleExport = () => {
    toast({
      title: "Ekspor segera hadir",
      description: "Fitur ekspor ke Excel/CSV akan tersedia pada pembaruan berikutnya.",
    });
  };

  if (!unlocked) {
    return <TeacherAccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header
        className="border-b border-gray-200"
        style={{ background: `linear-gradient(180deg, ${CORAL}33 0%, #ffffff 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shrink-0"
              aria-label="Kembali ke beranda"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: CORAL }} />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate flex items-center gap-2">
                Dasbor Guru <BrandLogo size="md" />
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Pantau progres, nilai, dan refleksi siswa secara terpusat.
              </p>
            </div>
          </div>
          <Button
            onClick={handleExport}
            className="h-10 px-4 text-white font-semibold shrink-0"
            style={{ backgroundColor: CORAL }}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Ekspor Nilai</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stat cards — stack on mobile, grid on md+ */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Siswa" value={stats.total} />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Selesai Penuh"
            value={stats.completed}
            accent={YELLOW}
          />
          <StatCard icon={<FileText className="w-5 h-5" />} label="Rata-rata Progres" value={`${stats.avgProgress}%`} />
          <StatCard icon={<FlaskConical className="w-5 h-5" />} label="Lab Tercapai" value={stats.labOk} />
        </section>

        {/* Search + actions */}
        <section className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama siswa…"
              className="pl-9 h-11 text-base sm:text-sm bg-white"
            />
          </div>
          <p className="text-xs text-gray-500">
            Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> dari {data.length} siswa
          </p>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead style={{ backgroundColor: CORAL }} className="text-white">
                <tr>
                  <Th>Nama Siswa</Th>
                  <Th>Progres Materi</Th>
                  <Th>Misi 1</Th>
                  <Th>Misi 2</Th>
                  <Th>Misi 3</Th>
                  <Th>Rata2</Th>
                  <Th>Lab Virtual</Th>
                  <Th>Nilai Evaluasi</Th>
                  <Th className="text-right pr-5">Refleksi</Th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      Memuat data siswa…
                    </td>
                  </tr>
                )}
                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      Belum ada data siswa.
                    </td>
                  </tr>
                )}
                {!loading && data.length > 0 && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      Tidak ada siswa cocok.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((s) => {
                    const done = isCompleted(s);
                    return (
                      <tr
                        key={s.id}
                        className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                        style={done ? { backgroundColor: `${YELLOW}66` } : undefined}
                      >
                        <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{s.name}</span>
                            {done && (
                              <Badge
                                className="text-[10px] border-0 text-gray-800"
                                style={{ backgroundColor: YELLOW }}
                              >
                                Tuntas
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Aktif: {new Date(s.lastActive).toLocaleDateString("id-ID")}
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full"
                                style={{ width: `${s.progress}%`, backgroundColor: CORAL }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {s.modulesCompleted}/{s.modulesTotal}
                            </span>
                          </div>
                        </td>
                        <ScoreCell value={s.scores.misi1} />
                        <ScoreCell value={s.scores.misi2} />
                        <ScoreCell value={s.scores.misi3} />
                        <td className="px-5 py-3 font-semibold text-gray-800">{avg(s)}</td>
                        <td className="px-5 py-3">
                          <LabBadge status={s.labStatus} />
                        </td>
                        <EvaluationCell student={s} />
                        <td className="px-5 py-3 text-right pr-5">
                          <button
                            onClick={() => setOpenReflection(s)}
                            disabled={!s.reflection}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" style={{ color: CORAL }} />
                            {s.reflection ? "Lihat" : "Kosong"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-[11px] text-gray-400 mt-4">
          Data diambil langsung dari database StoikioVerse.
        </p>
      </main>

      {/* Reflection modal */}
      <Dialog open={!!openReflection} onOpenChange={(o) => !o && setOpenReflection(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              Jurnal Refleksi — {openReflection?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Ditulis siswa setelah menyelesaikan modul.
            </DialogDescription>
          </DialogHeader>
          <div
            className="rounded-xl p-4 text-sm text-gray-700 leading-relaxed border"
            style={{ backgroundColor: `${YELLOW}55`, borderColor: YELLOW }}
          >
            {openReflection?.reflection || "Belum ada refleksi."}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- helpers ---------- */

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

function ScoreCell({ value }: { value: number }) {
  const color = value === 0 ? "text-gray-400" : value >= 80 ? "text-emerald-600" : value >= 60 ? "text-amber-600" : "text-rose-600";
  return <td className={`px-5 py-3 font-semibold ${color}`}>{value === 0 ? "—" : value}</td>;
}

function EvaluationCell({ student }: { student: StudentRow }) {
  const e = student.evaluation;
  if (!e) {
    return (
      <td className="px-5 py-3 whitespace-nowrap">
        <span className="text-xs text-gray-400 italic">Belum Mengerjakan</span>
      </td>
    );
  }
  const pct = e.total === 0 ? 0 : Math.round((e.score / e.total) * 100);
  const color = pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-rose-600";
  return (
    <td className="px-5 py-3 whitespace-nowrap">
      <div className={`font-semibold ${color}`}>
        {e.score}/{e.total}
        <span className="ml-1 text-xs font-medium text-gray-500">({pct}%)</span>
      </div>
    </td>
  );
}

function LabBadge({ status }: { status: StudentRow["labStatus"] }) {
  const map: Record<StudentRow["labStatus"], string> = {
    Tercapai: "bg-emerald-100 text-emerald-700",
    Belum: "bg-amber-100 text-amber-700",
    "Belum Dicoba": "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center gap-3"
      style={accent ? { boxShadow: `inset 4px 0 0 0 ${accent}` } : undefined}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: CORAL }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">{value}</div>
      </div>
    </div>
  );
}
