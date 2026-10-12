'use client';

import { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers 
} from 'lucide-react';
import { generateExecutiveBrief } from '../../../lib/ai/gemini';

export default function KetuaPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'speech_ai'>('overview');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const handleGenerateReport = async () => {
    setLoadingAi(true);
    try {
      const res = await generateExecutiveBrief({
        totalKas: "Rp 4.650.000 (Surplus Triwulan II)",
        totalAnggota: 42,
        arsipSurat: 128,
        aspirasiMenunggu: 15,
        prokerSelesai: "78%"
      });
      setAiReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header - Harmonized with Public Portal Palette */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold">Pimpinan Eksekutif</span>
            <span className="text-xs text-slate-400 font-semibold">Read-Only Supervisi & Analisis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Dashboard Analitik & Supervisi</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Pantau seluruh kinerja komisi keuangan, kesekretariatan, dan monitoring secara komprehensif.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Overview Analitik</span>
          </button>

          <button
            onClick={() => setActiveTab('speech_ai')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'speech_ai' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Speech & Report Generator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW ANALITIK */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Kesehatan Keuangan</span>
                <span className="badge badge-emerald">Surplus</span>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">Rp 4.650.000</div>
                <div className="text-xs font-bold text-emerald-600 mt-1">✓ Kas operasional tercukupi hingga akhir periode</div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Audit Terakhir:</span>
                <strong className="text-slate-800 font-extrabold">10 Juni 2026</strong>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Kepatuhan Arsip G-Drive</span>
                <span className="badge badge-sapphire">100% Digital</span>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">128 Dokumen</div>
                <div className="text-xs font-bold text-blue-600 mt-1">✓ Seluruh surat & LPJ terindex di Google Drive</div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Kapasitas Free:</span>
                <strong className="text-slate-800 font-extrabold">1.2 GB / 15 GB</strong>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Respon Aspirasi Publik</span>
                <span className="badge badge-amber">15 Menunggu</span>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">82% Ditanggapi</div>
                <div className="text-xs font-bold text-amber-600 mt-1">! Rata-rata waktu respon 24-48 jam</div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Aspirasi Kritis:</span>
                <strong className="text-rose-600 font-extrabold">3 Laporan</strong>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Layers className="w-5 h-5 text-emerald-600 bg-emerald-100 p-1 rounded-lg" />
              Matrik Supervisi Progres Komisi DPM FPP
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { komisi: 'Komisi Legislasi', progres: 85, status: 'Sangat Baik' },
                { komisi: 'Komisi Anggaran', progres: 95, status: 'Terverifikasi' },
                { komisi: 'Komisi Monitoring', progres: 90, status: 'Aktif Pengawasan' }
              ].map((k, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5 hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                  <div className="font-extrabold text-base text-slate-900">{k.komisi}</div>
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-500">Capaian Proker:</span>
                    <span className="font-extrabold text-blue-700">{k.progres}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${k.progres}%` }}></div>
                  </div>
                  <div className="text-xs font-bold text-slate-500 text-right">{k.status}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AI SPEECH & REPORT GENERATOR */}
      {activeTab === 'speech_ai' && (
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md space-y-6 border border-blue-800 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="bg-white/10 text-blue-100 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold block w-fit mb-2">AI Executive Assistant</span>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Generator Laporan & Sambutan Ketua Umum</h2>
              <p className="text-xs md:text-sm text-blue-100/90 mt-1 font-medium">
                AI merangkum data dari seluruh komisi untuk menghasilkan teks sambutan audiensi fakultas atau rapat akbar.
              </p>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={loadingAi}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-6 rounded-2xl text-sm font-extrabold shrink-0 cursor-pointer shadow-lg shadow-blue-900/50 transition-all"
            >
              {loadingAi ? 'AI Sedang Menyusun Laporan...' : 'Generate Laporan Eksekutif via AI'}
            </button>
          </div>

          {aiReport ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 text-slate-900 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-[#1e3a8a]">{aiReport.title}</h3>
                <p className="text-sm font-semibold text-slate-600 mt-2 leading-relaxed">{aiReport.executiveSummary}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Draft Sambutan / Arahan Resmi Ketua Umum DPM FPP:
                </h4>
                
                <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-sm font-bold text-slate-800 italic leading-relaxed whitespace-pre-line font-serif">
                  "{aiReport.speechDraft}"
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => setAiReport(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-all">Reset</button>
                <button onClick={() => alert('Laporan dan sambutan berhasil disalin ke clipboard!')} className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl py-2.5 px-5 text-xs font-extrabold cursor-pointer transition-all shadow-xs">
                  <span>Salin Naskah Sambutan</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-blue-200 text-sm font-medium bg-white/10 rounded-2xl border border-dashed border-white/20">
              Klik tombol <strong className="text-white font-bold">Generate Laporan Eksekutif via AI</strong> untuk menyusun naskah otomatis.
            </div>
          )}
        </div>
      )}

    </div>
  );
}

