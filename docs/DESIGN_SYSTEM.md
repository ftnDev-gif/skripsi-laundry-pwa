# Sistem Desain (Design System) - Sayangan Laundry PWA

Agen AI WAJIB mematuhi panduan visual ini saat melakukan slicing UI menggunakan Tailwind CSS.

## 1. Warna (Color Palette)
- **Background Utama:** Abu-abu sangat muda (`bg-slate-50`).
- **Kartu & Kontainer:** Putih murni (`bg-white`).
- **Warna Aksen Utama (Brand):** Biru cerah (`bg-blue-600`, text-blue-600, border-blue-600).
- **Teks:** Judul utama (`text-slate-900`), teks pendukung/subjudul (`text-slate-500`).
- **Badge Status:**
  - Lunas / Selesai: Hijau (`bg-emerald-50 text-emerald-700`).
  - Belum Lunas (Kasbon): Oranye (`bg-amber-50 text-amber-700`).

## 2. Tipografi
- **Font Utama:** Inter (sans-serif modern).
- **Hierarki Font:** 
  - Judul halaman: `text-2xl font-bold tracking-tight`.
  - Teks reguler: `text-sm` atau `text-base` dengan `font-normal` atau `font-medium`.

## 3. Bentuk & Lengkungan (Border Radius)
- **Wadah Logo (Squircle):** `rounded-2xl` (ukurannya flex h-11 w-11 atau h-14 w-14).
- **Kartu Konten Utama:** `rounded-3xl` (dilengkapi shadow-sm dan border tipis slate-100).
- **Tombol Aksi Utama (CTA):** `rounded-2xl`.
- **Field Input Teks:** `rounded-xl`.

## 4. Pustaka Icon
- Wajib menggunakan `lucide-react`.
- Ikon brand utama (Tetesan Air): `<Droplets/>` berwarna putih di dalam wadah squircle biru.
- Ikon umum: `<Mail/>`, `<Lock/>`, `<Printer/>`, `<QrCode/>`, `<ArrowLeft/>`.

## 5. Komponen Spesifik (UI Rules)
- **Checkbox & Radio Button:** Saat tidak aktif (unchecked), WAJIB berwarna putih transparan dengan border abu-abu tipis (`bg-white border-slate-300`). DILARANG menggunakan warna latar hitam pekat.
- **Input Angka (Berat/Kg):** Sembunyikan kontrol spinner panah bawaan browser menggunakan class `appearance-none`.