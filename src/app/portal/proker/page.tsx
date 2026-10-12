'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Filter, 
  ArrowRight, 
  X, 
  Image as ImageIcon, 
  Users, 
  Target, 
  ExternalLink 
} from 'lucide-react';
import { useEffect } from 'react';
import { DATA_PROKER, ProkerItem, getPublicProkers } from '../../../lib/data/portalData';

export default function PortalProkerPage() {
  const [prokerList, setProkerList] = useState<ProkerItem[]>(DATA_PROKER);
  const [selectedKomisi, setSelectedKomisi] = useState<string>('Semua');
  const [activeModal, setActiveModal] = useState<ProkerItem | null>(null);

  useEffect(() => {
    setProkerList(getPublicProkers());

    const handleUpdate = () => {
      setProkerList(getPublicProkers());
    };

    window.addEventListener('dpm_prokers_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dpm_prokers_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const daftarKomisi = [
    'Semua',
    'Komisi Legislasi',
    'Komisi Anggaran',
    'Komisi Monitoring'
  ];

  const filteredProker = prokerList.filter(item => {
    if (selectedKomisi === 'Semua') return true;
    return item.komisi === selectedKomisi;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* Header Halaman */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold border border-purple-200">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>Pengawasan & Manajemen Program Kerja Organisasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Program Kerja DPM FPP 2026/2027
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Pantau progres, target, dan timeline pelaksanaan setiap program kerja yang dirancang oleh seluruh komisi DPM FPP demi kemajuan ekosistem kemahasiswaan Pertanian & Perikanan.
        </p>
      </div>

      {/* SEKSI 1: Filter Komisi (Sesuai PRD) */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-6">
        {daftarKomisi.map((komisi) => {
          const isSelected = selectedKomisi === komisi;
          return (
            <button
              key={komisi}
              type="button"
              onClick={() => setSelectedKomisi(komisi)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{komisi}</span>
              {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* SEKSI 2: Grid Kartu Proker (Sesuai PRD) */}
      {filteredProker.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
            📅
          </div>
          <h4 className="text-base font-bold text-slate-800">Program Kerja Tidak Ditemukan</h4>
          <p className="text-xs text-slate-500">
            Komisi "{selectedKomisi}" sedang mempersiapkan rancangan program kerja berikutnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProker.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModal(item)}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer group relative overflow-hidden"
            >
              {/* Top status accent */}
              <div className={`h-2 w-full absolute top-0 left-0 ${
                item.status === 'Selesai' ? 'bg-emerald-500' :
                item.status === 'Berjalan' ? 'bg-[#3b82f6]' : 'bg-purple-500'
              }`}></div>

              <div className="space-y-4 pt-1">
                {/* Header Kartu: Status & Komisi */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {item.komisi}
                  </span>
                  
                  {/* Status Badge (Sesuai PRD Semantik) */}
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                    item.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'Berjalan'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-purple-100 text-purple-800 border border-purple-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'Selesai' ? 'bg-emerald-500' :
                      item.status === 'Berjalan' ? 'bg-blue-500 animate-pulse' : 'bg-purple-500'
                    }`}></span>
                    <span>{item.status}</span>
                  </span>
                </div>

                {/* Nama Proker */}
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#3b82f6] transition-colors leading-snug">
                  {item.nama}
                </h3>

                {/* Ringkasan */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                  {item.ringkasan}
                </p>
              </div>

              {/* Progress & Target */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.timeline}
                  </span>
                  <span className="text-[#3b82f6] font-extrabold">{item.progres}% Selesai</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${item.progres}%` }}
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.status === 'Selesai' ? 'bg-emerald-500' :
                      item.status === 'Berjalan' ? 'bg-[#3b82f6]' : 'bg-purple-500'
                    }`}
                  ></div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
                    🎯 Target: {item.target}
                  </span>
                  <span className="text-xs font-extrabold text-[#3b82f6] group-hover:underline flex items-center gap-1">
                    Detail →
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SEKSI 3: Modal Detail Proker (Klik Kartu Sesuai PRD) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative z-10 border border-slate-200 animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                    {activeModal.komisi}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    activeModal.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeModal.status === 'Berjalan'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {activeModal.status}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {activeModal.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Deskripsi Lengkap */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Deskripsi & Tujuan Program Kerja
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeModal.deskripsi}
              </p>
            </div>

            {/* Timeline & Progress Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-1">
                <span className="text-xs font-bold text-blue-800 block">⏰ Waktu / Timeline</span>
                <span className="text-base font-extrabold text-slate-900">{activeModal.timeline}</span>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">🎯 Target Capaian</span>
                <span className="text-sm font-extrabold text-slate-900">{activeModal.target}</span>
              </div>
            </div>

            {/* Dokumentasi Kegiatan Tertaut ke Galeri (Sesuai PRD) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#3b82f6]" />
                  <span>Foto Dokumentasi Kegiatan</span>
                </h4>
                <Link
                  href="/portal/galeri"
                  onClick={() => setActiveModal(null)}
                  className="text-xs font-extrabold text-[#3b82f6] hover:underline flex items-center gap-1"
                >
                  <span>Lihat di Galeri Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {activeModal.fotoDokumentasi.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Belum ada foto dokumentasi diunggah.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {activeModal.fotoDokumentasi.map((foto, idx) => (
                    <div key={idx} className="h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                      <img src={foto} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
