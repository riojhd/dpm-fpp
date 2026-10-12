'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  Clock, 
  FolderOpen,
  TrendingUp,
  ShieldAlert,
  Calendar,
  Send
} from 'lucide-react';
import { generateExecutiveBrief } from '../../../lib/ai/gemini';
import type { UserRoleSession } from '../../login/page';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserRoleSession | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiBrief, setAiBrief] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('dpm_active_role');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
        if (parsed.role === 'ketua') {
          router.replace('/ketua');
          return;
        } else if (parsed.role === 'sekretaris') {
          router.replace('/sekretaris');
          return;
        } else if (parsed.role === 'keuangan') {
          router.replace('/keuangan');
          return;
        } else if (parsed.role === 'monitoring') {
          router.replace('/monitoring');
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [router]);

  const handleGenerateBrief = async () => {
    setLoadingAi(true);
    try {
      const result = await generateExecutiveBrief({
        totalKas: "Rp 4.650.000 (Surplus)",
        totalAnggota: 42,
        arsipSurat: 128,
        aspirasiMenunggu: 15,
        prokerSelesai: "78%"
      });
      setAiBrief(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner - Harmonized with Public Portal Palette */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden text-white border border-blue-800">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Executive Dashboard & AI Supervisi</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Selamat Datang, {session?.nama || 'Pengurus DPM'} 👋
          </h1>
          
          <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
            Anda masuk sebagai <strong className="text-amber-300 font-extrabold">{session?.jabatan || 'Admin'}</strong> pada komisi <strong className="text-white font-extrabold">{session?.komisi || 'DPM FPP'}</strong>. Seluruh aktivitas pencatatan kas, pengarsipan surat/proposal/LPJ ke G-Drive, dan moderasi aspirasi terpantau secara real-time.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid - Clean White School Management Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Saldo Kas Organisasi</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">Rp 4.650.000</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Surplus Triwulan II</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Arsip G-Drive (15GB)</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <FolderOpen className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">128 File</div>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-bold mt-1.5 bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Surat, Proposal & LPJ</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Aspirasi Mahasiswa</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">15 Pesan</div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1.5 bg-amber-50 w-fit px-2 py-0.5 rounded-full border border-amber-100">
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu Moderasi</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Progres Proker</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">78% Rata-rata</div>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-bold mt-1.5 bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100">
              <Calendar className="w-3.5 h-3.5" />
              <span>3 Proker Berjalan</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Executive Brief Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold">AI Executive Brief</span>
              <span className="text-xs text-slate-400 font-semibold">Powered by Google Gemini 2.5</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Generator Laporan Eksekutif & Sambutan Otomatis
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              AI menganalisis tren kas, arsip dokumen, dan aspirasi minggu ini untuk menyusun ringkasan eksekutif secara instan.
            </p>
          </div>

          <button
            onClick={handleGenerateBrief}
            disabled={loadingAi}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center gap-2 text-sm shrink-0 cursor-pointer shadow-md shadow-blue-500/20 transition-all"
          >
            {loadingAi ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>AI Sedang Menganalisis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Executive Brief via AI</span>
              </>
            )}
          </button>
        </div>

        {/* Hasil AI Brief */}
        {aiBrief && (
          <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-6 animate-fade-in">
            <div className="border-b border-blue-200/60 pb-4">
              <h3 className="text-lg font-extrabold text-[#1e3a8a]">{aiBrief.title}</h3>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed font-medium">{aiBrief.executiveSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Capaian Utama Minggu Ini
                </h4>
                <ul className="space-y-2">
                  {aiBrief.keyAchievements?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs font-medium">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-amber-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Action Points / Tindak Lanjut
                </h4>
                <ul className="space-y-2">
                  {aiBrief.actionPoints?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs font-medium">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-xs font-extrabold text-[#1e3a8a] uppercase tracking-wider">Draf Sambutan / Arahan Ketua:</h4>
              <p className="text-xs md:text-sm text-slate-700 italic leading-relaxed font-medium">
                "{aiBrief.speechDraft}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabel Aktivitas & Arsip Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Aktivitas Keuangan Terbaru */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600 bg-emerald-100 p-1 rounded-lg" />
              Transaksi Kas Terbaru
            </h3>
            <span className="text-xs font-bold text-slate-400">Komisi Anggaran</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 flex items-center justify-between transition-all">
              <div>
                <div className="text-sm font-bold text-slate-900">Dana Kemahasiswaan Triwulan II</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">01 Juni 2026 • Pemasukan</div>
              </div>
              <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">+Rp 5.000.000</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 flex items-center justify-between transition-all">
              <div>
                <div className="text-sm font-bold text-slate-900">Konsumsi Rapat Koordinasi Akbar</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">10 Juni 2026 • Pengeluaran</div>
              </div>
              <span className="text-sm font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">-Rp 750.000</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 flex items-center justify-between transition-all">
              <div>
                <div className="text-sm font-bold text-slate-900">ATK & Kertas HVS Sekretariat</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">05 Juni 2026 • Pengeluaran</div>
              </div>
              <span className="text-sm font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">-Rp 350.000</span>
            </div>
          </div>
        </div>

        {/* Arsip Dokumen Sekretaris Terbaru */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600 bg-blue-100 p-1 rounded-lg" />
              Arsip Dokumen Terbaru (G-Drive)
            </h3>
            <span className="text-xs font-bold text-slate-400">Sekretaris Jenderal</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 flex items-center justify-between transition-all">
              <div className="overflow-hidden pr-2">
                <div className="text-sm font-bold text-slate-900 truncate">Surat Undangan Rapat Kerja Fakultas 2026</div>
                <div className="text-xs font-semibold text-blue-600 mt-0.5">Surat Masuk • 001/SM/DEKAN/FPP</div>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold shrink-0 text-[10px]">G-Drive</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 flex items-center justify-between transition-all">
              <div className="overflow-hidden pr-2">
                <div className="text-sm font-bold text-slate-900 truncate">Proposal LKMM-TD FPP 2026</div>
                <div className="text-xs font-semibold text-amber-600 mt-0.5">Proposal • PROP-012/DPM</div>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold shrink-0 text-[10px]">G-Drive</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 flex items-center justify-between transition-all">
              <div className="overflow-hidden pr-2">
                <div className="text-sm font-bold text-slate-900 truncate">LPJ Seminar Nasional Peternakan</div>
                <div className="text-xs font-semibold text-blue-600 mt-0.5">LPJ Kegiatan • LPJ-008/DPM</div>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold shrink-0 text-[10px]">G-Drive</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

