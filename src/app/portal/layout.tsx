'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Sparkles, 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Newspaper, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import PadmarajaLogo from '../../components/PadmarajaLogo';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'BERANDA', href: '/portal', icon: Home },
    { label: 'TENTANG KAMI', href: '/portal/tentang', icon: Users },
    { label: 'PROGRAM KERJA', href: '/portal/proker', icon: Calendar },
    { label: 'ASPIRASI', href: '/portal/aspirasi', icon: MessageSquare },
    { label: 'LPJ & TRANSPARANSI', href: '/portal/lpj', icon: FileText },
    { label: 'BERITA', href: '/portal/berita', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-5 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold transition-all"
      >
        Lewati ke konten utama (Skip to Content)
      </a>

      {/* Top Info Banner Ala Parlemen Padmaraja */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs py-2 px-4 text-center font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Selamat Datang di Portal Resmi Parlemen Padmaraja — DPM FPP Universitas 17 Agustus 1945 Banyuwangi Periode 2026/2027</span>
        <Link href="/portal/lacak-aspirasi" className="underline hover:text-amber-300 ml-1 hidden sm:inline font-extrabold text-amber-200">
          Lacak Aspirasi →
        </Link>
      </div>

      {/* Sleek Minimal Navbar Ala UI Reference */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Parlemen Padmaraja Title */}
          <Link href="/portal" className="flex items-center gap-3.5 group shrink-0">
            <PadmarajaLogo size="sm" rounded="full" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-none">
                PARLEMEN PADMARAJA
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">
                DPM FPP Universitas 17 Agustus 1945 Banyuwangi
              </span>
            </div>
          </Link>

          {/* Center Navigation Menu (Clean Uppercase Bold Like Reference Mockup) */}
          <nav className="hidden lg:flex items-center justify-center gap-7 flex-1 px-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-black tracking-wider transition-all duration-200 py-2 relative ${
                    isActive
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Sleek Pill Button (Book Trip Style -> Login Pengurus) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/login"
              className="bg-slate-900 text-white hover:bg-black active:scale-95 transition-all duration-200 px-6 py-2.5 rounded-full font-extrabold text-xs tracking-wide flex items-center gap-2 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Login Pengurus</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>

            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka Menu Navigasi"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          <div className="relative w-[300px] sm:w-[340px] bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 z-10 animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                    DPM
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">Parlemen Padmaraja</span>
                    <span className="text-[10px] text-blue-600 font-semibold">DPM FPP Universitas 17 Agustus 1945 Banyuwangi</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup Menu"
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-xs font-extrabold tracking-wider transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <Link
                  href="/portal/lacak-aspirasi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center block transition-colors"
                >
                  🔍 Lacak Status Aspirasi
                </Link>
                <Link
                  href="/portal/galeri"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center block transition-colors"
                >
                  📸 Galeri Kegiatan & FAQ
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-black transition-all"
              >
                <span>Login Pengurus Internal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-slate-400 font-medium mt-3">
                © 2026 Parlemen Padmaraja DPM FPP Universitas 17 Agustus 1945 Banyuwangi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Konten Utama Halaman Portal */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer Bersih & Kontras */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <PadmarajaLogo size="sm" rounded="xl" />
                <span className="text-xl font-black tracking-tight text-white">
                  PARLEMEN PADMARAJA
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Dewan Perwakilan Mahasiswa Fakultas Pertanian dan Perikanan Universitas 17 Agustus 1945 Banyuwangi. Parlemen mahasiswa yang modern, solid, aspiratif, dan berintegritas.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sistem Digital & AI Supervision Aktif 24/7</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Navigasi Publik
              </h4>
              <ul className="space-y-2.5 text-xs font-medium text-slate-400">
                <li><Link href="/portal" className="hover:text-white transition-colors">Beranda Utama</Link></li>
                <li><Link href="/portal/tentang" className="hover:text-white transition-colors">Tentang Parlemen Padmaraja</Link></li>
                <li><Link href="/portal/proker" className="hover:text-white transition-colors">Program Kerja Komisi</Link></li>
                <li><Link href="/portal/berita" className="hover:text-white transition-colors">Berita & Pengawasan BEM</Link></li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Layanan Mahasiswa
              </h4>
              <ul className="space-y-2.5 text-xs font-medium text-slate-400">
                <li><Link href="/portal/aspirasi" className="hover:text-white transition-colors">Ajukan Aspirasi (Opsi Anonim)</Link></li>
                <li><Link href="/portal/lacak-aspirasi" className="hover:text-white transition-colors">Lacak Status Aspirasi</Link></li>
                <li><Link href="/portal/lpj" className="hover:text-white transition-colors">Transparansi Buku Kas & LPJ</Link></li>
                <li><Link href="/portal/galeri" className="hover:text-white transition-colors">Unduh AD/ART & Konstitusi</Link></li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Sekretariat & Kontak
              </h4>
              <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                <p>Gedung DPM & Senat Mahasiswa FPP Lantai 2, Kampus Universitas 17 Agustus 1945 Banyuwangi</p>
                <p className="font-semibold text-white">Email: <span className="text-blue-400">sekretariat@dpmfpp.untag-banyuwangi.ac.id</span></p>
                <p className="font-semibold text-white">Instagram: <span className="text-blue-400">@dpmfpp.untagbanyuwangi</span></p>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 Parlemen Padmaraja — DPM FPP Universitas 17 Agustus 1945 Banyuwangi. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-6 font-semibold text-slate-400">
              <Link href="/login" className="hover:text-white transition-colors">Panel Login Internal</Link>
              <span>•</span>
              <a href="#main-content" className="hover:text-white transition-colors">Kembali ke Atas ↑</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
