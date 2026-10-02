import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Droplets, Shirt, CheckCircle, MessageCircle, Phone, Sparkles, Check } from 'lucide-react';

export default function TrackingPage({ params }: { params: { id: string } }) {
  // Simulasi data pesanan sesuai dengan mockup terbaru
  const order = {
    id: 'INV-202609-001',
    customerName: 'Budi Santoso',
    entryDate: '25 Sep 2026',
    service: 'Cuci Komplit',
    weight: 4,
    totalPrice: 'Rp 24.000',
    paymentStatus: 'Lunas',
    currentStep: 2, // 0: Antrean, 1: Dicuci, 2: Disetrika, 3: Siap Diambil
  };

  const steps = [
    { title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
    { title: 'Dicuci', subtitle: 'Pencucian selesai', activeIcon: Droplets },
    { title: 'Disetrika', subtitle: 'Sedang dikerjakan', activeIcon: Shirt },
    { title: 'Siap Diambil', subtitle: 'Menunggu proses', activeIcon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 px-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">Kasir</p>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight">Sayangan Laundry</h1>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shrink-0">
            Tracking
          </div>
        </div>

        {/* Title Section */}
        <div className="flex gap-4 items-center">
          <Link 
            href="/" 
            className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-0.5">Pelacakan pesanan</p>
            <h2 className="text-2xl font-extrabold text-slate-900">Status cucian kamu</h2>
          </div>
        </div>

        {/* Kartu Informasi Resi Biru */}
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-6 top-6 text-blue-200">
            <Sparkles size={24} />
          </div>
          
          <p className="text-[11px] font-bold text-blue-200 tracking-wider uppercase mb-1">Nomor Resi</p>
          <h3 className="text-2xl font-extrabold tracking-wide mb-8">{order.id}</h3>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] font-medium text-blue-200 mb-0.5">Nama pelanggan</p>
              <p className="font-bold text-sm">{order.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-blue-200 mb-0.5">Tanggal masuk</p>
              <p className="font-bold text-sm">{order.entryDate}</p>
            </div>
          </div>
        </div>

        {/* Garis Waktu (Stepper) Progres Cucian */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Progress</p>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-extrabold text-slate-900">Tahapan cucian</h3>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
              Tahap {order.currentStep + 1} dari {steps.length}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="relative pt-2 pb-1">
              {/* Garis background horizontal */}
              <div className="absolute top-[24px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-200"></div>
              
              {/* Garis aktif biru */}
              <div 
                className="absolute top-[24px] left-[12.5%] h-0.5 bg-blue-600 transition-all duration-500" 
                style={{ width: `${(order.currentStep / (steps.length - 1)) * 75}%` }}
              ></div>

              <div className="flex justify-between relative">
                {steps.map((step, index) => {
                  const isCompleted = index < order.currentStep;
                  const isActive = index === order.currentStep;
                  const isFuture = index > order.currentStep;
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
                        <p className={`text-[11px] font-extrabold mb-0.5 ${isCompleted || isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 leading-tight px-1">
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

        {/* Rincian Tagihan */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Ringkasan</p>
          <h3 className="text-xl font-extrabold text-slate-900 mb-3">Rincian tagihan</h3>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="font-extrabold text-slate-900 text-[15px] mb-1">{order.service}</p>
                <p className="text-[11px] font-medium text-slate-400">Berat cucian {order.weight} Kg</p>
              </div>
              <p className="font-extrabold text-slate-900 text-lg">{order.totalPrice}</p>
            </div>
            
            <hr className="border-slate-100 border-dashed mb-4" />
            
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-500">Status pembayaran</span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Hubungi WhatsApp */}
        <a 
          href="https://wa.me/6281234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white border border-slate-200 text-blue-600 rounded-2xl py-4 px-5 flex items-center justify-between font-bold text-[13px] shadow-sm hover:bg-slate-50 transition-colors"
        >
          <MessageCircle size={18} />
          <span>Hubungi WhatsApp Pengelola</span>
          <Phone size={18} />
        </a>

        {/* Footer Text */}
        <p className="text-center text-[10px] font-medium text-slate-400">
          Laundry jadi lebih mudah bersama Sayangan
        </p>

      </div>
    </div>
  );
}
