'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Newspaper, 
  LogOut, 
  Shield, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  HardDrive, 
  Cpu,
  Search,
  Bell
} from 'lucide-react';
import PadmarajaLogo from '../../components/PadmarajaLogo';
import type { UserRoleSession } from '../login/page';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserRoleSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('dpm_active_role');
    if (!stored) {
      router.replace('/login');
    } else {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      } catch (e) {
        router.replace('/login');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dpm_active_role');
    router.push('/login');
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center text-[#1e3a8a]">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-sm font-bold text-slate-700">Memeriksa Hak Akses...</span>
        </div>
      </div>
    );
  }

  // Daftar menu navigasi berdasarkan role RBAC (Pengelola fokus ke tugas masing-masing tanpa Dashboard Umum)
  const navItems = [
    {
      label: 'Supervisi Ketua',
      href: '/ketua',
      icon: Shield,
      roles: ['super_admin', 'ketua'],
      badge: 'Analitik AI'
    },
    {
      label: 'Sekretaris & Arsip',
      href: '/sekretaris',
      icon: FileText,
      roles: ['super_admin', 'ketua', 'sekretaris'],
      badge: 'G-Drive'
    },
    {
      label: 'Komisi Anggaran',
      href: '/keuangan',
      icon: DollarSign,
      roles: ['super_admin', 'ketua', 'keuangan'],
      badge: 'Kas'
    },
    {
      label: 'Komisi Monitoring',
      href: '/monitoring',
      icon: MessageSquare,
      roles: ['super_admin', 'ketua', 'monitoring'],
      badge: 'Pengawasan'
    },
    {
      label: 'Dashboard Umum',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin'],
      badge: ''
    }
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(session.role));

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ketua': return 'badge-emerald';
      case 'sekretaris': return 'badge-sapphire';
      case 'keuangan': return 'badge-amber';
      case 'monitoring': return 'badge-rose';
      default: return 'badge-sapphire';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200/80 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center font-extrabold shadow-md shadow-blue-900/20">
            D
          </div>
          <span className="font-bold text-sm text-slate-900">DPM FPP Dashboard</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigasi - Clean White Portal Style */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo & Branding */}
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PadmarajaLogo size="md" rounded="2xl" />
            <div>
              <div className="font-extrabold text-base text-slate-900 tracking-tight">Parlemen Padmaraja</div>
              <div className="text-[11px] text-blue-600 font-bold">DPM FPP System</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-blue-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Menu Utama
          </div>
          
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all group
                  ${isActive 
                    ? 'bg-blue-50 text-[#1e3a8a] border-l-4 border-blue-600 shadow-xs' 
                    : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-[#1e3a8a] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Stack Status & Logout */}
        <div className="p-4 border-t border-slate-200/80 space-y-3 bg-slate-50/50">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" /> G-Drive 15GB
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Ready</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Cpu className="w-3.5 h-3.5 text-blue-600" /> Gemini AI
              </span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Active</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Ganti Role</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top bar untuk Desktop - Portal Header Style */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
          
          {/* Search Pill */}
          <div className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 border border-transparent rounded-full px-5 py-2 text-sm w-80 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari data atau dokumen..." 
              className="bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 w-full text-xs font-semibold"
            />
          </div>

          {/* Right Actions & User Profile */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-xs">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* User Pill */}
            <div className="flex items-center gap-3 pl-2 bg-blue-50/80 py-1.5 px-3 rounded-full border border-blue-200">
              <div className="w-9 h-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-900/20">
                {session.nama.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold text-slate-900 leading-tight truncate max-w-[130px]">{session.nama}</div>
                <div className="text-[10px] text-blue-700 font-bold capitalize">{session.role} / Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 space-y-8 animate-fade-in">
          {children}
        </div>
      </main>

    </div>
  );
}

