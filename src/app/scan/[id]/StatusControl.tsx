'use client';

import { useTransition } from 'react';
import { LaundryStatus } from '@prisma/client';
import { updateTransactionStatus } from '@/actions/transaction';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';

interface StatusControlProps {
  transactionId: string;
  currentStatus: LaundryStatus;
  serviceType: string;
}

export default function StatusControl({ transactionId, currentStatus, serviceType }: StatusControlProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getNextStatusInfo = (status: LaundryStatus) => {
    let nextStatus: LaundryStatus | null = null;
    let actionText = '';
    
    if (serviceType.includes('Setrika Saja') && status === 'ANTREAN') {
      nextStatus = 'DISETRIKA';
      actionText = 'Mulai Setrika';
    } else {
      switch (status) {
        case 'ANTREAN': 
          nextStatus = 'DICUCI';
          actionText = 'Mulai Cuci';
          break;
        case 'DICUCI': 
          nextStatus = 'DISETRIKA';
          actionText = 'Lanjut Setrika';
          break;
        case 'DISETRIKA': 
          nextStatus = 'SIAP_DIAMBIL';
          actionText = serviceType.includes('Lipat') ? 'Selesai Dilipat' : 'Tandai Selesai';
          break;
        case 'SIAP_DIAMBIL': 
          nextStatus = 'SELESAI';
          actionText = 'Serahkan & Selesaikan';
          break;
      }
    }
    
    return { nextStatus, actionText };
  };

  const { nextStatus, actionText } = getNextStatusInfo(currentStatus);

  // Helper untuk tampilan status user-friendly
  const getDisplayStatus = (status: LaundryStatus) => {
    switch (status) {
      case 'ANTREAN': return 'Menunggu Antrean';
      case 'DICUCI': return 'Sedang Dicuci';
      case 'DISETRIKA': return serviceType.includes('Lipat') ? 'Sedang Dilipat' : 'Sedang Disetrika';
      case 'SIAP_DIAMBIL': return 'Siap Diambil';
      case 'SELESAI': return 'Selesai';
      default: return status;
    }
  };

  const handleUpdate = () => {
    if (!nextStatus) return;
    startTransition(async () => {
      try {
        await updateTransactionStatus(transactionId, nextStatus);
        router.refresh();
      } catch (error) {
        alert('Gagal update status');
      }
    });
  };

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500 font-medium">Status Saat Ini</span>
        <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs shadow-inner">
          {getDisplayStatus(currentStatus)}
        </span>
      </div>
      
      {nextStatus ? (
        <button
            onClick={handleUpdate}
            disabled={isPending}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 mt-2"
          >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {actionText}
              <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
            </>
          )}
        </button>
      ) : (
        <div className="w-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold py-4 rounded-2xl flex justify-center items-center text-sm mt-2">
          Pesanan Telah Selesai
        </div>
      )}
    </div>
  );
}

