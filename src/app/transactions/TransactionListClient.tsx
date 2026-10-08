'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, PackageOpen, CheckCircle2, Clock, FileText, Plus } from 'lucide-react';
import { LaundryStatus } from '@prisma/client';
import UpdateStatusButton from '@/components/UpdateStatusButton';

type Customer = {
  id: string;
  name: string;
};

type Transaction = {
  id: string;
  invoiceNumber: string;
  weight: number;
  serviceType: string;
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
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm space-y-6">
            {filteredTransactions.map((tx, index) => {
              const display = getStatusDisplay(tx.status, tx.serviceType);
              return (
                <div key={tx.id}>
                  <div className="flex gap-4">
                    {/* Avatar/Icon - Clickable to Receipt */}
                    <Link href={`/transactions/receipt?invoice=${tx.invoiceNumber}`} className="flex-none">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${display.bgIcon} hover:opacity-80 transition-opacity`}>
                        {display.icon}
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/transactions/receipt?invoice=${tx.invoiceNumber}`} className="hover:underline">
                          <h4 className="font-semibold text-slate-900 truncate">{tx.customer.name}</h4>
                        </Link>
                        <span className="text-xs text-slate-400 font-medium flex-none ml-2 text-right">
                          {formatDateTime(tx.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 mb-2 truncate">
                        <Link href={`/transactions/receipt?invoice=${tx.invoiceNumber}`} className="text-blue-600 font-medium hover:underline">
                          {tx.invoiceNumber}
                        </Link>
                        {' '}&middot; {tx.weight} Kg &middot; {tx.serviceType}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
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
                  {index < filteredTransactions.length - 1 && (
                    <hr className="border-slate-100 mt-6" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
