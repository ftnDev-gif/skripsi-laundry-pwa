import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TransactionListClient from './TransactionListClient';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  // Ambil semua transaksi
  const transactions = await prisma.transaction.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Header Area */}
        <header className="flex items-center justify-between">
          <HeaderBrand subtitle="KASIR" layout="row" />
          <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
            RIWAYAT
          </span>
        </header>

        {/* Navigation & Title */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-transform active:scale-95 hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">
              RIWAYAT & DAFTAR
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Semua Transaksi
            </h1>
          </div>
        </div>

        {/* Main Content using Client Component */}
        <TransactionListClient transactions={transactions} />
        
        {/* Footer Text */}
        <FooterBrand />
      </div>
    </div>
  );
}

