import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Droplets } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ReceiptActions from './ReceiptActions';

export const dynamic = 'force-dynamic';

export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;

  if (!invoice) {
    notFound();
  }

  const transaction = await prisma.transaction.findUnique({
    where: { invoiceNumber: invoice },
    include: { customer: true },
  });

  if (!transaction) {
    notFound();
  }

  // Generate tracking URL based on current host
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const trackingUrl = `${baseUrl}/tracking/${transaction.invoiceNumber}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-6 print:shadow-none print:border-none print:rounded-none print:mb-0">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3">
              <Droplets className="text-white h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sayangan Laundry</h1>
            <p className="text-sm text-slate-500 mt-1">Bersih, Rapi & Wangi</p>
            <p className="text-xs text-slate-400 mt-1">Jl. Pendidikan No. 1, Yogyakarta</p>
            <p className="text-xs text-slate-400 mt-1">
              {new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(transaction.createdAt)} WIB
            </p>
          </div>

          {/* Identitas Pesanan & Rincian */}
          <div className="p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">No. Invoice</p>
                <p className="font-semibold text-slate-900">{transaction.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-0.5">Status Pembayaran</p>
                {transaction.paymentStatus === 'LUNAS' ? (
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                    Lunas
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100">
                    Belum Lunas
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-0.5">Pelanggan</p>
              <p className="font-medium text-slate-900">{transaction.customer.name}</p>
              <p className="text-sm text-slate-500">{transaction.customer.phone}</p>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Rincian Layanan</h3>
              
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-slate-600">{transaction.serviceType} ({transaction.weight} Kg)</span>
                <span className="font-medium text-slate-900">
                  Rp {new Intl.NumberFormat('id-ID').format(transaction.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500 text-xs">
                  Tarif: Rp {new Intl.NumberFormat('id-ID').format(transaction.pricePerKg)} / Kg
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total Tagihan</span>
                <span className="font-bold text-blue-600 text-lg">
                  Rp {new Intl.NumberFormat('id-ID').format(transaction.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Tracking Section */}
          <div className="p-6 bg-slate-50/50 flex flex-col items-center border-t border-slate-100">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-3">
              <QRCodeSVG value={trackingUrl} size={128} />
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

        <ReceiptActions 
          invoiceNumber={transaction.invoiceNumber}
          customerName={transaction.customer.name}
          totalPrice={transaction.totalPrice}
          trackingUrl={trackingUrl}
          customerPhone={transaction.customer.phone}
        />
      </div>

      <style>{`
        @media print {
          body { background-color: white !important; }
          @page { margin: 0; size: auto; }
        }
      `}</style>
    </div>
  );
}
