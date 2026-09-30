# Product Requirements Document (PRD) - Sayangan Laundry PWA

## 1. Ikhtisar Produk
Sayangan Laundry PWA adalah aplikasi manajemen kasir dan pelacakan pesanan berbasis Progressive Web App (PWA). Sistem ini dirancang untuk operasional skala tunggal (*single-operator*) guna mengatasi masalah pencatatan manual (nota fisik hilang), piutang kasbon yang tidak terdata, serta potensi pakaian tertukar. 

## 2. Target Pengguna
1. **Pengelola / Kasir (Budhe):** Menginput transaksi, mencetak nota QR, memperbarui status cucian, dan memantau rekap pendapatan/kasbon harian.
2. **Pelanggan:** Memantau status pengerjaan laundry mereka melalui tautan publik / pemindaian QR Code tanpa perlu akun login.

## 3. Ruang Lingkup Sistem (Scope)
- **Frontend:** Next.js App Router (Mobile-First), Tailwind CSS, Lucide React (Sesuai `DESIGN_SYSTEM.md`).
- **Penyimpanan:** SQLite / PostgreSQL (Sesuai `DATABASE_SCHEMA.md`).
- **Notifikasi:** Integrasi API WhatsApp Gateway.
- **Hardware:** Dukungan pencetakan struk dan QR Code via Thermal Printer Bluetooth.

## 4. Prioritas Pengembangan (Tahapan Implementasi)
- **Fase 1 (Slicing & UI):** Pembuatan komponen UI, form login, form transaksi, halaman pembukuan, dan halaman tracking publik.
- **Fase 2 (Database & State):** Implementasi Prisma/Drizzle ORM untuk tabel orders, customers, dan services.
- **Fase 3 (Fungsionalitas):** Pembuatan API route untuk kalkulasi harga, pembaruan status pesanan, dan pembuatan QR Code.
- **Fase 4 (Integrasi Pihak Ketiga):** Penyambungan dengan layanan WhatsApp Gateway untuk pengiriman resi otomatis.