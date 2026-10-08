import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, ScanLine, Receipt, FileText } from 'lucide-react';
import StatusControl from './StatusControl';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ScanManagePage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const idOrInvoice = resolvedParams.id;

  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { invoiceNumber: idOrInvoice },
        { id: idOrInvoice }
      ]
    },
    include: { customer: true }
  });

  if (!transaction) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
        <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6 items-center justify-center text-center">
          <HeaderBrand layout="row" subtitle="KASIR"/>
          <div className="my-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <FileText className="w-8 h-8"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Transaksi Tidak Ditemukan</h2>
            <p className="text-sm text-slate-500 mb-6">
              Nomor invoice atau ID &quot;{idOrInvoice}&quot; tidak terdaftar di sistem.
            </p>
            <Link className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors" href="/scan">
              <ScanLine className="w-4 h-4"/>
              Pindai Ulang
            </Link>
          </div>
          <FooterBrand/>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const paymentBadgeClass = transaction.paymentStatus === 'LUNAS'
    ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
    : 'bg-amber-400/20 text-amber-200 border border-amber-300/30';

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <HeaderBrand layout="row" subtitle="KASIR"/>
          <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            MANAJEMEN
          </span>
        </header>

        {/* Navigasi */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-transform active:scale-95 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">
              KONTROL STATUS
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Kelola pesanan
            </h1>
          </div>
        </div>

        {/* Kartu Ringkasan Nota */}
        <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                NOMOR RESI
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">
                {transaction.invoiceNumber}
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${paymentBadgeClass}`}>
              {transaction.paymentStatus}
            </span>
          </div>

          <div className="space-y-1.5 border-t border-blue-500/40 pt-3 text-sm">
            <div className="flex justify-between text-blue-100">
              <span>Pelanggan</span>
              <span className="font-semibold text-white">{transaction.customer.name}</span>
            </div>
            <div className="flex justify-between text-blue-100">
              <span>Layanan</span>
              <span className="font-semibold text-white">{transaction.serviceType}</span>
            </div>
            <div className="flex justify-between text-blue-100">
              <span>Berat / Tagihan</span>
              <span className="font-semibold text-white">
                {transaction.weight} Kg &middot; {formatCurrency(transaction.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Kontrol Aksi Update Status */}
        <StatusControl
          transactionId={transaction.id}
          currentStatus={transaction.status}
          serviceType={transaction.serviceType}
        />

        {/* Aksi Tambahan */}
        <div className="flex flex-col gap-2 pt-2">
          <Link className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors" href="/scan">
            <ScanLine className="w-4 h-4"/>
            Pindai Keranjang Lain
          </Link>

          <Link className="w-full flex items-center justify-center gap-2 py-3 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors" href={`/transactions/receipt?invoice=${transaction.invoiceNumber}`}>
            <Receipt className="w-4 h-4"/>
            Lihat Nota Digital
          </Link>
        </div>

        {/* Footer */}
        <FooterBrand/>
      </div>
    </div>
  );
}