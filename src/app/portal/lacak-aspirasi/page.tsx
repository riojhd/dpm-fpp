'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  MessageSquare, 
  Sparkles,
  HelpCircle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { INITIAL_ASPIRASI, AspirasiItem, getPublicAspirasi } from '../../../lib/data/portalData';

function LacakAspirasiContent() {
  const searchParams = useSearchParams();
  const [kodeInput, setKodeInput] = useState('');
  const [result, setResult] = useState<AspirasiItem | null>(null);
  const [searched, setSearched] = useState(false);
  const [allAspirasi, setAllAspirasi] = useState<AspirasiItem[]>(INITIAL_ASPIRASI);

  useEffect(() => {
    const list = getPublicAspirasi();
    setAllAspirasi(list);

    const codeParam = searchParams.get('code');
    if (codeParam) {
      setKodeInput(codeParam);
      const found = list.find(item => (item.kodePelacakan || item.kode || '').toLowerCase() === codeParam.toLowerCase());
      setResult(found || null);
      setSearched(true);
    }

    const handleUpdate = () => {
      const updated = getPublicAspirasi();
      setAllAspirasi(updated);
      if (kodeInput.trim()) {
        const found = updated.find(item => (item.kodePelacakan || item.kode || '').toLowerCase() === kodeInput.trim().toLowerCase());
        setResult(found || null);
      }
    };

    window.addEventListener('dpm_aspirasi_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dpm_aspirasi_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [searchParams, kodeInput]);

  const handleCariKode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeInput.trim()) return;

    setSearched(true);
    const found = allAspirasi.find(item => (item.kodePelacakan || item.kode || '').toLowerCase() === kodeInput.trim().toLowerCase());
    setResult(found || null);
  };

  const handleDemoSearch = (demoCode: string) => {
    setKodeInput(demoCode);
    setSearched(true);
    const found = allAspirasi.find(item => (item.kodePelacakan || item.kode || '').toLowerCase() === demoCode.toLowerCase());
    setResult(found || null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#3b82f6] text-xs font-extrabold border border-blue-200">
          <Search className="w-4 h-4 text-blue-600" />
          <span>Pelacakan Status Aspirasi 100% Tanpa Login</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Lacak Status Aspirasi & Pengaduanmu
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Masukkan **Kode Pelacakan Unik** yang didapatkan saat mengirim aspirasi (misalnya `ASP-2026-0143`). Kamu bisa memantau progres penanganan dan membaca tanggapan resmi dari komisi terkait secara real-time.
        </p>
      </div>

      {/* Box Input Pencarian Kode */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleCariKode} className="flex flex-col sm:flex-row gap-3.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={kodeInput}
              onChange={(e) => setKodeInput(e.target.value)}
              placeholder="Masukkan Kode Pelacakan (Contoh: ASP-2026-0143)"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base font-mono font-bold focus:outline-none focus:bg-white focus:border-[#3b82f6] focus:ring-4 focus:ring-blue-500/10 transition-all uppercase placeholder:font-sans placeholder:font-normal placeholder:text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-extrabold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Cari Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            Coba Kode Uji Coba:
          </span>
          <button
            type="button"
            onClick={() => handleDemoSearch('ASP-2026-0143')}
            className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            ASP-2026-0143 (Selesai)
          </button>
          <button
            type="button"
            onClick={() => handleDemoSearch('ASP-2026-0139')}
            className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            ASP-2026-0139 (Diproses)
          </button>
          <button
            type="button"
            onClick={() => handleDemoSearch('ASP-2026-0125')}
            className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            ASP-2026-0125 (Diteruskan)
          </button>
        </div>
      </div>

      {/* HASIL PENCARIAN (Kartu Status Tunggal Sesuai PRD) */}
      {searched && (
        <div className="animate-fade-in">
          {result ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
              {/* Top Accent */}
              <div className={`h-2.5 w-full absolute top-0 left-0 ${
                result.status === 'Selesai' ? 'bg-emerald-500' :
                result.status === 'Diproses' ? 'bg-amber-500' : 'bg-blue-500'
              }`}></div>

              {/* Header Kartu Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xl font-extrabold text-[#3b82f6] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                      {result.kodePelacakan || result.kode}
                    </span>
                    <span className="text-xs font-bold text-slate-400">• Tanggal: {result.tanggal}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    Kategori: {result.kategori}
                  </h2>
                </div>

                {/* Status Badge Besar Semantik */}
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-xs font-bold text-slate-400">Status Terkini:</span>
                  <span className={`px-4 py-2 rounded-2xl text-sm font-extrabold flex items-center gap-2 ${
                    result.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                      : result.status === 'Diproses'
                      ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                      : 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                  }`}>
                    <span className={`w-3 h-3 rounded-full ${
                      result.status === 'Selesai' ? 'bg-emerald-500' :
                      result.status === 'Diproses' ? 'bg-amber-500 animate-ping' : 'bg-blue-500'
                    }`}></span>
                    <span>{result.status}</span>
                  </span>
                </div>
              </div>

              {/* Isi Pesan Aspirasi */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Isi Aspirasi yang Disampaikan:
                </span>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal">
                  "{result.pesan || result.isi}"
                </div>
              </div>

              {/* Alur Pelacakan / Riwayat Penanganan */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-500 pl-2.5">
                  Timeline Penanganan Aspirasi
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-4">
                  {/* Langkah 1: Diterima & Divalidasi */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                      ✓
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">1. Aspirasi Diterima & Lolos AI Moderasi</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Aspirasi terverifikasi oleh sistem dan masuk ke kotak masuk Komisi Monitoring DPM FPP.
                    </p>
                  </div>

                  {/* Langkah 2: Diproses */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs ${
                      result.status === 'Diproses' || result.status === 'Selesai'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-500 text-white animate-pulse'
                    }`}>
                      {result.status === 'Diproses' || result.status === 'Selesai' ? '✓' : '2'}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">2. Koordinasi & Tindak Lanjut Komisi</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Komisi Monitoring berkoordinasi langsung dengan pihak terkait (Sarpras/Akademik/Dekanat/BEM).
                    </p>
                  </div>

                  {/* Langkah 3: Selesai */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs ${
                      result.status === 'Selesai' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {result.status === 'Selesai' ? '✓' : '3'}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">3. Penyelesaian & Tanggapan Resmi</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {result.status === 'Selesai'
                        ? 'Permasalahan telah diselesaikan di lapangan dan diberikan tanggapan resmi.'
                        : 'Menunggu proses penyelesaian akhir dan penerbitan tanggapan resmi.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tanggapan Resmi DPM */}
              {result.tanggapan ? (
                <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 p-6 rounded-2xl border-2 border-blue-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center text-sm font-extrabold">
                        📢
                      </span>
                      <span className="text-sm font-extrabold text-blue-950">
                        Jawaban Resmi DPM FPP
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-lg">
                      Penanggap: {result.penanggap || 'Komisi Monitoring'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium pt-1">
                    "{result.tanggapan}"
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs font-medium text-amber-900">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Tanggapan Resmi Belum Diterbitkan:</strong> Aspirasimu sedang diproses oleh pimpinan atau komisi terkait. Silakan periksa kembali halaman ini dalam 1x24 jam.
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl border border-rose-200">
                ⚠️
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Kode Pelacakan Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
                  Kode <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{kodeInput}</span> tidak cocok dengan database aspirasi aktif DPM FPP. Pastikan format penulisan sudah benar.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDemoSearch('ASP-2026-0143')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Coba dengan Kode Demo ASP-2026-0143</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Nav back */}
      <div className="text-center pt-4">
        <Link
          href="/portal/aspirasi"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#3b82f6] hover:underline"
        >
          <span>← Kembali ke Formulir Pengaduan & Feed Aspirasi</span>
        </Link>
      </div>

    </div>
  );
}

export default function LacakAspirasiPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Memuat Pelacakan Aspirasi...</div>}>
      <LacakAspirasiContent />
    </Suspense>
  );
}
