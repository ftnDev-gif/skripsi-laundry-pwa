'use client';

import { useTransition } from 'react';
import { LaundryStatus } from '@prisma/client';
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
      className="text-[10px] font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
    >
      {isPending ? (
        <span className="flex items-center space-x-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Memproses...</span>
        </span>
      ) : (
        actionText
      )}
    </button>
  );
}
