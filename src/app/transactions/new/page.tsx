'use client';

import { useState } from 'react';
import { ArrowLeft, Droplets, QrCode, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function NewTransactionPage() {
  const [weight, setWeight] = useState<number | ''>('');
  const [serviceId, setServiceId] = useState('cuci_setrika');
  const [paymentStatus, setPaymentStatus] = useState('lunas');

  // Dummy data untuk layanan (bisa diambil dari API nanti)
  const services = [
    { id: 'cuci_setrika', name: 'Cuci & Setrika (Komplit)', price: 6000 },
    { id: 'cuci_lipat', name: 'Cuci Lipat (Cuci Saja)', price: 4000 },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 3000 },
  ];

  const selectedService = services.find(s => s.id === serviceId);
  const pricePerKg = selectedService?.price || 0;
  const total = (Number(weight) || 0) * pricePerKg;

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col p-6 sm:p-8">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 pt-2">
          <Link href="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Kasir</p>
              <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">Sayangan Laundry</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20">
              <Droplets className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Data pelanggan dan cucian</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Form Transaksi Baru</h1>
          <p className="text-sm text-slate-500">Lengkapi detail transaksi untuk membuat pesanan baru.</p>
        </div>

        {/* Main Form */}
        <div className="mt-2">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Nama Pelanggan */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-slate-800">Nama Pelanggan</label>
              <input 
                type="text" 
                placeholder="Contoh: Budi Santoso" 
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-slate-800">Nomor WhatsApp</label>
              <div className="flex">
                <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                  +62
                </div>
                <input 
                  type="tel" 
                  placeholder="812 3456 7890" 
                  className="w-full rounded-r-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Grid Berat & Layanan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Berat <span className="text-slate-400 font-normal">(Kg)</span>
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 pointer-events-none">
                    kg
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-800">Layanan</label>
                <div className="relative">
                  <select 
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="appearance-none w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Status Bayar */}
            <div className="flex flex-col space-y-2 pt-1">
              <label className="text-sm font-semibold text-slate-800">Status Bayar</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Lunas */}
                <label className={`relative flex cursor-pointer items-center rounded-xl border p-4 transition-all duration-200 ${paymentStatus === 'lunas' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="payment_status" 
                    value="lunas" 
                    className="peer sr-only" 
                    checked={paymentStatus === 'lunas'} 
                    onChange={() => setPaymentStatus('lunas')} 
                  />
                  <div className={`mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${paymentStatus === 'lunas' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                    {paymentStatus === 'lunas' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className={`text-sm font-medium ${paymentStatus === 'lunas' ? 'text-blue-700' : 'text-slate-600'}`}>
                    Lunas
                  </span>
                </label>
                
                {/* Belum Lunas (Kasbon) - Merujuk pada aturan oranye di DESIGN_SYSTEM.md */}
                <label className={`relative flex cursor-pointer items-center rounded-xl border p-4 transition-all duration-200 ${paymentStatus === 'kasbon' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="payment_status" 
                    value="kasbon" 
                    className="peer sr-only" 
                    checked={paymentStatus === 'kasbon'} 
                    onChange={() => setPaymentStatus('kasbon')} 
                  />
                  <div className={`mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${paymentStatus === 'kasbon' ? 'border-amber-500 bg-amber-500' : 'border-slate-300 bg-white'}`}>
                    {paymentStatus === 'kasbon' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className={`text-sm font-medium ${paymentStatus === 'kasbon' ? 'text-amber-700' : 'text-slate-600'}`}>
                    Belum Lunas
                  </span>
                </label>
              </div>
            </div>

            {/* Catatan Fisik */}
            <div className="flex flex-col space-y-2 pt-1">
              <label className="text-sm font-semibold text-slate-800">
                Catatan Fisik Pakaian <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea 
                rows={3}
                placeholder="Contoh: Noda di bagian kerah, kancing lepas..." 
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
              />
            </div>

            {/* Area Kalkulasi Total Otomatis (Ekstra fitur yang diminta) */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tagihan</span>
                <span className="text-sm font-medium text-slate-400 mt-0.5">
                  {weight ? `${weight} kg × Rp ${new Intl.NumberFormat('id-ID').format(pricePerKg)}` : 'Pilih berat & layanan'}
                </span>
              </div>
              <span className="text-2xl font-black text-blue-600 tracking-tight">
                Rp {new Intl.NumberFormat('id-ID').format(total)}
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all active:scale-[0.98]"
              >
                <QrCode className="h-5 w-5" />
                <span>+ Simpan & Cetak QR Code</span>
              </button>
            </div>

          </form>
        </div>
        
        {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Pastikan data sudah benar sebelum disimpan.
          </p>
        </div>

      </div>
    </div>
  );
}
