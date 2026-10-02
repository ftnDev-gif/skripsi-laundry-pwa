import { Droplets } from 'lucide-react';

interface HeaderBrandProps {
  subtitle?: string;
  layout?: 'centered' | 'row';
}

export default function HeaderBrand({ subtitle, layout = 'centered' }: HeaderBrandProps) {
  if (layout === 'row') {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
          <Droplets className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          {subtitle && (
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {subtitle}
            </span>
          )}
          <h1 className="text-base font-bold text-slate-900 leading-tight">
            Sayangan Laundry
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-5">
      {/* Wadah Logo (Squircle) */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
        <Droplets className="h-8 w-8 text-white" />
      </div>
      
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sayangan Laundry
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
