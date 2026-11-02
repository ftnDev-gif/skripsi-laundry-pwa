import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';
import { 
  Droplets, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight,
  Inbox,
  PackageOpen,
  QrCode,
  LogOut,
  Receipt,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { LaundryStatus } from '@prisma/client';
import UpdateStatusButton from '@/components/UpdateStatusButton';
import { logoutKasir } from '@/actions/auth';
import { generatePickupMessage, createWhatsAppUrl } from '@/lib/whatsappTemplate';

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
      badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
      actionText: 'Update'
    };

    switch (status) {
      case 'SELESAI':
        result = {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
          bgIcon: 'bg-emerald-50',
          badgeText: 'Selesai',
          badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          actionText: 'Ambil Cucian'
        };
        break;
      case 'ANTREAN':
        result = {
          icon: <FileText className="h-6 w-6 text-amber-600" />,
          bgIcon: 'bg-amber-50',
          badgeText: 'Menunggu',
          badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
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
          icon: <Clock className="h-6 w-6 text-indigo-600" />,
          bgIcon: 'bg-indigo-50',
          badgeText: status === 'DICUCI' ? 'Sedang Dicuci' : 'Sedang Disetrika',
          badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
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
          badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
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
          <form action={logoutKasir}>
            <button type="submit" className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-red-500 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" title="Keluar">
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-semibold">Keluar</span>
            </button>
          </form>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          
          {/* Greeting & Date */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Selamat pagi, Kasir!</p>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Ringkasan Hari Ini
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
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm">
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
            </div>
          </div>

          {/* Action Buttons Area */}
          <div className="space-y-3">
            {/* Main Action */}
            <Link 
              href="/transactions/new"
              className="w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Transaksi Baru
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/scan"
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 shadow-sm active:scale-[0.98] transition-all hover:bg-slate-100"
              >
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-slate-100">
                  <QrCode className="h-5 w-5 text-slate-600" />
                </div>
                <span className="text-[11px] font-semibold text-center">Scan QR<br/>Keranjang</span>
              </Link>
              
              <Link 
                href="/reports"
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 shadow-sm active:scale-[0.98] transition-all hover:bg-slate-100"
              >
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-slate-100">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <span className="text-[11px] font-semibold text-center">Laporan &<br/>Kasbon</span>
              </Link>
            </div>
          </div>

          {/* Activity Section */}
          <section className="pt-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                  Aktivitas
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  Transaksi Terakhir
                </h3>
              </div>
              {transactions.length > 0 && (
                <Link href="/transactions" className="flex items-center text-sm font-medium text-blue-600">
                  Lihat Semua <ChevronRight className="h-4 w-4 ml-0.5" />
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
              <div className="space-y-4">
                {transactions.map((tx) => {
                  const display = getStatusDisplay(tx.status, tx.serviceType);
                  return (
                    <div key={tx.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                      {/* Header Kartu */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <Link href={`/transactions/receipt?id=${tx.id}`} className="flex-none">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${display.bgIcon} hover:opacity-80 transition-opacity`}>
                              {display.icon}
                            </div>
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link href={`/transactions/receipt?id=${tx.id}`} className="hover:underline">
                              <h4 className="font-semibold text-slate-900 truncate">{tx.customer.name}</h4>
                            </Link>
                            <span className="text-xs text-slate-400 block mt-0.5">{formatTime(tx.createdAt)}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full shrink-0 ${display.badgeClass}`}>
                          {display.badgeText}
                        </span>
                      </div>

                      {/* Body Kartu (Margin kiri sejajar teks nama: h-11 (2.75rem) + gap-3.5 (0.875rem) = pl-[3.625rem]) */}
                      <div className="pl-[3.625rem]">
                        <p className="text-xs text-slate-500 truncate">
                          <Link href={`/transactions/receipt?id=${tx.id}`} className="text-blue-600 font-medium hover:underline">
                            {tx.invoiceNumber}
                          </Link>
                          {' '}&bull; {tx.weight} Kg &bull; {tx.serviceType}
                        </p>
                      </div>

                      {/* Footer Kartu */}
                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                        {/* Sisi Kiri: Tombol Outline Update Progres */}
                        <div>
                          <UpdateStatusButton 
                            transactionId={tx.id} 
                            currentStatus={tx.status} 
                            serviceType={tx.serviceType}
                            actionText={display.actionText} 
                          />
                        </div>

                        {/* Sisi Kanan: Aksi WA Kondisional & Nota Digital */}
                        <div className="flex items-center gap-1.5">
                          {tx.status === 'SIAP_DIAMBIL' && tx.customer.phone && (
                            <a
                              href={createWhatsAppUrl(
                                tx.customer.phone,
                                generatePickupMessage(tx.customer.name, tx.invoiceNumber)
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors flex items-center justify-center"
                              title="Kirim Pengingat Siap Diambil via WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          )}
                          <Link 
                            href={`/transactions/receipt?id=${tx.id}`} 
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
                            title="Lihat Nota Digital"
                          >
                            <Receipt className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
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
