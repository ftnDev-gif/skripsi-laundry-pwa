'use client';

import React from 'react';
import Link from 'next/link';
import { Droplets, QrCode, Printer, MessageCircle, ArrowLeft } from 'lucide-react';

export default function ReceiptPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:py-8 font-sans">
      <div className="max-w-md mx-auto">
        {/* Kontainer Nota (Receipt Card) - Disembunyikan border/shadow-nya saat dicetak jika perlu, namun untuk printer thermal/kertas biasa akan terpotong sesuai konten */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-6 print:shadow-none print:border-none print:rounded-none">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3">
              <Droplets className="text-white h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sayangan Laundry</h1>
            <p className="text-sm text-slate-500 mt-1">Bersih, Rapi & Wangi</p>
            <p className="text-xs text-slate-400 mt-1">Jl. Pendidikan No. 1, Yogyakarta</p>
            <p className="text-xs text-slate-400 mt-1">02 Oktober 2026 • 09:41 WIB</p>
          </div>

          {/* Identitas Pesanan & Rincian */}
          <div className="p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">No. Invoice</p>
                <p className="font-semibold text-slate-900">INV-202610-001</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-0.5">Status Pembayaran</p>
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                  Lunas
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-0.5">Pelanggan</p>
              <p className="font-medium text-slate-900">Budi Santoso</p>
              <p className="text-sm text-slate-500">0812-3456-7890</p>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Rincian Layanan</h3>
              
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-slate-600">Cuci & Setrika (3 Kg)</span>
                <span className="font-medium text-slate-900">Rp 24.000</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500 text-xs">Tarif: Rp 8.000 / Kg</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total Tagihan</span>
                <span className="font-bold text-blue-600 text-lg">Rp 24.000</span>
              </div>
            </div>
          </div>

          {/* QR Code Tracking Section */}
          <div className="p-6 bg-slate-50/50 flex flex-col items-center border-t border-slate-100">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-3">
              {/* Dummy QR Code */}
              <QrCode className="w-32 h-32 text-slate-800" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-slate-500 text-center max-w-[200px]">
              Pindai QR ini untuk cek progres cucian Anda
            </p>
          </div>
          
          {/* Footer Note */}
          <div className="bg-slate-100/50 p-4 text-center">
             <p className="text-xs text-slate-500 font-medium">
               Pengambilan pakaian wajib menunjukkan nota/QR ini.
             </p>
          </div>
        </div>

        {/* Tombol Aksi Bawah - Disembunyikan saat di print */}
        <div className="space-y-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
          >
            <Printer className="w-5 h-5 mr-2" />
            Cetak Nota
          </button>
          
          {/* Link simulasi WhatsApp */}
          <a 
            href="https://wa.me/6281234567890?text=Halo%20Budi%20Santoso,%20pesanan%20laundry%20Anda%20dengan%20nomor%20INV-202610-001%20telah%20diterima.%20Total%20tagihan:%20Rp%2024.000.%20Anda%20dapat%20melacak%20status%20cucian%20melalui%20link%20berikut:%20https://sayanganlaundry.com/track/INV-202610-001" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-slate-50 text-emerald-600 border border-slate-200 font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Kirim Notifikasi WhatsApp
          </a>

          <Link 
            href="/dashboard"
            className="w-full text-slate-500 hover:text-slate-700 font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* Style Global Khusus Print (Media Query) */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
          /* Hilangkan elemen lain dari layar jika komponen ini di-render bersama layout umum (opsional) */
        }
      `}</style>
    </div>
  );
}

