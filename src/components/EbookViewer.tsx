const EBOOK_URL = "/Panduan-Stoikiometri-Interaktif.pdf";

/**
 * E-Book viewer — native <iframe> pointing to a PDF in /public.
 * Brand: Coral (#FFB2A6) primary, Pastel Yellow (#FFF89A) accents.
 */
export default function EbookViewer() {
  return (
    <div className="relative w-full bg-white border border-gray-200 rounded-2xl px-2 py-3 sm:p-5 soft-shadow-md">
      {/* Pastel Yellow decorative accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-3 -right-3 w-16 h-16 rounded-full opacity-70 blur-xl"
        style={{ backgroundColor: "#FFF89A" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -left-3 w-20 h-20 rounded-full opacity-60 blur-xl"
        style={{ backgroundColor: "#FFF89A" }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-3 px-1 sm:px-0">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Modul
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Modul E-Book Interaktif
          </h3>
        </div>
        <span className="inline-block text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
          PDF
        </span>
      </div>

      {/* Viewer */}
      <iframe
        src={EBOOK_URL}
        title="Modul E-Book Stoikiometri"
        className="w-full h-[60vh] md:h-[80vh] rounded-lg border-2 bg-white"
        style={{ borderColor: "#FFF89A" }}
      />

      {/* Instruksi */}
      <p className="mt-3 text-sm italic text-gray-500 text-center px-2">
        Jika tampilan kosong, gunakan tombol di bawah untuk membuka atau mengunduh E-Book.
      </p>

      {/* Tombol fallback */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <a
          href={EBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-semibold text-gray-900 shadow-sm transition-opacity hover:opacity-90 min-h-[48px]"
          style={{ backgroundColor: "#FFB2A6" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Buka di Tab Baru
        </a>
        <a
          href={EBOOK_URL}
          download
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-semibold text-gray-800 bg-white border-2 transition-colors hover:bg-amber-50 min-h-[48px]"
          style={{ borderColor: "#FFB2A6" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download E-Book
        </a>
      </div>
    </div>
  );
}
