'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Droplets, QrCode, ChevronDown, Loader2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { createTransaction, getCustomers, updateCustomerPhone } from '@/actions/transaction';
import HeaderBrand from '@/components/HeaderBrand';

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
};

export default function NewTransactionPage() {
  const [weight, setWeight] = useState<number | ''>('');
  const [serviceId, setServiceId] = useState('cuci_setrika');
  const [paymentStatus, setPaymentStatus] = useState('lunas');
  
  // Customer Selection State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('new');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Edit Phone State
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhoneValue, setEditPhoneValue] = useState('');
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [editPhoneError, setEditPhoneError] = useState('');

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const router = useRouter();

  // Load customers
  useEffect(() => {
    getCustomers().then(setCustomers).catch(console.error);
  }, []);

  // Dummy data untuk layanan
  const services = [
    { id: 'cuci_setrika', name: 'Cuci & Setrika (Komplit)', price: 6000 },
    { id: 'cuci_lipat', name: 'Cuci Lipat (Cuci Saja)', price: 4000 },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 3000 },
  ];

  const selectedService = services.find(s => s.id === serviceId);
  const pricePerKg = selectedService?.price || 0;
  const total = (Number(weight) || 0) * pricePerKg;

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCustomerId(val);
    setIsEditingPhone(false);
    if (val !== 'new') {
      const c = customers.find(c => c.id === val);
      if (c) {
        setCustomerName(c.name);
        setCustomerPhone(c.phone);
        setCustomerAddress(c.address || '');
      }
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setWeightError(false);
    setNameError(false);
    setPhoneError(false);
    
    let hasError = false;

    if (!weight || weight <= 0) {
      setWeightError(true);
      hasError = true;
    }
    
    if (selectedCustomerId === 'new') {
      if (!customerName) {
        setNameError(true);
        hasError = true;
      }
      if (!customerPhone) {
        setPhoneError(true);
        hasError = true;
      }
    }

    if (hasError) return;

    const formData = new FormData();
    if (selectedCustomerId !== 'new') {
      formData.append('customerId', selectedCustomerId);
    } else {
      formData.append('customerName', customerName);
      // Prepend +62 or 62 if not present implicitly based on UI, but we'll just store whatever is typed + 62 prefix since UI has +62 hardcoded.
      formData.append('customerPhone', '62' + customerPhone.replace(/^0+/, '').replace(/\D/g, ''));
      if (customerAddress) {
        formData.append('customerAddress', customerAddress);
      }
    }
    
    formData.append('weight', weight.toString());
    formData.append('serviceId', serviceId);
    formData.append('paymentStatus', paymentStatus.toUpperCase());
    
    startTransition(async () => {
      try {
        await createTransaction(formData);
      } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan transaksi');
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <HeaderBrand layout="row" subtitle="KASIR" />
          <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shrink-0">
            TRANSAKSI
          </div>
        </div>

        {/* Title Section */}
        <div className="flex gap-4 items-center">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">Data pelanggan dan cucian</p>
            <h2 className="text-2xl font-bold text-slate-900">Form Transaksi Baru</h2>
          </div>
        </div>

        {/* Main Form */}
        <div className="mt-2">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Pilih Pelanggan */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-slate-800">Pilih Pelanggan</label>
              <div className="relative">
                <select 
                  value={selectedCustomerId}
                  onChange={handleCustomerSelect}
                  className="appearance-none w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                >
                  <option value="new">+ Tambah Pelanggan Baru</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {selectedCustomerId === 'new' ? (
              <>
                {/* Nama Pelanggan */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Nama Pelanggan Baru</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setNameError(false);
                    }}
                    placeholder="Contoh: Budi Santoso" 
                    className={`w-full rounded-xl border bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'}`}
                  />
                  {nameError && <p className="text-xs text-red-500 mt-1">Nama pelanggan wajib diisi</p>}
                </div>

                {/* Nomor WhatsApp */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Nomor WhatsApp</label>
                  <div className="flex">
                    <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                      +62
                    </div>
                    <input 
                      type="tel" 
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setPhoneError(false);
                      }}
                      placeholder="812 3456 7890" 
                      className={`w-full rounded-r-xl border bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'}`}
                    />
                  </div>
                  {phoneError && <p className="text-xs text-red-500 mt-1">Nomor WhatsApp wajib diisi</p>}
                </div>

                {/* Alamat (Opsional) */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Alamat <span className="text-slate-400 font-normal">(Opsional)</span></label>
                  <textarea 
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Contoh: Jl. Sudirman No. 12" 
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                  />
                </div>
              </>
            ) : selectedCustomerId !== '' ? (
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col space-y-2 relative">
                 <div className="flex justify-between items-start">
                   <div className="flex flex-col space-y-1">
                     <span className="text-sm font-semibold text-slate-900">{customerName}</span>
                     {!isEditingPhone && (
                       <span className="text-sm text-slate-500">{customerPhone}</span>
                     )}
                     {customerAddress && !isEditingPhone && (
                       <span className="text-xs text-slate-400 leading-snug line-clamp-2">{customerAddress}</span>
                     )}
                   </div>
                   {!isEditingPhone && (
                     <button
                       type="button"
                       onClick={() => {
                         setEditPhoneValue(customerPhone);
                         setEditPhoneError('');
                         setIsEditingPhone(true);
                       }}
                       className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                     >
                       <Pencil className="w-3 h-3" />
                       <span>Edit Nomor</span>
                     </button>
                   )}
                 </div>

                 {isEditingPhone && (
                   <div className="mt-2 flex flex-col space-y-2">
                     <div className="flex">
                       <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-slate-200 bg-white px-3 text-sm font-medium text-slate-600">
                         +62
                       </div>
                       <input 
                         type="tel"
                         value={editPhoneValue.replace(/^62/, '')}
                         onChange={(e) => setEditPhoneValue(e.target.value)}
                         className="w-full rounded-r-xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                         autoFocus
                       />
                     </div>
                     {editPhoneError && <span className="text-xs text-red-500">{editPhoneError}</span>}
                     <div className="flex justify-end space-x-2 pt-1">
                       <button
                         type="button"
                         onClick={() => setIsEditingPhone(false)}
                         disabled={isUpdatingPhone}
                         className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                       >
                         Batal
                       </button>
                       <button
                         type="button"
                         disabled={isUpdatingPhone}
                         onClick={async () => {
                           setIsUpdatingPhone(true);
                           setEditPhoneError('');
                           try {
                             const updated = await updateCustomerPhone(selectedCustomerId, editPhoneValue);
                             setCustomerPhone(updated.phone);
                             setCustomers(customers.map(c => c.id === selectedCustomerId ? { ...c, phone: updated.phone } : c));
                             setIsEditingPhone(false);
                           } catch (err: any) {
                             setEditPhoneError(err.message || 'Gagal menyimpan');
                           } finally {
                             setIsUpdatingPhone(false);
                           }
                         }}
                         className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                       >
                         {isUpdatingPhone ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                         Simpan
                       </button>
                     </div>
                   </div>
                 )}
              </div>
            ) : null}
            {/* Grid Berat & Layanan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Berat <span className="text-slate-400 font-normal">(Kg)</span>
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0" 
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value ? Number(e.target.value) : '');
                      setWeightError(false);
                    }}
                    className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full rounded-xl border bg-white py-3 pl-4 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${weightError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600'}`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 pointer-events-none">
                    kg
                  </span>
                </div>
                {weightError && <p className="text-xs text-red-500 mt-1">Berat cucian harus lebih dari 0 kg</p>}
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-800">Layanan</label>
                <div className="relative">
                  <select 
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="appearance-none w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Status Bayar */}
            <div className="flex flex-col space-y-2 pt-1">
              <label className="text-sm font-semibold text-slate-800">Status Bayar</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Lunas */}
                <label className={`relative flex cursor-pointer items-center rounded-xl border p-4 transition-all duration-200 ${paymentStatus === 'lunas' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="payment_status" 
                    value="lunas" 
                    className="peer sr-only" 
                    checked={paymentStatus === 'lunas'} 
                    onChange={() => setPaymentStatus('lunas')} 
                  />
                  <div className={`mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${paymentStatus === 'lunas' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                    {paymentStatus === 'lunas' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className={`text-sm font-medium ${paymentStatus === 'lunas' ? 'text-blue-700' : 'text-slate-600'}`}>
                    Lunas
                  </span>
                </label>
                
                {/* Belum Lunas (Kasbon) - Merujuk pada aturan oranye di DESIGN_SYSTEM.md */}
                <label className={`relative flex cursor-pointer items-center rounded-xl border p-4 transition-all duration-200 ${paymentStatus === 'kasbon' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="payment_status" 
                    value="kasbon" 
                    className="peer sr-only" 
                    checked={paymentStatus === 'kasbon'} 
                    onChange={() => setPaymentStatus('kasbon')} 
                  />
                  <div className={`mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${paymentStatus === 'kasbon' ? 'border-amber-500 bg-amber-500' : 'border-slate-300 bg-white'}`}>
                    {paymentStatus === 'kasbon' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className={`text-sm font-medium ${paymentStatus === 'kasbon' ? 'text-amber-700' : 'text-slate-600'}`}>
                    Belum Lunas
                  </span>
                </label>
              </div>
            </div>

            {/* Catatan Fisik */}
            <div className="flex flex-col space-y-2 pt-1">
              <label className="text-sm font-semibold text-slate-800">
                Catatan Fisik Pakaian <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea 
                rows={3}
                name="physicalNotes"
                placeholder="Contoh: Noda di bagian kerah, kancing lepas..." 
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
              />
            </div>

            {/* Area Kalkulasi Total Otomatis */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tagihan</span>
                <span className="text-sm font-medium text-slate-400 mt-0.5">
                  {weight ? `${weight} kg × Rp ${new Intl.NumberFormat('id-ID').format(pricePerKg)}` : 'Pilih berat & layanan'}
                </span>
              </div>
              <span className="text-2xl font-bold text-blue-600 tracking-tight">
                Rp {new Intl.NumberFormat('id-ID').format(total)}
              </span>
            </div>

            {errorMsg && <p className="text-sm text-red-500 font-medium text-center">{errorMsg}</p>}
            
            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isPending}
                className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
                <span>{isPending ? 'Menyimpan...' : '+ Simpan & Cetak QR Code'}</span>
              </button>
            </div>

          </form>
        </div>
        
        {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Pastikan data sudah benar sebelum disimpan.
          </p>
        </div>

      </div>
    </div>
  );
}
