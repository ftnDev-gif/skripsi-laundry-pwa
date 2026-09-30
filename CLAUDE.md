# Panduan Agen AI - Sayangan Laundry PWA

Anda bertindak sebagai Senior Full-Stack Engineer yang mengembangkan sistem PWA Sayangan Laundry menggunakan Next.js (App Router), Tailwind CSS, dan TypeScript.

## 1. Konteks Bisnis
- Bisnis: Jasa laundry kiloan milik perorangan (single-operator / Budhe).
- Perangkat target: Smartphone spesifikasi rendah, koneksi internet fleksibel (dukungan offline SQLite lokal / online PostgreSQL).
- Identitas Merek: Slogan "Bersih, Rapi & Wangi", logo squircle biru (rounded-2xl) dengan ikon tetesan air Lucide React.

## 2. Aturan Rekayasa & Arsitektur
- DILARANG menginstal library styling baru di luar Tailwind CSS dan Lucide React.
- Komponen harus bersifat mobile-first, bersih, dan modular.
- Hindari logic yang overkill (jangan gunakan sistem microservices atau state management rumit seperti Redux; gunakan React state/context atau Zustand jika diperlukan).
- Baca folder `docs/` sebagai sumber kebenaran (Single Source of Truth) untuk PRD, skema database, dan User Stories (US1, US2, dst.).

## 3. Komponen Utama
- Autentikasi kasir & proteksi rute halaman dashboard pengelola.
- Form transaksi baru dengan kalkulasi tarif otomatis per-kg dan catatan kondisi pakaian.
- Halaman pembukuan keuangan (pemisahan omzet lunas vs piutang kasbon).
- Integrasi WhatsApp Gateway dan cetak QR Code / struk Bluetooth thermal.
- Halaman tracking publik untuk pelanggan melacak tahapan cucian.