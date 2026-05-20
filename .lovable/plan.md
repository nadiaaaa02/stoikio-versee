## Tujuan
Menambahkan 3 fitur ke aplikasi Stoikiometri Interaktif dengan tetap menjaga gaya minimalis (warna amber/rose/white yang sudah ada). Implementasi memakai CSS modern + Tailwind keyframes (tanpa menambah dependency framer-motion baru, kecuali Anda menginginkannya).

## 1. Splash / Opening Screen
- Buat komponen baru `src/components/SplashScreen.tsx` — overlay `fixed inset-0 z-[100]` putih dengan gradient halus.
- Tampilkan badge "S" (sama seperti logo sidebar) + teks **"Stoikiometri Interaktif"** di tengah, dengan animasi `pulse` + `fade-in`.
- Render dari `Index.tsx`. State `showSplash` (default `true`), `setTimeout` 2.5 detik → ubah jadi `false`. Saat false, tambah class `animate-fade-out` lalu unmount setelah 400ms.
- Splash muncul SEBELUM login page/dashboard (di atas semuanya).

## 2. Animasi Transisi Setelah Login
- Tambah keyframe `slide-up-fade` di `tailwind.config.ts`:
  ```
  from: { opacity: 0, transform: translateY(20px) }
  to:   { opacity: 1, transform: translateY(0) }
  ```
- Saat `loggedIn` berubah jadi `true`, bungkus container dashboard dengan class `animate-[slide-up-fade_0.5s_ease-out]`.
- Untuk kartu menu / konten utama di `HomePage`, beri stagger sederhana lewat `style={{ animationDelay: ... }}` (mis. 100ms, 200ms, 300ms) dengan class animasi yang sama, sehingga kartu muncul satu per satu.

## 3. Komponen Video Pembelajaran
- Buat komponen reusable `src/components/VideoCard.tsx`:
  - Card besar: `rounded-2xl shadow-lg border border-gray-200 bg-white p-4 sm:p-6`.
  - Judul tebal di atas: **"Aktivitas Pembelajaran"** (`text-xl font-bold text-gray-800 mb-4`).
  - Wadah rasio 16:9: `<div class="relative w-full pb-[56.25%] rounded-xl overflow-hidden">` berisi `<iframe class="absolute inset-0 w-full h-full">` dengan placeholder URL `https://www.youtube.com/embed/dQw4w9WgXcQ` (Anda dapat mengganti nanti).
  - Atribut `allowFullScreen`, `loading="lazy"`.
- Sisipkan komponen ini di `HomePage` (setelah hero/CTA) dan/atau `BelajarPage` di awal section materi.

## File yang akan diubah/dibuat
- `tailwind.config.ts` — tambah keyframes `slide-up-fade` & `fade-out` + animation utilities.
- `src/components/SplashScreen.tsx` — baru.
- `src/components/VideoCard.tsx` — baru.
- `src/pages/Index.tsx` — tambah state splash, animasi container dashboard, stagger pada kartu HomePage, render `<VideoCard />` di Home & Belajar.

## Catatan
- Tidak menambah dependency baru (framer-motion tidak dibutuhkan untuk skenario ini). Jika nanti Anda ingin animasi lebih kompleks, kita bisa migrate ke framer-motion.
- Semua animasi mengikuti palet & sudut melengkung yang sudah ada (amber-500, rose-200, rounded-xl/2xl).
