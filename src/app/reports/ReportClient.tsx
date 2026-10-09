'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  ChevronDown, 
  DollarSign, 
  Filter, 
  Check, 
  Receipt, 
  Printer,
  HandCoins,
  MessageCircle
} from 'lucide-react';
import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';

type TimeFilter = 'Hari Ini' | 'Minggu Ini' | 'Bulan Ini';

export default function ReportClient({ transactions }: { transactions: any[] }) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Bulan Ini');
  const [isKasbonOnly, setIsKasbonOnly] = useState<boolean>(false);

  // Filter Tanggal Dinamis
  const filteredTransactions = transactions.filter((t) => {
    const tDate = new Date(t.createdAt);
    const now = new Date();
    
    if (timeFilter === 'Hari Ini') {
      return tDate.getDate() === now.getDate() &&
             tDate.getMonth() === now.getMonth() &&
             tDate.getFullYear() === now.getFullYear();
    } else if (timeFilter === 'Minggu Ini') {
      const day = now.getDay(); 
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return tDate >= startOfWeek && tDate <= endOfWeek;
    } else if (timeFilter === 'Bulan Ini') {
      return tDate.getMonth() === now.getMonth() &&
             tDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Kalkulasi Metrik (Omzet, Kasbon, Kg) Dinamis
  let totalPendapatan = 0;
  let totalKasbon = 0;
  let totalBebanKg = 0;
  const kasbonCustomerIds = new Set<string>();

  filteredTransactions.forEach(t => {
    if (t.paymentStatus === 'LUNAS') {
      totalPendapatan += t.totalPrice;
      totalBebanKg += t.weight;
    } else if (t.paymentStatus === 'KASBON') {
      totalKasbon += t.totalPrice;
      kasbonCustomerIds.add(t.customerId);
    }
  });

  const jumlahPelangganKasbon = kasbonCustomerIds.size;

  // List transaksi (apply kasbon filter)
  const displayedTransactions = isKasbonOnly 
    ? filteredTransactions.filter(t => t.paymentStatus === 'KASBON') 
    : filteredTransactions;

  // Teks indikator bulan dinamis
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleDateString('id-ID', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  // Teks indikator tanggal dinamis (Mengikuti Tab Filter yang diklik)
  const getDateIndicatorText = () => {
    const now = new Date();
    
    if (timeFilter === 'Hari Ini') {
      return now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); // Misal: "9 Oktober 2026"
    } 
    else if (timeFilter === 'Minggu Ini') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      const startStr = startOfWeek.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const endStr = endOfWeek.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${startStr} - ${endStr}`; // Misal: "5 Okt - 11 Okt 2026"
    } 
    else {
      // Bulan Ini
      return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }); // Misal: "Oktober 2026"
    }
  };

  const dateIndicatorText = getDateIndicatorText();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4 print:p-0 print:bg-white">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6 print:border-none print:shadow-none print:p-0">
        
        {/* Top Header */}
        <div className="flex items-center justify-between print:hidden">
          <HeaderBrand layout="row" subtitle="KASIR" />
          <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shrink-0">
            LAPORAN
          </div>
        </div>

        {/* Title Section */}
        <div className="flex gap-4 items-center">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm print:hidden"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5 print:text-slate-600">LAPORAN KEUANGAN</p>
            <h2 className="text-2xl font-bold text-slate-900">Rekap & Kasbon</h2>
          </div>
        </div>

        {/* Filter Tab */}
        <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100 print:hidden">
          {(['Hari Ini', 'Minggu Ini', 'Bulan Ini'] as TimeFilter[]).map(filter => (
            <button 
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 py-2 text-sm rounded-xl transition-colors ${
                timeFilter === filter 
                  ? 'font-semibold bg-blue-600 text-white shadow-sm' 
                  : 'font-medium text-slate-500 hover:text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Date / Month Picker */}
        <div className="flex items-center justify-between text-slate-700 font-medium print:text-slate-900 print:border-b print:border-slate-200 print:pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 print:text-slate-600" />
            <span>{dateIndicatorText}</span>
          </div>
        </div>

        {/* Financial Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Omzet Bersih */}
          <div className="bg-blue-600 rounded-[1.5rem] p-4 flex flex-col justify-between text-white shadow-sm h-36 print:bg-slate-50 print:text-slate-900 print:border print:border-slate-200 print:shadow-none">
            <div className="flex justify-between items-start">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center print:bg-blue-100 print:text-blue-600">
                <DollarSign className="h-4 w-4 text-white print:text-blue-600" />
              </div>
              <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider print:text-slate-500">Pendapatan</span>
            </div>
            <div>
              <div className="text-xl font-bold mb-1">
                Rp {new Intl.NumberFormat('id-ID').format(totalPendapatan)}
              </div>
              <div className="text-xs text-blue-100 print:text-slate-500">{totalBebanKg} Kg selesai</div>
            </div>
          </div>

          {/* Piutang Kasbon */}
          <div className="bg-white rounded-[1.5rem] p-4 flex flex-col justify-between shadow-sm border border-amber-200 h-36 relative overflow-hidden print:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[4rem] -z-10 print:hidden"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <HandCoins className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Kasbon</span>
            </div>
            <div className="relative z-10">
              <div className="text-xl font-bold text-slate-900 mb-1">
                Rp {new Intl.NumberFormat('id-ID').format(totalKasbon)}
              </div>
              <div className="text-xs text-slate-500">{jumlahPelangganKasbon} Pelanggan</div>
            </div>
          </div>
        </div>

        {/* Transaksi Belum Lunas */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1 print:text-slate-500">
                AKTIVITAS KEUANGAN
              </h3>
              <h2 className="text-lg font-bold text-slate-900 leading-none">
                Daftar Transaksi
              </h2>
            </div>
            <button 
              onClick={() => setIsKasbonOnly(!isKasbonOnly)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shadow-sm transition-colors print:hidden ${
                isKasbonOnly 
                  ? 'bg-amber-50 border-amber-200 text-amber-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Kasbon
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {displayedTransactions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">Belum ada transaksi.</div>
            ) : (
              displayedTransactions.map((t) => {
                const isLunas = t.paymentStatus === 'LUNAS';
                
                const dateStr = new Date(t.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });

                // Helper WA Link
                let waHref = '#';
                if (!isLunas && t.customer?.phone) {
                  let cleaned = t.customer.phone.replace(/\D/g, '');
                  if (cleaned.startsWith('08')) {
                    cleaned = '628' + cleaned.slice(2);
                  }
                  const totalFormatted = new Intl.NumberFormat('id-ID').format(t.totalPrice);
                  const msg = `Halo Kak ${t.customer.name}, kami dari Sayangan Laundry ingin menginfokan bahwa pesanan dengan nota ${t.invoiceNumber} (${t.weight} Kg ${t.serviceType}) memiliki tagihan kasbon sebesar Rp ${totalFormatted}. Pembayaran dapat dilakukan saat pengambilan pakaian atau via transfer. Terima kasih!`;
                  waHref = `https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`;
                }

                return (
                  <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-3 print:shadow-none print:border-b print:border-slate-200 print:rounded-none print:p-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 print:hidden ${isLunas ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {isLunas ? <Check className="h-5 w-5" /> : <Receipt className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">{t.customer?.name || 'Pelanggan'}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{dateStr}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{t.invoiceNumber} · {t.weight} Kg {t.serviceType}</p>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md print:bg-transparent print:border print:px-1 ${isLunas ? 'bg-emerald-50 text-emerald-700 print:text-emerald-700 print:border-emerald-200' : 'bg-amber-50 text-amber-700 print:text-amber-700 print:border-amber-200'}`}>
                          {isLunas ? 'Lunas' : 'Kasbon (Belum Lunas)'}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          Rp {new Intl.NumberFormat('id-ID').format(t.totalPrice)}
                        </span>
                      </div>

                      {!isLunas && t.customer?.phone && (
                        <div className="flex justify-start print:hidden">
                          <a 
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Ingatkan via WA
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pb-2 print:hidden">
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 mb-6"
          >
            <Printer className="h-5 w-5" />
            Cetak Rekapan {timeFilter === 'Hari Ini' ? 'Harian' : timeFilter === 'Minggu Ini' ? 'Mingguan' : 'Bulanan'}
          </button>
          
          <FooterBrand />
        </div>

      </div>
    </div>
  );
}
