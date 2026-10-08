import React from 'react';
import Link from 'next/link';
import { Clock, Droplets, Shirt, CheckCircle, MessageCircle, Phone, Sparkles, Check, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { LaundryStatus } from '@prisma/client';
import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';

export const dynamic = 'force-dynamic';

const getStepsForService = (serviceType: string) => {
  const typeLower = serviceType.toLowerCase();
  
  if (typeLower.includes('setrika saja') || typeLower.includes('hanya setrika')) {
    return [
      { id: LaundryStatus.ANTREAN, title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
      { id: LaundryStatus.DISETRIKA, title: 'Disetrika', subtitle: 'Sedang disetrika', activeIcon: Shirt },
      { id: LaundryStatus.SIAP_DIAMBIL, title: 'Siap Diambil', subtitle: 'Menunggu diambil', activeIcon: CheckCircle },
      { id: LaundryStatus.SELESAI, title: 'Selesai', subtitle: 'Sudah diambil', activeIcon: Sparkles },
    ];
  }
  
  if (typeLower.includes('lipat') || typeLower.includes('kering')) {
    return [
      { id: LaundryStatus.ANTREAN, title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
      { id: LaundryStatus.DICUCI, title: 'Dicuci', subtitle: 'Proses cuci', activeIcon: Droplets },
      { id: LaundryStatus.DISETRIKA, title: 'Dilipat', subtitle: 'Sedang dilipat', activeIcon: Shirt },
      { id: LaundryStatus.SIAP_DIAMBIL, title: 'Siap Diambil', subtitle: 'Menunggu diambil', activeIcon: CheckCircle },
      { id: LaundryStatus.SELESAI, title: 'Selesai', subtitle: 'Sudah diambil', activeIcon: Sparkles },
    ];
  }
  
  return [
    { id: LaundryStatus.ANTREAN, title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
    { id: LaundryStatus.DICUCI, title: 'Dicuci', subtitle: 'Proses cuci', activeIcon: Droplets },
    { id: LaundryStatus.DISETRIKA, title: 'Disetrika', subtitle: 'Sedang disetrika', activeIcon: Shirt },
    { id: LaundryStatus.SIAP_DIAMBIL, title: 'Siap Diambil', subtitle: 'Menunggu diambil', activeIcon: CheckCircle },
    { id: LaundryStatus.SELESAI, title: 'Selesai', subtitle: 'Sudah diambil', activeIcon: Sparkles },
  ];
};

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const transaction = await prisma.transaction.findUnique({
    where: { invoiceNumber: id },
    include: { customer: true },
  });

  if (!transaction) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Transaksi Tidak Ditemukan</h1>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            Mohon maaf, kami tidak dapat menemukan pesanan dengan nomor invoice <strong className="text-slate-800">{id}</strong>. Pastikan nomor sudah benar.
          </p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors inline-block w-full">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const steps = getStepsForService(transaction.serviceType);
  let currentStep = steps.findIndex(s => s.id === transaction.status);
  
  // Jika status saat ini ternyata adalah tahap yang di-skip (misal 'DICUCI' pada Setrika Saja), 
  // kita fallback ke tahap sebelumnya atau set 0.
  if (currentStep === -1) {
    if (transaction.status === LaundryStatus.DICUCI) currentStep = 0; // fallback to Antrean
    else if (transaction.status === LaundryStatus.DISETRIKA) currentStep = 1; 
    else currentStep = 0;
  }
  
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(transaction.createdAt);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(transaction.totalPrice);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <HeaderBrand layout="row" subtitle="PELANGGAN" />
          <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shrink-0">
            PELACAKAN
          </div>
        </div>

        {/* Title Section */}
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">Pelacakan pesanan</p>
          <h2 className="text-2xl font-bold text-slate-900">Status cucian kamu</h2>
        </div>

        {/* Kartu Informasi Resi Biru */}
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-6 top-6 text-blue-200">
            <Sparkles size={24} />
          </div>
          
          <p className="text-[11px] font-bold text-blue-200 tracking-wider uppercase mb-1">Nomor Resi</p>
          <h3 className="text-2xl font-bold tracking-wide mb-8">{transaction.invoiceNumber}</h3>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] font-medium text-blue-200 mb-0.5">Nama pelanggan</p>
              <p className="font-bold text-sm max-w-[140px] truncate">{transaction.customer.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-blue-200 mb-0.5">Tanggal masuk</p>
              <p className="font-bold text-sm">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Garis Waktu (Stepper) Progres Cucian */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Progress</p>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-slate-900">Tahapan cucian</h3>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
              Tahap {currentStep + 1} dari {steps.length}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="relative pt-2 pb-1 overflow-x-auto hide-scrollbar">
              <div className="min-w-[340px] relative">
                {/* Garis background horizontal */}
                <div 
                  className="absolute top-[24px] h-0.5 bg-slate-200"
                  style={{ 
                    left: `calc(50% / ${steps.length})`, 
                    right: `calc(50% / ${steps.length})` 
                  }}
                >
                  {/* Garis aktif biru */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between relative">
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isFuture = index > currentStep;
                    const ActiveIcon = step.activeIcon;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="h-8 flex items-center justify-center relative z-10 bg-white px-1">
                          {isCompleted && (
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm z-20">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                          {isActive && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-20">
                              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                <ActiveIcon size={14} />
                              </div>
                            </div>
                          )}
                          {isFuture && (
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center z-20">
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-3">
                          <p className={`text-[10px] sm:text-[11px] font-bold mb-0.5 ${isCompleted || isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                            {step.title}
                          </p>
                          <p className="text-[8px] sm:text-[9px] font-medium text-slate-400 leading-tight px-1 hidden sm:block">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rincian Tagihan */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Ringkasan</p>
          <h3 className="text-lg font-bold text-slate-900 mb-3">Rincian tagihan</h3>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="font-semibold text-slate-900 text-[15px] mb-1">{transaction.serviceType}</p>
                <p className="text-[11px] font-medium text-slate-400">Berat cucian {transaction.weight} Kg</p>
              </div>
              <p className="font-bold text-slate-900 text-lg">{formattedPrice}</p>
            </div>
            
            <hr className="border-slate-100 border-dashed mb-4" />
            
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-500">Status pembayaran</span>
              {transaction.paymentStatus === 'LUNAS' ? (
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  LUNAS
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                  BELUM LUNAS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Hubungi WhatsApp */}
        <a 
          href="https://wa.me/6285123456789" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white border border-slate-200 text-blue-600 rounded-2xl py-4 px-5 flex items-center justify-between font-bold text-[13px] shadow-sm hover:bg-slate-50 transition-colors"
        >
          <MessageCircle size={18} />
          <span>Hubungi WhatsApp Pengelola</span>
          <Phone size={18} />
        </a>

        {/* Footer Text */}
        <FooterBrand />
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
