'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, PackageOpen, FileText, Plus, Receipt, MessageCircle, CheckCircle2, Clock } from 'lucide-react';
import { LaundryStatus } from '@prisma/client';
import UpdateStatusButton from '@/components/UpdateStatusButton';
import { generatePickupMessage, createWhatsAppUrl } from '@/lib/whatsappTemplate';

type Customer = {
  id: string;
  name: string;
  phone: string;
};

type Transaction = {
  id: string;
  invoiceNumber: string;
  weight: number;
  serviceType: string;
  totalPrice?: number;
  paymentStatus?: string;
  status: LaundryStatus;
  createdAt: Date;
  customer: Customer;
};

interface Props {
  transactions: Transaction[];
}

export default function TransactionListClient({ transactions }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Proses' | 'Selesai'>('Semua');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Proses') {
      matchesStatus = tx.status !== 'SELESAI';
    } else if (statusFilter === 'Selesai') {
      matchesStatus = tx.status === 'SELESAI';
    }

    return matchesSearch && matchesStatus;
  });

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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date)).replace(/\./g, ':').replace(',', '');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>
        
        <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
          {(['Semua', 'Proses', 'Selesai'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main>
        {filteredTransactions.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center mt-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200/50 mb-4">
              <PackageOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Transaksi tidak ditemukan</h4>
            <p className="text-sm text-slate-500 mb-5">
              {transactions.length === 0 
                ? 'Buat pesanan pertama Anda untuk mulai mengelola cucian.' 
                : 'Coba sesuaikan filter atau kata kunci pencarian Anda.'}
            </p>
            {transactions.length === 0 && (
              <Link 
                href="/transactions/new"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Buat Transaksi Baru
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => {
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
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">
                          {formatDateTime(tx.createdAt)}
                        </span>
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
      </main>
    </div>
  );
}
