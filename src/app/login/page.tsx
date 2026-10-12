'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import PadmarajaLogo from '../../components/PadmarajaLogo';

export interface UserRoleSession {
  role: 'super_admin' | 'ketua' | 'sekretaris' | 'keuangan' | 'monitoring';
  nama: string;
  jabatan: string;
  komisi: string;
  email: string;
}

export const DEMO_ROLES: { [key: string]: UserRoleSession } = {
  ketua: {
    role: 'ketua',
    nama: 'Ahmad Rizky Pratama',
    jabatan: 'Ketua Umum DPM FPP',
    komisi: 'Pimpinan',
    email: 'ketua@dpmfpp.untag-banyuwangi.ac.id'
  },
  sekretaris: {
    role: 'sekretaris',
    nama: 'Nadia Putri Shafira',
    jabatan: 'Sekretaris Jenderal',
    komisi: 'Kesekretariatan & PSDM',
    email: 'sekretaris@dpmfpp.untag-banyuwangi.ac.id'
  },
  keuangan: {
    role: 'keuangan',
    nama: 'Bima Aryo Wicaksono',
    jabatan: 'Ketua Komisi Anggaran',
    komisi: 'Komisi Anggaran',
    email: 'keuangan@dpmfpp.untag-banyuwangi.ac.id'
  },
  monitoring: {
    role: 'monitoring',
    nama: 'Siti Zahra Al-Fath',
    jabatan: 'Ketua Komisi Monitoring & Pengawasan',
    komisi: 'Komisi Monitoring & Pengawasan BEM',
    email: 'monitoring@dpmfpp.untag-banyuwangi.ac.id'
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTargetRoute = (role: string) => {
    switch (role) {
      case 'ketua': return '/ketua';
      case 'sekretaris': return '/sekretaris';
      case 'keuangan': return '/keuangan';
      case 'monitoring': return '/monitoring';
      default: return '/ketua';
    }
  };

  const setSessionCookie = (sessionData: UserRoleSession) => {
    // Set cookie untuk middleware Next.js (selain localStorage untuk client-side)
    const cookieValue = encodeURIComponent(JSON.stringify(sessionData));
    const maxAge = 60 * 60 * 24; // 24 jam
    document.cookie = `dpm_session=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  const handleQuickLogin = (roleKey: string) => {
    setLoading(true);
    const sessionData = DEMO_ROLES[roleKey];
    localStorage.setItem('dpm_active_role', JSON.stringify(sessionData));
    setSessionCookie(sessionData);
    
    setTimeout(() => {
      router.push(getTargetRoute(sessionData.role));
    }, 400);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const foundRoleKey = Object.keys(DEMO_ROLES).find(key => DEMO_ROLES[key].email.toLowerCase() === email.toLowerCase());
    
    if (foundRoleKey || email.includes('dpm')) {
      const sessionData = foundRoleKey ? DEMO_ROLES[foundRoleKey] : {
        role: 'super_admin' as const,
        nama: 'Pengurus DPM FPP',
        jabatan: 'Administrator Eksekutif',
        komisi: 'Pimpinan Harian',
        email: email || 'admin@dpmfpp.untag-banyuwangi.ac.id'
      };
      localStorage.setItem('dpm_active_role', JSON.stringify(sessionData));
      setSessionCookie(sessionData);
      setTimeout(() => {
        router.push(getTargetRoute(sessionData.role));
      }, 400);
    } else {
      setError('Email tidak dikenali. Silakan gunakan tombol role cepat di bawah.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      {/* Subtle background blur / aesthetic dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

      {/* Main Split Login Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-200/80 relative z-10 min-h-[500px] md:min-h-[540px]">
        
        {/* LEFT PANEL (White Background with Stylized Logo & Title) */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between items-center text-center bg-white relative z-10">
          
          {/* Back link to portal */}
          <div className="w-full flex justify-start">
            <a
              href="/portal"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors py-1 px-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Portal Publik</span>
            </a>
          </div>

          {/* Center Logo Area (Matching Reference Aesthetics) */}
          <div className="my-auto py-6 flex flex-col items-center justify-center space-y-4">
            <PadmarajaLogo size="xl" rounded="3xl" />

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1e3a8a] tracking-tight uppercase">
                DPM FPP DASHBOARD
              </h1>
              <p className="text-xs sm:text-sm font-semibold italic text-slate-500 tracking-wide">
                Menuju Tata Kelola Organisasi World Class
              </p>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="text-[11px] font-semibold text-slate-400">
            Copyright © 2026 DPM FPP Universitas 17 Agustus 1945 Banyuwangi
          </div>
        </div>

        {/* RIGHT PANEL (Deep Blue Background with Diagonal Split & Clean Form) */}
        <div className="md:col-span-6 p-8 sm:p-12 bg-[#1d4ed8] text-white flex flex-col justify-center relative z-20 md:-ml-10 md:pl-20 [clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)] md:[clip-path:polygon(16%_0,_100%_0,_100%_100%,_0%_100%)] shadow-2xl">
          
          <div className="max-w-xs w-full mx-auto md:mx-0 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-300/40 text-rose-100 text-xs text-center font-semibold animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-blue-100 tracking-wide">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-white text-slate-800 rounded-lg text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition-all font-medium"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-blue-100 tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-white text-slate-800 rounded-lg text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition-all font-medium"
                />
              </div>

              {/* Remember me & Recover password */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-blue-100 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-transparent text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Silakan hubungi Administrator DPM FPP untuk mereset kata sandi.')}
                  className="text-blue-200 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Recover password
                </button>
              </div>

              {/* SIGN IN Button (Light Blue #4f80ff / #5885f8 like reference) */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#4f80ff] hover:bg-[#638ffc] active:bg-[#3d6eef] disabled:bg-blue-400/60 text-white font-black tracking-widest uppercase rounded-lg text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>SIGNING IN...</span>
                    </>
                  ) : (
                    'SIGN IN'
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* Quick Role Switcher Pill Bar below the login card for easy evaluation without typing */}
      <div className="max-w-4xl w-full mt-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-md animate-fade-in z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-bold">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Uji Coba Cepat (Langsung Masuk Peran):</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('ketua')}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer border border-slate-200 hover:border-emerald-500 shadow-2xs"
            >
              Ketua Umum
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sekretaris')}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer border border-slate-200 hover:border-blue-600 shadow-2xs"
            >
              Sekretaris
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('keuangan')}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer border border-slate-200 hover:border-amber-500 shadow-2xs"
            >
              Keuangan
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('monitoring')}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer border border-slate-200 hover:border-rose-500 shadow-2xs"
            >
              Monitoring
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
