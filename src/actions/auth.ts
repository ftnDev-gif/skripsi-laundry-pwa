'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Gunakan environment variables, atau default kredensial (disarankan untuk development)
const KASIR_USERNAME = process.env.KASIR_USERNAME || 'kasir';
const KASIR_PASSWORD = process.env.KASIR_PASSWORD || 'sayangan123';

export async function loginKasir(formData: FormData) {
  const username = (formData.get('username') as string)?.trim() || '';
  const password = (formData.get('password') as string) || '';
  const rememberMe = formData.get('rememberMe');

  let isAuthenticated = false;

  if (
    (username === KASIR_USERNAME || username === 'kasir@sayangan.com') &&
    password === KASIR_PASSWORD
  ) {
    isAuthenticated = true;
  } else {
    try {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: username }, { name: username }],
        },
      });
      if (dbUser && dbUser.password === password) {
        isAuthenticated = true;
      }
    } catch {
      // Fallback ke kredensial env jika koneksi DB bermasalah saat autentikasi
    }
  }

  if (isAuthenticated) {
    const cookieStore = await cookies();
    cookieStore.set('kasir_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe === 'on' ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1, // 30 hari atau 1 hari
      path: '/',
    });
    return { success: true };
  }

  return { success: false, message: 'Username atau kata sandi salah' };
}

export async function logoutKasir() {
  const cookieStore = await cookies();
  cookieStore.delete('kasir_session');
  redirect('/login');
}
