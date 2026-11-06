'use client';

import { useTransition } from 'react';
import { LaundryStatus } from '@/lib/orderMapper';
import { updateTransactionStatus } from '@/actions/transaction';
import { Loader2 } from 'lucide-react';

interface UpdateStatusButtonProps {
  transactionId: string;
  currentStatus: LaundryStatus;
  serviceType: string;
  actionText: string;
}

export default function UpdateStatusButton({ 
  transactionId, 
  currentStatus, 
  serviceType,
  actionText 
}: UpdateStatusButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Menentukan status selanjutnya berdasarkan status saat ini
  const getNextStatus = (status: LaundryStatus): LaundryStatus | null => {
    if (serviceType.includes('Setrika Saja') && status === 'ANTREAN') {
      return 'DISETRIKA';
    }

    switch (status) {
      case 'ANTREAN': return 'DICUCI';
      case 'DICUCI': return 'DISETRIKA';
      case 'DISETRIKA': return 'SIAP_DIAMBIL';
      case 'SIAP_DIAMBIL': return 'SELESAI';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(currentStatus);

  // Jika sudah Selesai atau tidak ada status berikutnya, jangan tampilkan tombol
  if (!nextStatus) return null;

  const handleUpdate = () => {
    startTransition(async () => {
      try {
        await updateTransactionStatus(transactionId, nextStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
        alert('Gagal memperbarui status');
      }
    });
  };

  return (
    <button 
      onClick={handleUpdate}
      disabled={isPending}
      className="border-2 border-blue-600 text-blue-600 font-semibold bg-white rounded-lg px-3.5 py-1.5 text-xs md:text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
    >
      {isPending ? (
        <span className="flex items-center space-x-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Memproses...</span>
        </span>
      ) : (
        actionText
      )}
    </button>
  );
}
