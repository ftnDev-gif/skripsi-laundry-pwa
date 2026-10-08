"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import HeaderBrand from '@/components/HeaderBrand';
import { ArrowLeft, CheckCircle2, AlertCircle, ScanLine } from 'lucide-react';
import Link from 'next/link';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScanPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [hasError, setHasError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);
  
  // Gunakan ref untuk melacak apakah scanner sedang pause/berhenti secara internal
  const isScanningRef = useRef<boolean>(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Inisialisasi scanner
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const onScanSuccess = (decodedText: string) => {
      // Jika sedang dipause, abaikan scan
      if (!isScanningRef.current) return;
      
      // Matikan pembacaan frame untuk sementara
      isScanningRef.current = false;
      setScanResult(decodedText);
      setHasError(null);

      // Mainkan suara beep singkat jika browser mendukung (opsional)
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."); // dummy or remove
        // kita abaikan audio file sebenarnya karena tidak wajib, cukup UI feedback
      } catch (e) {}

      // Ekstrak ID Invoice dari URL (contoh: https://sayangan-laundry.com/tracking/INV-202610-005)
      // atau jika yang terbaca langsung berupa INV-XXX-XXX
      const invoiceRegex = /INV-\d{6}-\d{3,}/;
      const match = decodedText.match(invoiceRegex);
      
      const invoiceId = match ? match[0] : null;

      if (invoiceId) {
        // Berhasil, redirect ke tracking
        setTimeout(() => {
          if (scannerRef.current && scannerRef.current.isScanning) {
             scannerRef.current.stop().then(() => router.push(`/scan/${invoiceId}`)).catch(() => router.push(`/scan/${invoiceId}`));
          } else {
             router.push(`/scan/${invoiceId}`);
          }
        }, 1500);
      } else {
        // Format tidak valid
        setHasError('Format QR Code tidak dikenali');
        // Lanjutkan scanning setelah 3 detik
        setTimeout(() => {
          setHasError(null);
          setScanResult(null);
          isScanningRef.current = true;
        }, 3000);
      }
    };

    const onScanFailure = () => {
      // Abaikan error per frame
    };

    html5QrCode.start(
      { facingMode: "environment" }, 
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      onScanSuccess,
      onScanFailure
    ).catch(() => {
      setPermissionError(true);
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6 relative">
        
        {/* Header Area */}
        <header className="flex items-center justify-between">
          <HeaderBrand subtitle="KASIR" layout="row" />
          <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
            SCAN
          </span>
        </header>

        <main className="flex-1 flex flex-col items-center mt-2">
          <div className="flex items-center gap-4 w-full mb-6">
            <Link href="/dashboard" className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">Arahkan kamera ke QR Code di nota</p>
              <h2 className="text-2xl font-bold text-slate-900">Pindai QR Code</h2>
            </div>
          </div>

          <div className="w-full rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-100 relative shadow-inner aspect-square flex items-center justify-center">
            
            {permissionError ? (
              <div className="text-center p-6 text-slate-400">
                <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-400" />
                <p>Akses kamera ditolak atau kamera tidak ditemukan.</p>
                <p className="text-xs mt-2">Izinkan akses kamera di pengaturan browser Anda.</p>
              </div>
            ) : (
              <>
                <div id="reader" className="w-full h-full object-cover"></div>
                
                {/* Viewfinder frame */}
                {!scanResult && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                      {/* Corner marks */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>
                      {/* Scanning laser line animation */}
                      <div className="w-full h-0.5 bg-blue-500/80 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)] absolute top-1/2 left-0 animate-[ping-pong_2s_ease-in-out_infinite]" style={{
                        animation: "scan 2s infinite linear"
                      }}></div>
                    </div>
                  </div>
                )}
                
                {/* Overlay Success */}
                {scanResult && !hasError && (
                  <div className="absolute inset-0 bg-emerald-600/95 z-20 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="h-16 w-16 mb-4 text-emerald-100" />
                    <h3 className="text-2xl font-bold mb-2">Berhasil!</h3>
                    <p className="text-sm text-emerald-100 max-w-full">
                      Mengalihkan ke detail transaksi...
                    </p>
                  </div>
                )}
                
                {/* Overlay Error */}
                {hasError && (
                  <div className="absolute inset-0 bg-red-600/95 z-20 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in zoom-in duration-300">
                    <AlertCircle className="h-16 w-16 mb-4 text-red-100" />
                    <h3 className="text-xl font-bold mb-2">Gagal Dipindai</h3>
                    <p className="text-sm text-red-100">
                      {hasError}
                    </p>
                    <p className="text-xs text-red-200 mt-4">Memindai ulang dalam 3 detik...</p>
                  </div>
                )}
              </>
            )}

          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
             <ScanLine className="h-4 w-4" />
             <span>Menunggu QR Code...</span>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
        /* Hide html5-qrcode extra elements */
        #reader img { display: none !important; }
        #reader { border: none !important; }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 1.5rem !important;
        }
      `}} />
    </div>
  );
}
