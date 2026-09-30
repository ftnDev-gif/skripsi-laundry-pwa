# 🧺 Sayangan Laundry - Progressive Web App (PWA)

## 📌 Deskripsi Proyek
Proyek ini adalah sistem informasi manajemen operasional untuk UMKM Sayangan Laundry berbasis **Progressive Web App (PWA)**. Sistem ini dirancang khusus untuk model operasional *single-operator* guna menggantikan pencatatan nota manual. Sistem ini mengintegrasikan otomasi notifikasi via **WhatsApp Gateway** dan fitur pelacakan (*tracking*) status cucian secara mandiri bagi pelanggan menggunakan **QR Code**.

## 🚀 Fitur Utama
1. **PWA & Offline-Ready:** Aplikasi kasir ringan yang dapat diinstal langsung ke layar utama (*homescreen*) perangkat Android tanpa melalui Play Store.
2. **QR Code Generator:** Pembuatan QR Code unik secara otomatis untuk setiap nota transaksi yang berfungsi sebagai label fisik sekaligus pelacak digital.
3. **WhatsApp Gateway Otomatis:** Pengiriman pesan konfirmasi pesanan dan notifikasi pengambilan cucian (saat status "Selesai") secara otomatis ke nomor WhatsApp pelanggan.
4. **Self-Service Tracking:** Halaman pelacakan publik di mana pelanggan dapat memantau progres pakaian mereka secara *real-time* dengan memindai QR Code.
5. **Rekapitulasi Transaksi:** Pencatatan otomatis pendapatan dan piutang/kasbon pelanggan.

## 🛠️ Tech Stack (Rencana Implementasi)
- **Front-end:** Next.js, Tailwind CSS, PWA Service Workers
- **Back-end:** Next.js API Routes / Node.js
- **Database:** PostgreSQL (Supabase / Neon)
- **Third-Party API:** Wablas / Fonnte (WhatsApp Gateway), QRCode.js

## 👨‍💻 Pengembang
- **Nama:** Fatoni Abdullah Luthfi
- **Institusi:** Universitas Muhammadiyah Surakarta (UMS)
- **Tugas Akhir / Skripsi 2026**
