import React from 'react';
import { Clock, Droplets, Shirt, CheckCircle, Sparkles, Check } from 'lucide-react';
import { LaundryStatus } from '@prisma/client';

interface TrackingStepperProps {
  serviceType: string;
  status: LaundryStatus;
}

export const getStepsForService = (serviceType: string) => {
  const typeLower = serviceType.toLowerCase();
  
  if (typeLower.includes('setrika saja') || typeLower.includes('hanya setrika')) {
    return [
      { id: LaundryStatus.ANTREAN, title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
      { id: LaundryStatus.DISETRIKA, title: 'Disetrika', subtitle: 'Sedang disetrika', activeIcon: Shirt },
      { id: LaundryStatus.SIAP_DIAMBIL, title: 'Siap Diambil', subtitle: 'Menunggu diambil', activeIcon: CheckCircle },
      { id: LaundryStatus.SELESAI, title: 'Selesai', subtitle: 'Sudah diambil', activeIcon: Sparkles },
    ];
  }
  
  if (typeLower.includes('lipat') || typeLower.includes('kering')) {
    return [
      { id: LaundryStatus.ANTREAN, title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
      { id: LaundryStatus.DICUCI, title: 'Dicuci', subtitle: 'Proses cuci', activeIcon: Droplets },
      { id: LaundryStatus.DISETRIKA, title: 'Dilipat', subtitle: 'Sedang dilipat', activeIcon: Shirt },
      { id: LaundryStatus.SIAP_DIAMBIL, title: 'Siap Diambil', subtitle: 'Menunggu diambil', activeIcon: CheckCircle },
      { id: LaundryStatus.SELESAI, title: 'Selesai', subtitle: 'Sudah diambil', activeIcon: Sparkles },
    ];
  }
  
  return [
    { id: LaundryStatus.ANTREAN, title: 'Antrean', subtitle: 'Pesanan diterima', activeIcon: Clock },
    { id: LaundryStatus.DICUCI, title: 'Dicuci', subtitle: 'Proses cuci', activeIcon: Droplets },
    { id: LaundryStatus.DISETRIKA, title: 'Disetrika', subtitle: 'Sedang disetrika', activeIcon: Shirt },
    { id: LaundryStatus.SIAP_DIAMBIL, title: 'Siap Diambil', subtitle: 'Menunggu diambil', activeIcon: CheckCircle },
    { id: LaundryStatus.SELESAI, title: 'Selesai', subtitle: 'Sudah diambil', activeIcon: Sparkles },
  ];
};

export default function TrackingStepper({ serviceType, status }: TrackingStepperProps) {
  const steps = getStepsForService(serviceType);
  let currentStep = steps.findIndex(s => s.id === status);
  
  if (currentStep === -1) {
    if (status === LaundryStatus.DICUCI) currentStep = 0;
    else if (status === LaundryStatus.DISETRIKA) currentStep = 1; 
    else currentStep = 0;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
          Tahapan Cucian
        </p>
        <div className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          Tahap {currentStep + 1} dari {steps.length}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
        <div className="relative pt-2 pb-1 overflow-x-auto hide-scrollbar">
          <div className="min-w-[300px] relative">
            {/* Garis background horizontal */}
            <div 
              className="absolute top-[24px] h-0.5 bg-slate-200"
              style={{ 
                left: `calc(50% / ${steps.length})`, 
                right: `calc(50% / ${steps.length})` 
              }}
            >
              {/* Garis aktif biru */}
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isFuture = index > currentStep;
                const ActiveIcon = step.activeIcon;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="h-8 flex items-center justify-center relative z-10 bg-white px-1">
                      {isCompleted && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm z-20">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                      {isActive && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-20">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                            <ActiveIcon size={14} />
                          </div>
                        </div>
                      )}
                      {isFuture && (
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center z-20">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        </div>
                      )}
                    </div>

                    <div className="text-center mt-2.5">
                      <p className={`text-[10px] sm:text-[11px] font-bold mb-0.5 ${isCompleted || isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-[8px] sm:text-[9px] font-medium text-slate-400 leading-tight px-1 hidden sm:block">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
