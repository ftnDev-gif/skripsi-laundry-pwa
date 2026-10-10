import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('kasir_session');
  const path = request.nextUrl.pathname;

  const isPublicPath = path.startsWith('/tracking') || 
                       path.startsWith('/transactions/receipt') ||
                       path === '/login';

  // Biarkan aset statis lolos
  if (path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }

  // Handle Root Path
  if (path === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika mencoba akses rute terproteksi tanpa sesi
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login dan mencoba mengakses /login, arahkan ke dashboard
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Mengecualikan API, Next.js static, images, favicon dll
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-*|apple-icon|images/).*)',
  ],
};

