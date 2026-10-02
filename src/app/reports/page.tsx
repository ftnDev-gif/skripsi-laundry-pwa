import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  ChevronDown, 
  DollarSign, 
  Filter, 
  Check, 
  Receipt, 
  Printer,
  HandCoins
} from 'lucide-react';
import HeaderBrand from '@/components/HeaderBrand';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <HeaderBrand layout="row" subtitle="KASIR" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-[10px] font-bold tracking-widest text-blue-600 uppercase mb-1">
            LAPORAN KEUANGAN
          </h2>
          <h1 className="text-2xl font-bold text-slate-900">
            Rekap & Kasbon
          </h1>
        </div>

        {/* Filter Tab */}
        <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
          <button className="flex-1 py-2 text-sm font-medium text-slate-500 rounded-xl hover:text-slate-700 transition-colors">
            Hari Ini
          </button>
          <button className="flex-1 py-2 text-sm font-medium text-slate-500 rounded-xl hover:text-slate-700 transition-colors">
            Minggu Ini
          </button>
          <button className="flex-1 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow-sm">
            Bulan Ini
          </button>
        </div>

        {/* Date / Month Picker */}
        <div className="flex items-center justify-between text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>September 2026</span>
          </div>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </div>

        {/* Financial Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Omzet Bersih */}
          <div className="bg-blue-600 rounded-[1.5rem] p-4 flex flex-col justify-between text-white shadow-sm h-36">
            <div className="flex justify-between items-start">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Pendapatan</span>
            </div>
            <div>
              <div className="text-xl font-bold mb-1">Rp 1.450.000</div>
              <div className="text-xs text-blue-100">185 Kg selesai</div>
            </div>
          </div>

          {/* Piutang Kasbon */}
          <div className="bg-white rounded-[1.5rem] p-4 flex flex-col justify-between shadow-sm border border-amber-200 h-36 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[4rem] -z-10"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <HandCoins className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Kasbon</span>
            </div>
            <div className="relative z-10">
              <div className="text-xl font-bold text-slate-900 mb-1">Rp 65.000</div>
              <div className="text-xs text-slate-500">3 Pelanggan</div>
            </div>
          </div>
        </div>

        {/* Transaksi Belum Lunas */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                AKTIVITAS KEUANGAN
              </h3>
              <h2 className="text-lg font-bold text-slate-900 leading-none">
                Daftar Transaksi
              </h2>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
              <Filter className="h-3.5 w-3.5" />
              Kasbon
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* Lunas 1 */}
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <Check className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">Budi Santoso</h4>
                  <span className="text-[10px] text-slate-400 font-medium">25 Sep 2026</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">INV-202609-001 · 4 Kg Cuci Komplit</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">Lunas</span>
                  <span className="font-bold text-slate-900 text-sm">Rp 24.000</span>
                </div>
              </div>
            </div>

            {/* Kasbon */}
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">Bu Sisri</h4>
                  <span className="text-[10px] text-slate-400 font-medium">25 Sep 2026</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">INV-202609-002 · 8.5 Kg Setrika</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">Kasbon (Belum Lunas)</span>
                  <span className="font-bold text-slate-900 text-sm">Rp 25.500</span>
                </div>
              </div>
            </div>
            
            {/* Lunas 2 */}
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <Check className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">Andi Wijaya</h4>
                  <span className="text-[10px] text-slate-400 font-medium">24 Sep 2026</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">INV-202609-003 · 3 Kg Cuci Komplit</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">Lunas</span>
                  <span className="font-bold text-slate-900 text-sm">Rp 18.000</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pb-2">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
            <Printer className="h-5 w-5" />
            Cetak Rekapan Bulanan
          </button>
          
          <div className="text-center mt-6">
            <span className="text-xs text-slate-400">
              Laundry jadi lebih mudah bersama Sayangan
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
