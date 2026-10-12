import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware Next.js untuk memproteksi rute admin panel DPM FPP.
 * 
 * Strategi:
 * - Rute publik (/portal/*, /login, /api/public/*) bebas diakses.
 * - Rute admin (/(admin)/*) membutuhkan cookie 'dpm_session' yang valid.
 * - Karena autentikasi menggunakan localStorage (client-side), middleware ini
 *   memeriksa cookie 'dpm_session' yang di-set oleh halaman login setelah
 *   berhasil memilih role.
 * - Jika tidak ada cookie → redirect ke /login.
 */

// Daftar path yang TIDAK perlu autentikasi
const PUBLIC_PATHS = [
  '/login',
  '/portal',
  '/api/public',
  '/api/test-connections',
  '/_next',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan semua path publik
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath || pathname === '/') {
    return NextResponse.next();
  }

  // Proteksi rute admin: cek cookie sesi
  const isAdminPath =
    pathname.startsWith('/ketua') ||
    pathname.startsWith('/sekretaris') ||
    pathname.startsWith('/keuangan') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/dashboard');

  if (isAdminPath) {
    const sessionCookie = request.cookies.get('dpm_session');

    if (!sessionCookie || !sessionCookie.value) {
      // Tidak ada sesi → redirect ke halaman login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validasi nilai cookie (pastikan bisa di-parse sebagai JSON valid)
    try {
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (!sessionData.role || !sessionData.nama) {
        throw new Error('Session invalid');
      }

      // RBAC: Periksa apakah role sesuai untuk halaman yang diakses
      const roleAccessMap: Record<string, string[]> = {
        '/ketua': ['super_admin', 'ketua'],
        '/sekretaris': ['super_admin', 'ketua', 'sekretaris'],
        '/keuangan': ['super_admin', 'ketua', 'keuangan'],
        '/monitoring': ['super_admin', 'ketua', 'monitoring'],
        '/dashboard': ['super_admin'],
      };

      const requiredRoles = Object.entries(roleAccessMap).find(([path]) =>
        pathname.startsWith(path)
      )?.[1];

      if (requiredRoles && !requiredRoles.includes(sessionData.role)) {
        // Role tidak memiliki akses → redirect ke login dengan pesan
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // Cookie tidak valid → hapus dan redirect ke login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('dpm_session');
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * Konfigurasi matcher untuk menentukan rute mana yang dilewati middleware.
 * Exclude asset statis dan file Next.js internal.
 */
export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua path KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico
     * - File gambar dan font
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
