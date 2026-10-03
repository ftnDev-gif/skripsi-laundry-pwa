import HeaderBrand from '@/components/HeaderBrand';
import { 
  Bell, 
  Droplets, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight,
  Inbox
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Header Area */}
        <header className="flex items-center justify-between">
          <HeaderBrand subtitle="KASIR" layout="row" />
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm">
            <Bell className="h-5 w-5" />
          </button>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          
          {/* Greeting & Date */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Selamat pagi, Kasir!</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Ringkasan hari ini
            </h2>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              25 Sep 2026
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: Total Cucian */}
          <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-100">Hari ini</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-0.5">15 Kg</h3>
              <p className="text-sm text-blue-100">Total cucian</p>
            </div>
          </div>

          {/* Card 2: Pendapatan */}
          <Link href="/reports" className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm block hover:bg-slate-100 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100/50">
                <Inbox className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Hari ini</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-0.5">Rp 120.000</h3>
              <p className="text-sm text-slate-500">Pendapatan</p>
            </div>
          </Link>
        </div>

        {/* CTA Button */}
        <Link 
          href="/transactions/new"
          className="w-full flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl font-medium shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Transaksi Baru
        </Link>

        {/* Activity Section */}
        <section className="pt-2">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                Aktivitas
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                Transaksi terakhir
              </h3>
            </div>
            <Link href="/transactions" className="flex items-center text-sm font-medium text-blue-600">
              Lihat semua <ChevronRight className="h-4 w-4 ml-0.5" />
            </Link>
          </div>

          {/* Transaction List */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm space-y-6">
            
            {/* Item 1: Selesai */}
            <div className="flex gap-4">
              <div className="flex-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-900 truncate">Budi Santoso</h4>
                  <span className="text-xs text-slate-400 flex-none ml-2">09:42</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">
                  INV-001 &middot; 2,5 Kg &middot; Reguler
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                    Selesai
                  </span>
                  <button className="text-[10px] font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Ambil Cucian
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Item 2: Sedang Dicuci */}
            <div className="flex gap-4">
              <div className="flex-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-900 truncate">Siti Aminah</h4>
                  <span className="text-xs text-slate-400 flex-none ml-2">10:15</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">
                  INV-002 &middot; 4 Kg &middot; Express
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">
                    Sedang Dicuci
                  </span>
                  <button className="text-[10px] font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Tandai Selesai
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Item 3: Menunggu */}
            <div className="flex gap-4">
              <div className="flex-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FileText className="h-6 w-6 text-slate-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-900 truncate">Andi Wijaya</h4>
                  <span className="text-xs text-slate-400 flex-none ml-2">10:38</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">
                  INV-003 &middot; 1,5 Kg &middot; Reguler
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                    Menunggu
                  </span>
                  <button className="text-[10px] font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Mulai Cuci
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        </main>
        
        {/* Footer Text */}
        <div className="mt-2 mb-2 text-center">
          <p className="text-xs font-medium text-slate-400">
            Laundry jadi lebih mudah bersama Sayangan
          </p>
        </div>
      </div>
    </div>
  );
}
