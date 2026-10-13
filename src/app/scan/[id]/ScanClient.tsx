'use client';

import { useTransition } from 'react';
import { LaundryStatus } from '@prisma/client';
import { updateTransactionStatus } from '@/actions/transaction';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, MessageCircle } from 'lucide-react';
import { generatePickupMessage, createWhatsAppUrl } from '@/lib/whatsappTemplate';

export interface ScanClientProps {
  transactionId?: string;
  currentStatus?: LaundryStatus;
  serviceType?: string;
  customerName?: string;
  customerPhone?: string;
  invoiceNumber?: string;
  weight?: number;
  totalPrice?: number;
  paymentStatus?: string;
  transaction?: {
    id: string;
    invoiceNumber: string;
    status: LaundryStatus;
    serviceType: string;
    weight?: number;
    totalPrice?: number;
    paymentStatus?: string;
    customer: {
      name: string;
      phone: string;
    };
  };
}

export default function ScanClient({
  transactionId: propTransactionId,
  currentStatus: propCurrentStatus,
  serviceType: propServiceType,
  customerName: propCustomerName,
  customerPhone: propCustomerPhone,
  invoiceNumber: propInvoiceNumber,
  transaction,
}: ScanClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const id = transaction?.id || propTransactionId || '';
  const status = transaction?.status || propCurrentStatus || ('ANTREAN' as LaundryStatus);
  const service = transaction?.serviceType || propServiceType || '';
  const custName = transaction?.customer?.name || propCustomerName || 'Pelanggan';
  const custPhone = transaction?.customer?.phone || propCustomerPhone || '';
  const invoice = transaction?.invoiceNumber || propInvoiceNumber || '';

  const getNextStatusInfo = (status: LaundryStatus) => {
    let nextStatus: LaundryStatus | null = null;
    let actionText = '';
    
    const typeLower = service.toLowerCase();
    const isSetrikaSaja = typeLower.includes('setrika saja') || typeLower.includes('hanya setrika');
    const isLipat = typeLower.includes('lipat');

    if (isSetrikaSaja && status === 'ANTREAN') {
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
          if (isLipat) {
            actionText = 'Lanjut Lipat';
          } else {
            actionText = 'Lanjut Setrika';
          }
          break;
        case 'DISETRIKA': 
          nextStatus = 'SIAP_DIAMBIL';
          actionText = 'Siap Diambil';
          break;
        case 'SIAP_DIAMBIL': 
          nextStatus = 'SELESAI';
          actionText = 'Serahkan & Selesaikan';
          break;
        default:
          nextStatus = null;
          actionText = '';
          break;
      }
    }
    
    return { nextStatus, actionText };
  };

  const { nextStatus, actionText } = getNextStatusInfo(status);

  // Helper untuk tampilan status user-friendly
  const getDisplayStatus = (status: LaundryStatus) => {
    switch (status) {
      case 'ANTREAN': return 'Menunggu Antrean';
      case 'DICUCI': return 'Sedang Dicuci';
      case 'DISETRIKA': return service.toLowerCase().includes('lipat') ? 'Sedang Dilipat' : 'Sedang Disetrika';
      case 'SIAP_DIAMBIL': return 'Siap Diambil';
      case 'SELESAI': return 'Selesai';
      default: return status;
    }
  };

  const handleUpdate = () => {
    if (!nextStatus || !id) return;
    startTransition(async () => {
      try {
        await updateTransactionStatus(id, nextStatus);
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
          {getDisplayStatus(status)}
        </span>
      </div>

      {/* Tombol Aksi Utama Update Status */}
      {nextStatus ? (
        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-1.5 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 text-base tracking-wide"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            </span>
          ) : (
            <>
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      ) : (
        <div className="w-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold py-4 rounded-2xl flex justify-center items-center text-sm">
          Pesanan Telah Selesai
        </div>
      )}

      {/* Tombol Cadangan Manual WhatsApp - HANYA jika status SIAP_DIAMBIL (gaya sekunder transparan + border hijau) */}
      {status === 'SIAP_DIAMBIL' && custPhone && (
        <a
          href={createWhatsAppUrl(custPhone, generatePickupMessage(custName, invoice))}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-transparent hover:bg-emerald-50 text-emerald-600 border border-emerald-500 font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm tracking-wide"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span>Kirim Notifikasi WhatsApp (Manual)</span>
        </a>
      )}
    </div>
  );
}
