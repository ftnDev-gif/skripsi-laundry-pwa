'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import HeaderBrand from '@/components/HeaderBrand';
import FooterBrand from '@/components/FooterBrand';
import { loginKasir } from '@/actions/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginKasir(formData);

    if (result?.success) {
      router.push('/dashboard');
      router.refresh(); // Refresh route to apply new layout logic if needed
    } else {
      setError(result?.message || 'Terjadi kesalahan saat login.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col p-6 sm:p-8">
        {/* Header Branding */}
        <HeaderBrand subtitle="Masuk ke Sistem Pengelola Laundry Kiloan" />

        {/* Main Form */}
        <div className="mt-8">
          <form className="space-y-5" onSubmit={handleLogin}>
            
            {error && (
              <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Email / Username Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username / Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="kasir@sayangan.com" 
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  required
                  placeholder="••••••••" 
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-3 pt-1">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  id="remember" 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 transition-all" 
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </span>
              </div>
              <label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                Ingat Saya
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-2xl bg-blue-600 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center flex flex-col items-center">
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Akses terbatas khusus untuk kasir & pengelola<br />
            Sayangan Laundry. Tidak menerima registrasi publik.
          </p>
          <FooterBrand />
        </div>

      </div>
    </div>
  );
}

