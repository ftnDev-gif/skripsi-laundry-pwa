import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';
import { 
  Bell, 
  Droplets, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight,
  Inbox,
  PackageOpen,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { LaundryStatus } from '@prisma/client';
import UpdateStatusButton from '@/components/UpdateStatusButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Ambil transaksi terbaru (misal 5 transaksi terakhir)
  const transactions = await prisma.transaction.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Semua transaksi aktif untuk ringkasan (belum selesai)
  const activeTransactions = await prisma.transaction.findMany({
    where: {
      status: {
        not: 'SELESAI'
      }
    }
  });

  const totalActiveWeight = activeTransactions.reduce((acc, curr) => acc + curr.weight, 0);
  const totalActiveIncome = activeTransactions.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date for the badge
  const today = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  // Helper untuk tampilan status
  const getStatusDisplay = (status: LaundryStatus, serviceType: string) => {
    let result = {
      icon: <FileText className="h-6 w-6 text-slate-500" />,
      bgIcon: 'bg-slate-100',
      badgeText: status as string,
      badgeClass: 'bg-slate-100 text-slate-700',
      actionText: 'Update'
    };

    switch (status) {
      case 'SELESAI':
        result = {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
          bgIcon: 'bg-emerald-50',
          badgeText: 'Selesai',
          badgeClass: 'bg-emerald-50 text-emerald-700',
          actionText: 'Ambil Cucian'
        };
        break;
      case 'ANTREAN':
        result = {
          icon: <FileText className="h-6 w-6 text-slate-500" />,
          bgIcon: 'bg-slate-100',
          badgeText: 'Menunggu',
          badgeClass: 'bg-slate-100 text-slate-700',
          actionText: 'Mulai Cuci'
        };
        // Trik Re-mapping untuk Setrika Saja
        if (serviceType.includes('Setrika Saja')) {
          result.actionText = 'Mulai Setrika';
        }
        break;
      case 'DICUCI':
      case 'DISETRIKA':
        result = {
          icon: <Clock className="h-6 w-6 text-amber-600" />,
          bgIcon: 'bg-amber-50',
          badgeText: status === 'DICUCI' ? 'Sedang Dicuci' : 'Sedang Disetrika',
          badgeClass: 'bg-amber-50 text-amber-700',
          actionText: 'Tandai Selesai'
        };
        
        // Trik Re-mapping untuk Cuci Lipat
        if (status === 'DISETRIKA' && serviceType.includes('Lipat')) {
          result.badgeText = 'Sedang Dilipat';
          result.actionText = 'Selesai Dilipat';
        }
        break;
      case 'SIAP_DIAMBIL':
        result = {
          icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
          bgIcon: 'bg-blue-50',
          badgeText: 'Siap Diambil',
          badgeClass: 'bg-blue-50 text-blue-700',
          actionText: 'Selesaikan'
        };
        break;
    }
    
    return result;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Header Area */}
        <header className="flex items-center justify-between">
          <HeaderBrand subtitle="KASIR" layout="row" />
          <Link href="/scan" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm hover:bg-slate-100 transition-colors">
            <QrCode className="h-5 w-5" />
          </Link>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          
          {/* Greeting & Date */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Selamat pagi, Kasir!</p>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Ringkasan hari ini
              </h2>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {today}
              </span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Total Cucian Aktif */}
            <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                  <Droplets className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-100">Aktif</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-0.5">{totalActiveWeight} Kg</h3>
                <p className="text-sm text-blue-100">Cucian diproses</p>
              </div>
            </div>

            {/* Card 2: Pendapatan Aktif */}
            <Link href="/reports" className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm block hover:bg-slate-100 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100/50">
                  <Inbox className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-slate-400">Belum Selesai</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-0.5">{formatCurrency(totalActiveIncome)}</h3>
                <p className="text-sm text-slate-500">Estimasi Tagihan</p>
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
              {transactions.length > 0 && (
                <Link href="/transactions" className="flex items-center text-sm font-medium text-blue-600">
                  Lihat semua <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              )}
            </div>

            {/* Transaction List */}
            {transactions.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200/50 mb-4">
                  <PackageOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Belum ada transaksi</h4>
                <p className="text-sm text-slate-500 mb-5">
                  Buat pesanan pertama Anda untuk mulai mengelola cucian.
                </p>
                <Link 
                  href="/transactions/new"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Buat Transaksi
                </Link>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm space-y-6">
                {transactions.map((tx, index) => {
                  const display = getStatusDisplay(tx.status, tx.serviceType);
                  return (
                    <div key={tx.id}>
                      <div className="flex gap-4">
                        <div className="flex-none">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${display.bgIcon}`}>
                            {display.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-slate-900 truncate">{tx.customer.name}</h4>
                            <span className="text-xs text-slate-400 flex-none ml-2">{formatTime(tx.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2 truncate">
                            {tx.invoiceNumber} &middot; {tx.weight} Kg &middot; {tx.serviceType}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${display.badgeClass}`}>
                              {display.badgeText}
                            </span>
                            <UpdateStatusButton 
                              transactionId={tx.id} 
                              currentStatus={tx.status} 
                              serviceType={tx.serviceType}
                              actionText={display.actionText} 
                            />
                          </div>
                        </div>
                      </div>
                      {index < transactions.length - 1 && (
                        <hr className="border-slate-100 mt-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </main>
        
        {/* Footer Text */}
        <FooterBrand />
      </div>
    </div>
  );
}
