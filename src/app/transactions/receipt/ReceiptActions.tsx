'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, MessageCircle, ArrowLeft } from 'lucide-react';
import { generateReceiptMessage, createWhatsAppUrl } from '@/lib/whatsappTemplate';

type Props = {
  invoiceNumber: string;
  customerName: string;
  totalPrice: number;
  trackingUrl: string;
  customerPhone: string;
  serviceType?: string;
  weight?: number;
  paymentStatus?: string;
};

export default function ReceiptActions({ 
  invoiceNumber, 
  customerName, 
  totalPrice, 
  trackingUrl, 
  customerPhone,
  serviceType = 'Cuci & Setrika',
  weight = 0,
  paymentStatus,
}: Props) {
  const handlePrint = () => {
    window.print();
  };

  const waMessage = generateReceiptMessage({
    customerName,
    invoiceNumber,
    serviceType,
    weight,
    totalPrice,
    trackingUrl,
    paymentStatus,
  });
  const waLink = createWhatsAppUrl(customerPhone, waMessage);

  return (
    <div className="space-y-3 print:hidden">
      <button 
        onClick={handlePrint}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
      >
        <Printer className="w-5 h-5 mr-2" />
        Cetak Nota
      </button>
      
      <a 
        href={waLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-white hover:bg-slate-50 text-emerald-600 border border-slate-200 font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Kirim Notifikasi WhatsApp
      </a>

      <Link 
        href="/dashboard"
        className="w-full text-slate-500 hover:text-slate-700 font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
